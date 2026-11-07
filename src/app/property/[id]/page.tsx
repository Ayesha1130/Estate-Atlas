import { Property } from "@/lib/supabase";
import { pkr, formatArea } from "@/lib/format";
import T from "@/components/T";
import Gallery from "@/components/Gallery";
import LocationMap from "@/components/LocationMap";
import ShareButton from "@/components/ShareButton";
import PropertyCard from "@/components/PropertyCard";
import { serverSupabase } from "@/lib/supabase-server";
import FavoriteButton from "@/components/FavoriteButton";
import InquiryForm from "@/components/InquiryForm";
import Emi from "@/components/Emi";
import { notFound } from "next/navigation";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  ShieldCheck,
  Building,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Detail({ params }: { params: { id: string } }) {
  const { data } = await serverSupabase()
    .from("properties")
    .select("*")
    .eq("id", params.id)
    .single();

  const p = data as Property | null;
  if (!p) notFound();

  const { data: imgs } = await serverSupabase()
    .from("property_images")
    .select("url")
    .eq("property_id", p.id)
    .order("position");

  const images = imgs?.length ? imgs.map((i) => i.url as string) : [p.image];

  const { data: rel } = await serverSupabase()
    .from("properties")
    .select("*")
    .eq("city", p.city)
    .eq("listing", p.listing)
    .neq("id", p.id)
    .limit(3);

  const formattedMarla = formatArea(p.size_sqft || 2250);
  const isRent = p.listing === "rent";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-mute">
        <div className="flex items-center gap-2">
          <span>Properties</span>
          <span>/</span>
          <span className="text-gold capitalize">{p.city}</span>
          <span>/</span>
          <span className="text-sand-100 truncate max-w-xs">{p.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {p.status === "pending" && (
            <span className="px-3 py-1 rounded-full bg-yellow-950/60 border border-yellow-700/50 text-yellow-300 font-medium">
              <T k="pendingNote" />
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-emerald/60 border border-emerald-light/40 text-emerald-glow font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Title</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Gallery & Details */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Gallery Column */}
        <div className="lg:col-span-7">
          <Gallery images={images} alt={p.title} />

          {/* Location Map Section */}
          <div className="mt-8 rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 shadow-luxury-card">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gold" />
              <h3 className="font-serif text-xl text-sand-50 font-normal">
                Location & Connectivity
              </h3>
            </div>
            <p className="text-xs text-mute mb-4">
              Approximate neighborhood coordinate. Verified title deed and society map available during private inspection.
            </p>
            <LocationMap city={p.city} area={p.area} />
          </div>
        </div>

        {/* Right Information & Action Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 sm:p-8 shadow-luxury-card">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold/15 text-gold border border-gold/30">
                <T k={isRent ? "forRent" : "forSale"} />
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium tracking-wide capitalize bg-card border border-line text-sand-200">
                {p.type}
              </span>
            </div>

            {/* Title & Price */}
            <h1 className="font-serif text-2xl sm:text-3xl text-sand-50 font-normal leading-snug">
              {p.title}
            </h1>

            <div className="flex items-center gap-1.5 text-xs text-gold font-medium mt-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {p.area ? `${p.area}, ` : ""}
                {p.city}, Pakistan
              </span>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-mute block mb-1">
                  Demand Price
                </span>
                <span className="font-serif text-3xl sm:text-4xl font-bold text-sand-50">
                  {pkr(p.price)}
                </span>
                {isRent && (
                  <span className="text-xs text-sand-200/90 ml-1.5 font-sans">
                    <T k="perMonth" />
                  </span>
                )}
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald/40 text-emerald-glow text-xs font-semibold border border-emerald-light/30">
                {formattedMarla}
              </span>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/[0.06] text-center">
              <div className="rounded-2xl bg-[#090D0B] border border-line p-3.5">
                <Bed className="w-4 h-4 text-gold mx-auto mb-1" />
                <span className="font-serif text-lg text-sand-50 font-bold">
                  {p.bedrooms ?? "-"}
                </span>
                <span className="text-[11px] text-mute block mt-0.5">
                  <T k="beds" />
                </span>
              </div>

              <div className="rounded-2xl bg-[#090D0B] border border-line p-3.5">
                <Bath className="w-4 h-4 text-gold mx-auto mb-1" />
                <span className="font-serif text-lg text-sand-50 font-bold">
                  {p.bathrooms ?? "-"}
                </span>
                <span className="text-[11px] text-mute block mt-0.5">
                  <T k="baths" />
                </span>
              </div>

              <div className="rounded-2xl bg-[#090D0B] border border-line p-3.5">
                <Maximize className="w-4 h-4 text-gold mx-auto mb-1" />
                <span className="font-serif text-lg text-sand-50 font-bold">
                  {p.size_sqft}
                </span>
                <span className="text-[11px] text-mute block mt-0.5">
                  <T k="sqft" />
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <h3 className="text-xs uppercase font-bold tracking-widest text-sand-50 mb-2">
                Architectural Summary
              </h3>
              <p className="text-sand-200/80 text-sm leading-relaxed font-light whitespace-pre-line">
                {p.description || "Architecturally crafted residence offering contemporary living, high ceilings, imported fixtures, and secure access."}
              </p>
            </div>

            {/* Action Bar (Favorites & Share) */}
            <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center gap-3">
              <div className="flex-1">
                <FavoriteButton id={p.id} />
              </div>
              <ShareButton title={p.title} />
            </div>
          </div>

          {/* Contact / Inquiry Form Component */}
          <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 sm:p-8 shadow-luxury-card">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-gold" />
              <h3 className="font-serif text-xl text-sand-50 font-normal">
                Schedule Private Viewing
              </h3>
            </div>
            <p className="text-xs text-mute mb-5">
              Submit your inquiry directly to the portfolio manager representing this listing.
            </p>
            <InquiryForm id={p.id} />
          </div>
        </div>
      </div>

      {/* Mortgage / Financing Simulator (for buy listings) */}
      {!isRent && (
        <section className="mt-16">
          <div className="mb-6">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block mb-1">
              Islamic / Commercial Financing
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-sand-50 font-normal">
              Mortgage & Installment Calculator
            </h2>
          </div>
          <Emi price={p.price} />
        </section>
      )}

      {/* Related Properties */}
      {!!rel?.length && (
        <section className="mt-16 pt-12 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-sand-50 font-normal">
              <T k="related" />
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(rel as Property[]).map((r) => (
              <PropertyCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
