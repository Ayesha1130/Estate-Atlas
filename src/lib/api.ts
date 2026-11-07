import { createClient } from "@supabase/supabase-js";

// Safe, bounded in-memory rate limiting map for development / single-instance
const hits = new Map<string, { n: number; t: number }>();
let lastPruned = Date.now();

function pruneExpiredHits(windowMs: number) {
  const now = Date.now();
  if (now - lastPruned > 120_000) {
    // Prune every 2 minutes
    lastPruned = now;
    for (const [key, record] of hits.entries()) {
      if (now - record.t > windowMs * 2) {
        hits.delete(key);
      }
    }
  }
}

/**
 * Multi-tier rate limiting:
 * 1. Upstash Redis (if UPSTASH_REDIS_REST_URL and TOKEN provided)
 * 2. Shared Supabase Postgres RPC `rate_limit_hit` (production instance sync)
 * 3. In-memory sliding window fallback (zero external dependencies)
 */
export async function rateLimit(
  req: Request,
  key: string,
  limit = 20,
  windowMs = 60_000
): Promise<boolean> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "local";
  const k = `${key}:${ip}`;

  // Strategy 1: Upstash Redis (Optional)
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const tok = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && tok) {
    try {
      const r = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}` },
        body: JSON.stringify([
          ["INCR", k],
          ["EXPIRE", k, String(Math.ceil(windowMs / 1000)), "NX"],
        ]),
      });
      const j = await r.json();
      return Number(j[0].result) <= limit;
    } catch {
      // Fall through to database / memory
    }
  }

  // Strategy 2: Shared Postgres Limiter (Production without Redis)
  if (
    process.env.NODE_ENV === "production" &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    try {
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { data, error } = await sb.rpc("rate_limit_hit", {
        p_key: k,
        p_limit: limit,
        p_window: Math.ceil(windowMs / 1000),
      });
      if (!error && typeof data === "boolean") return data;
    } catch {
      // Fall through to memory
    }
  }

  // Strategy 3: Safe In-Memory Token Bucket Fallback
  pruneExpiredHits(windowMs);
  const now = Date.now();
  const h = hits.get(k);
  if (!h || now - h.t > windowMs) {
    hits.set(k, { n: 1, t: now });
    return true;
  }
  h.n++;
  return h.n <= limit;
}

export const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
export const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};
export { CITIES, TYPES } from "./constants";
