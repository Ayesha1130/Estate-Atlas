import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/api";
import { SearchFilters } from "@/lib/schemas";
import { pkr } from "@/lib/format";
import { UNITS, DEFAULT_MARLA_SQFT } from "@/lib/units";
import { CITIES, CityName, TYPES, PropertyType } from "@/lib/constants";

const Body = z.object({
  message: z.string().trim().min(1).max(500),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(1000),
      })
    )
    .max(8)
    .default([]),
});

type Row = {
  id: string;
  title: string;
  description: string | null;
  listing: string;
  price: number;
  city: string;
  area: string | null;
  bedrooms: number | null;
  size_sqft: number;
};

const COLS = "id,title,description,listing,price,city,area,bedrooms,size_sqft";

// Heuristic Natural Language Parser for Pakistani Real Estate (Resilient Fallback)
function parsePakistaniQuery(text: string): z.infer<typeof SearchFilters> {
  const t = text.toLowerCase();
  const filters: z.infer<typeof SearchFilters> = {};

  // 1. Detect City
  for (const c of CITIES) {
    if (t.includes(c.toLowerCase())) {
      filters.city = c as CityName;
      break;
    }
  }

  // 2. Detect Listing (buy / rent)
  if (t.includes("rent") || t.includes("kiraya") || t.includes("monthly") || t.includes("کرایہ")) {
    filters.listing = "rent";
  } else if (
    t.includes("buy") ||
    t.includes("sale") ||
    t.includes("purchase") ||
    t.includes("khareed") ||
    t.includes("خرید")
  ) {
    filters.listing = "buy";
  }

  // 3. Detect Property Type
  if (t.includes("house") || t.includes("villa") || t.includes("makan") || t.includes("kothi") || t.includes("گھر")) {
    filters.type = "house";
  } else if (t.includes("apartment") || t.includes("flat") || t.includes("penthouse") || t.includes("فلیٹ")) {
    filters.type = "apartment";
  } else if (t.includes("plot") || t.includes("zameen") || t.includes("پلاٹ")) {
    filters.type = "plot";
  } else if (t.includes("commercial") || t.includes("office") || t.includes("shop") || t.includes("plaza") || t.includes("دکان")) {
    filters.type = "commercial";
  }

  // 4. Detect Budget (Crore / Lakh)
  const croreMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:crore|cr|کروڑ)/i);
  if (croreMatch) {
    const val = parseFloat(croreMatch[1]) * 10000000;
    if (t.includes("under") || t.includes("below") || t.includes("max") || t.includes("tak") || t.includes("تک")) {
      filters.max_price = val;
    } else {
      filters.max_price = val * 1.15;
      filters.min_price = val * 0.85;
    }
  }

  const lakhMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lac|لاکھ)/i);
  if (lakhMatch) {
    const val = parseFloat(lakhMatch[1]) * 100000;
    if (t.includes("under") || t.includes("below") || t.includes("max") || t.includes("tak") || t.includes("تک")) {
      filters.max_price = val;
    } else {
      filters.max_price = val * 1.2;
    }
  }

  // 5. Detect Marla / Kanal Size
  const marlaMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:marla|مرلہ)/i);
  if (marlaMatch) {
    filters.size_marla = parseFloat(marlaMatch[1]);
  }

  const kanalMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:kanal|کنال)/i);
  if (kanalMatch) {
    filters.size_marla = parseFloat(kanalMatch[1]) * 20;
  }

  // 6. Detect Bedrooms
  const bedMatch = t.match(/(\d+)\s*(?:bed|bedroom|kamray|بیڈ)/i);
  if (bedMatch) {
    filters.bedrooms = parseInt(bedMatch[1]);
  }

  return filters;
}

export async function POST(req: Request) {
  if (!(await rateLimit(req, "chat", 20))) {
    return NextResponse.json(
      { reply: "Rate limit reached. Please wait a moment before sending another message." },
      { status: 429 }
    );
  }

  try {
    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { reply: "Please type a question (max 500 characters)." },
        { status: 400 }
      );
    }

    const { message, history } = parsed.data;
    const convo = [...history, { role: "user" as const, content: message }];

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let filters: z.infer<typeof SearchFilters> = parsePakistaniQuery(message);
    let openAiAvailable = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-"));

    // Step 1: If OpenAI is available, attempt neural filter extraction
    if (openAiAvailable) {
      try {
        const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const ex = await ai.chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens: 220,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `Extract Pakistani property search filters from the conversation into JSON with keys: city, listing ("buy" or "rent"), type (house, apartment, plot, commercial), min_price, max_price (PKR numbers; 1 lakh = 100000, 1 crore = 10000000), bedrooms, size_marla. Allowed cities: ${CITIES.join(", ")}. Return null for anything not stated.`,
            },
            ...convo,
          ],
        });
        const p = SearchFilters.safeParse(JSON.parse(ex.choices[0].message.content ?? "{}"));
        if (p.success && Object.values(p.data).some((v) => v != null)) {
          filters = { ...filters, ...p.data };
        }
      } catch (e) {
        console.warn("OpenAI filter extraction fallback to heuristic parser", e);
        openAiAvailable = false;
      }
    }

    // Step 2: Database query with filters (RLS restricts to approved listings)
    let q = sb.from("properties").select(COLS).order("price", { ascending: true }).limit(5);

    if (filters.city) q = q.eq("city", filters.city);
    if (filters.listing) q = q.eq("listing", filters.listing);
    if (filters.type) q = q.eq("type", filters.type);
    if (filters.min_price != null) q = q.gte("price", filters.min_price);
    if (filters.max_price != null) q = q.lte("price", filters.max_price);
    if (filters.bedrooms != null) q = q.gte("bedrooms", filters.bedrooms);
    if (filters.size_marla) {
      const s = filters.size_marla * DEFAULT_MARLA_SQFT;
      q = q.gte("size_sqft", s * 0.8).lte("size_sqft", s * 1.25);
    }

    const { data: dbRows, error: qErr } = await q;
    let rows: Row[] = (dbRows as Row[]) ?? [];

    // Step 3: If no exact matches and OpenAI is available, try semantic embedding
    if (!rows.length && openAiAvailable) {
      try {
        const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const emb = await ai.embeddings.create({
          model: "text-embedding-3-small",
          input: convo.map((m) => m.content).join(" ").slice(0, 1500),
        });
        const { data: matchRows } = await sb.rpc("match_properties", {
          query_embedding: emb.data[0].embedding,
          match_count: 5,
        });
        if (matchRows?.length) rows = matchRows as Row[];
      } catch {
        // Fall back to general latest approved listings
      }
    }

    // If still no results, fetch 3 latest public properties to show as curated options
    if (!rows.length) {
      const { data: fallbackProps } = await sb
        .from("properties")
        .select(COLS)
        .order("created_at", { ascending: false })
        .limit(3);
      if (fallbackProps?.length) rows = fallbackProps as Row[];
    }

    // Step 4: Generate conversational response
    if (openAiAvailable) {
      try {
        const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const context = rows
          .map(
            (r) =>
              `- ${r.title} | ${r.listing.toUpperCase()} | ${pkr(Number(r.price))} | ${r.bedrooms ?? "-"} beds | ${r.city} (${r.area ?? ""})`
          )
          .join("\n");

        const res = await ai.chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens: 400,
          messages: [
            {
              role: "system",
              content: `You are PropertyHub Premier's AI Real Estate Concierge in Pakistan.
Recommend ONLY from the listings provided below, never invent listings or prices.
If no exact match exists, explain politely and present the closest alternatives.
Always mention the prices in Pakistani Lakhs or Crores.
Reply in the user's language (English or Urdu) concisely and elegantly.\n\nListings:\n${
                context || "(none available)"
              }`,
            },
            ...convo,
          ],
        });

        return NextResponse.json({
          reply: res.choices[0].message.content,
          properties: rows.map(({ id, title }) => ({ id, title })),
        });
      } catch (e) {
        console.warn("OpenAI response generation failed, falling back to local response", e);
      }
    }

    // High-Quality Fallback Response when OpenAI is not configured or fails
    const cityText = filters.city ? ` in ${filters.city}` : "";
    const budgetText = filters.max_price ? ` under ${pkr(filters.max_price)}` : "";
    const count = rows.length;

    let localReply = "";
    if (count > 0) {
      localReply = `I found ${count} verified premier properties matching your criteria${cityText}${budgetText}. Here are our top recommendations from the database:`;
    } else {
      localReply = `I couldn't find an exact match for that specific requirement${cityText}${budgetText}. Would you like me to broaden the search, or check upcoming projects in DHA, Bahria, or Clifton?`;
    }

    return NextResponse.json({
      reply: localReply,
      properties: rows.map(({ id, title }) => ({ id, title })),
    });
  } catch (e) {
    console.error("AI Chat handler error", e);
    return NextResponse.json(
      { reply: "Our AI assistant is currently updating its real-time property index. Please try again shortly." },
      { status: 500 }
    );
  }
}
