import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data } = await supabase.from("properties").select("id,created_at").limit(1000);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, priority: 1.0, changeFrequency: "daily" },
    { url: `${base}/properties`, priority: 0.9, changeFrequency: "daily" },
    { url: `${base}/tools`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/sell`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/login`, priority: 0.5, changeFrequency: "yearly" },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = (data ?? []).map((p) => ({
    url: `${base}/property/${p.id}`,
    lastModified: p.created_at,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  return [...staticRoutes, ...propertyRoutes];
}
