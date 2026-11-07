"use client";
import { CITY_COORDS } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import { MapPin } from "lucide-react";

export default function LocationMap({ city, area }: { city: string; area?: string }) {
  const { t } = useLang();
  const coords = CITY_COORDS[city] || [31.5204, 74.3587]; // Fallback to Lahore
  const [lat, lng] = coords;

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.08},${lat - 0.05},${lng + 0.08},${lat + 0.05}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-sand-100 font-medium flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gold" />
          <span>{area ? `${area}, ` : ""}{city}, Pakistan</span>
        </span>
        <span className="text-mute text-[11px] font-mono">{t("mapNote")}</span>
      </div>
      <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-inner bg-[#080B0A]">
        <iframe
          title={`Map of ${city}`}
          src={src}
          loading="lazy"
          className="w-full h-72 border-0 filter brightness-90 contrast-105"
        />
      </div>
    </div>
  );
}
