"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { Property, pkr, supabase } from "@/lib/supabase";
import { formatArea } from "@/lib/format";
import { useUser } from "@/lib/useUser";
import { Bed, Bath, Maximize, MapPin, Heart, ShieldCheck, Sparkles } from "lucide-react";

export default function PropertyCard({ p }: { p: Property }) {
  const { t } = useLang();
  const { user } = useUser();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [imgSrc, setImgSrc] = useState(p.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80");

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    const nextState = !isSaved;
    setIsSaved(nextState);
    if (nextState) {
      await supabase.from("favorites").insert({ user_id: user.id, property_id: p.id });
    } else {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("property_id", p.id);
    }
  };

  const isRent = p.listing === "rent";
  const formattedMarla = formatArea(p.size_sqft || 2250);

  return (
    <div className="group relative rounded-3xl bg-[#0F1412] border border-white/[0.08] hover:border-gold/50 shadow-luxury-card overflow-hidden transition-all duration-500 hover:-translate-y-1.5 flex flex-col">
      <Link href={`/property/${p.id}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-black/40">
        <Image
          src={imgSrc}
          alt={p.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgSrc("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Badges on Image */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#0A0E0C]/85 backdrop-blur-md text-sand-50 border border-white/10 shadow-sm">
              {t(isRent ? "forRent" : "forSale")}
            </span>
            {p.type && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide capitalize bg-emerald/80 backdrop-blur-md text-emerald-glow border border-emerald-light/30">
                {p.type}
              </span>
            )}
          </div>

          {/* Quick Favorite Wishlist Button */}
          <button
            onClick={toggleFavorite}
            aria-label="Save to favorites"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 flex items-center justify-center text-sand-100 hover:text-gold transition shadow-md"
          >
            <Heart
              className={`w-4 h-4 transition ${
                isSaved ? "fill-gold text-gold scale-110" : "text-sand-100"
              }`}
            />
          </button>
        </div>

        {/* Price Tag Overlay on Bottom of Image */}
        <div className="absolute bottom-3 inset-x-3.5 flex items-baseline justify-between z-10">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-2xl font-bold text-sand-50 tracking-tight drop-shadow-md">
              {pkr(p.price)}
            </span>
            {isRent && (
              <span className="text-xs text-sand-200/90 font-medium font-sans">
                {t("perMonth")}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gold/20 text-gold-light border border-gold/30">
            {formattedMarla}
          </span>
        </div>
      </Link>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location / Area */}
          <div className="flex items-center gap-1.5 text-xs text-gold/90 font-medium mb-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-gold" />
            <span className="truncate">
              {p.area ? `${p.area}, ` : ""}
              {p.city}
            </span>
          </div>

          {/* Title */}
          <Link href={`/property/${p.id}`} className="block group-hover:text-gold transition-colors">
            <h3 className="text-base font-semibold text-sand-100 leading-snug line-clamp-1 font-sans">
              {p.title}
            </h3>
          </Link>
        </div>

        {/* Specifications Footer */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-sand-200/80">
          <div className="flex items-center gap-3">
            {p.bedrooms != null && (
              <div className="flex items-center gap-1" title={`${p.bedrooms} Bedrooms`}>
                <Bed className="w-3.5 h-3.5 text-mute" />
                <span>{p.bedrooms}</span>
              </div>
            )}
            {p.bathrooms != null && (
              <div className="flex items-center gap-1" title={`${p.bathrooms} Bathrooms`}>
                <Bath className="w-3.5 h-3.5 text-mute" />
                <span>{p.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1" title="Area in square feet">
              <Maximize className="w-3.5 h-3.5 text-mute" />
              <span>{p.size_sqft} sqft</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-glow/90 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-glow" />
            <span>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
