import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/api";
import { ListingBody } from "@/lib/schemas";

const Body = ListingBody;

export async function POST(req: Request) {
  if (!(await rateLimit(req, "listing", 8))) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: u } = await admin.auth.getUser(token);
    if (!u.user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid data" },
        { status: 400 }
      );
    }

    const b = parsed.data;
    const beds = b.bedrooms ?? null;

    // Resilient OpenAI embedding: if key is present & valid, compute embedding; otherwise null
    let embedding: number[] | null = null;
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-")) {
      try {
        const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const emb = await ai.embeddings.create({
          model: "text-embedding-3-small",
          input: `${b.title}. ${b.description} ${b.city} ${b.area} Price PKR ${b.price}`,
        });
        embedding = emb.data[0].embedding;
      } catch (err) {
        console.warn("OpenAI embedding skipped during property creation:", err);
      }
    }

    const { data: row, error } = await admin
      .from("properties")
      .insert({
        owner_id: u.user.id,
        status: "pending",
        title: b.title,
        description: b.description,
        listing: b.listing,
        type: b.type,
        price: b.price,
        city: b.city,
        area: b.area,
        bedrooms: beds,
        bathrooms: beds ? Math.max(1, beds - 1) : null,
        size_sqft: b.size_sqft || 2250,
        image: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80`,
        embedding,
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    console.error("listing error", e);
    return NextResponse.json({ error: "Could not save listing" }, { status: 500 });
  }
}
