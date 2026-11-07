import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/api";
import { ListingBody } from "@/lib/schemas";

const StatusBody = z.object({ status: z.enum(["approved", "closed"]) }).strict();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await rateLimit(req, "edit", 25))) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  try {
    if (!z.string().uuid().safeParse(params.id).success) {
      return NextResponse.json({ error: "Bad id" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: u } = await admin.auth.getUser(token);
    if (!u.user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { data: cur } = await admin
      .from("properties")
      .select("owner_id,status")
      .eq("id", params.id)
      .single();

    if (!cur || cur.owner_id !== u.user.id) {
      return NextResponse.json({ error: "Property not found or unauthorized" }, { status: 404 });
    }

    const raw = await req.json().catch(() => null);

    // Case 1: Toggling close / reopen status
    const st = StatusBody.safeParse(raw);
    if (st.success) {
      if (!["approved", "closed"].includes(cur.status)) {
        return NextResponse.json(
          { error: "Only approved listings can be closed or reopened" },
          { status: 400 }
        );
      }
      await admin.from("properties").update({ status: st.data.status }).eq("id", params.id);
      return NextResponse.json({ ok: true });
    }

    // Case 2: Updating property details
    const parsed = ListingBody.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid data" },
        { status: 400 }
      );
    }

    const b = parsed.data;
    const beds = b.bedrooms ?? null;

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
        console.warn("OpenAI embedding skipped during property update:", err);
      }
    }

    const updatePayload: Record<string, any> = {
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
      status: "pending", // edits require administrative re-verification
    };

    if (embedding) {
      updatePayload.embedding = embedding;
    }

    const { error } = await admin
      .from("properties")
      .update(updatePayload)
      .eq("id", params.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("edit error", e);
    return NextResponse.json({ error: "Could not update listing" }, { status: 500 });
  }
}
