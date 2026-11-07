import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env or .env.local");
  process.exit(1);
}

const sb = createClient(supabaseUrl, supabaseKey);

const citiesData = [
  { city: "Lahore", area: "DHA Phase 6", tag: "Golf View Estate" },
  { city: "Karachi", area: "Clifton Block 4", tag: "Seafront Luxury" },
  { city: "Islamabad", area: "Sector F-7/2", tag: "Margalla Enclave" },
  { city: "Rawalpindi", area: "Bahria Town Phase 8", tag: "Gated Residence" },
  { city: "Faisalabad", area: "Canal Road", tag: "Prime Estate" },
  { city: "Lahore", area: "Gulberg III", tag: "Commercial Plaza" },
  { city: "Karachi", area: "DHA Phase 8", tag: "Creek Residence" },
  { city: "Islamabad", area: "Sector E-7", tag: "Diplomatic Villa" },
];

const types = ["house", "apartment", "plot", "commercial"];

const luxuryImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
];

async function main() {
  console.log("Seeding PropertyHub Premier database...");

  let ai: OpenAI | null = null;
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-")) {
    ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  // Clear demo rows only
  await sb.from("properties").delete().is("owner_id", null);

  const rows = [];
  for (let i = 0; i < 20; i++) {
    const loc = citiesData[i % citiesData.length];
    const type = types[i % types.length];
    const listing = i % 3 === 0 ? "rent" : "buy";
    const bedrooms = type === "plot" || type === "commercial" ? null : 3 + (i % 4);

    let price = 0;
    if (listing === "rent") {
      price = 120000 + i * 25000; // PKR 1.2 Lakh to 6 Lakh / month
    } else {
      price = (35 + i * 15) * 1000000; // PKR 3.5 Crore to 32 Crore
    }

    const title = `${bedrooms ? `${bedrooms} Bed ` : ""}${
      type === "house" ? "Designer Villa" : type === "apartment" ? "Luxury Penthouse" : type[0].toUpperCase() + type.slice(1)
    } in ${loc.area}, ${loc.city}`;

    const description = `Architecturally designed ${type} for ${
      listing === "buy" ? "sale" : "rent"
    } in ${loc.area}, ${loc.city}. Featuring floor-to-ceiling double-glazed windows, imported European fittings, private car porch, full backup generator integration, and gated 24/7 society security.`;

    let embedding: number[] | null = null;
    if (ai) {
      try {
        const emb = await ai.embeddings.create({
          model: "text-embedding-3-small",
          input: `${title}. ${description} ${loc.city} ${loc.area} Price PKR ${price}`,
        });
        embedding = emb.data[0].embedding;
      } catch {
        // Continue with null embedding
      }
    }

    rows.push({
      title,
      description,
      listing,
      type,
      price,
      city: loc.city,
      area: loc.area,
      bedrooms,
      bathrooms: bedrooms ? Math.max(1, bedrooms - 1) : null,
      size_sqft: 2250 + (i % 5) * 1125, // 10 Marla, 15 Marla, 1 Kanal, etc.
      image: luxuryImages[i % luxuryImages.length],
      embedding,
      status: "approved",
    });
  }

  const { data, error } = await sb.from("properties").insert(rows).select("id");
  if (error || !data) {
    console.error("Property insert failed:", error?.message);
    return;
  }

  // Add multiple high-resolution photos for each seeded listing
  const imgs = data.flatMap((r, i) =>
    [0, 1, 2].map((j) => ({
      property_id: r.id,
      position: j,
      url: luxuryImages[(i + j) % luxuryImages.length],
    }))
  );

  const { error: e2 } = await sb.from("property_images").insert(imgs);
  if (e2) {
    console.warn("Images insert note:", e2.message);
  }

  console.log(`Successfully seeded ${rows.length} premier properties with ${imgs.length} gallery photographs.`);
}

main().catch((err) => {
  console.error("Seed execution error:", err);
});
