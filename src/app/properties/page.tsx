import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { supabase, Property } from "@/lib/supabase";
import FilterForm from "@/components/FilterForm";
import T from "@/components/T";
import { Sparkles, ArrowLeft, ArrowRight, Building2, Sliders } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Luxury Real Estate & Properties Across Pakistan",
  description: "Browse verified signature villas, designer penthouses, and commercial plots for sale and rent in Lahore, Karachi, and Islamabad.",
};

const PER = 12;

export default async function Properties({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1") || 1);

  let q = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .range((page - 1) * PER, page * PER - 1);

  if (searchParams.listing) q = q.eq("listing", searchParams.listing);
  if (searchParams.city) q = q.eq("city", searchParams.city);
  if (searchParams.type) q = q.eq("type", searchParams.type);

  const n = (v?: string) => (v && Number.isFinite(+v) && +v >= 0 ? +v : null);
  const min = n(searchParams.min);
  const max = n(searchParams.max);
  const beds = n(searchParams.beds);
  const baths = n(searchParams.baths);
  const size = n(searchParams.size);

  if (min !== null) q = q.gte("price", min);
  if (max !== null) q = q.lte("price", max);
  if (beds) q = q.gte("bedrooms", beds);
  if (baths) q = q.gte("bathrooms", baths);
  if (size) q = q.gte("size_sqft", size);

  if (searchParams.sort === "low") {
    q = q.order("price", { ascending: true });
  } else if (searchParams.sort === "high") {
    q = q.order("price", { ascending: false });
  } else {
    q = q.order("created_at", { ascending: false });
  }

  const { data, count } = await q;
  const properties = (data as Property[] | null) ?? [];
  const pages = Math.ceil((count ?? 0) / PER);

  const href = (targetPage: number) => {
    const p = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") p.set(k, v);
    });
    p.set("page", String(targetPage));
    return `/properties?${p.toString()}`;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-2">
          Curated Discovery
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-sand-50 font-normal leading-tight">
          Pakistan Premier Marketplace
        </h1>
        <p className="text-sand-200/80 text-sm sm:text-base mt-2 font-light">
          Browse verified residential estates, penthouses, and commercial plots with transparent pricing.
        </p>
      </div>

      {/* Advanced Filter Form */}
      <FilterForm sp={searchParams} />

      {/* Results Meta Count */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06] text-xs sm:text-sm text-sand-200/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-glow" />
          <span className="font-semibold text-sand-50">{count ?? 0}</span>
          <span><T k="props" /></span>
        </div>
        {searchParams.city && (
          <span className="text-gold font-medium">
            Filtering in {searchParams.city}
          </span>
        )}
      </div>

      {/* Property Cards Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {properties.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        /* Empty State with AI Help Banner */
        <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-12 text-center max-w-xl mx-auto my-12 shadow-luxury-card">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-sand-50 mb-2 font-normal">
            No Exact Matches Found
          </h3>
          <p className="text-sand-200/70 text-sm leading-relaxed mb-6 font-light">
            <T k="none" />
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/properties"
              className="px-6 py-2.5 rounded-full bg-sand-100 text-[#080B0A] font-semibold text-xs uppercase tracking-wider transition"
            >
              Reset All Filters
            </Link>
            <Link
              href="/sell"
              className="px-6 py-2.5 rounded-full bg-card border border-line text-sand-200 hover:text-gold text-xs font-semibold tracking-wider uppercase transition"
            >
              List A Property
            </Link>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-14 text-xs font-medium">
          {page > 1 && (
            <Link
              href={href(page - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#0D1412] hover:bg-card border border-line hover:border-gold/50 text-sand-100 transition shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-gold" />
              <span><T k="prev" /></span>
            </Link>
          )}

          <div className="px-4 py-2 rounded-full bg-[#090D0B] border border-line text-sand-200 font-mono">
            <span><T k="page" /> {page} / {pages}</span>
          </div>

          {page < pages && (
            <Link
              href={href(page + 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#0D1412] hover:bg-card border border-line hover:border-gold/50 text-sand-100 transition shadow-sm"
            >
              <span><T k="next" /></span>
              <ArrowRight className="w-3.5 h-3.5 text-gold" />
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
