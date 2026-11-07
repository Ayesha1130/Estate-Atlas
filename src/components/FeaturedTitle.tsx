"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FeaturedTitle() {
  const { t } = useLang();
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Architectural Portfolio</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
          {t("featured")}
        </h2>
      </div>
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-sm text-sand-200 hover:text-gold transition font-medium group"
      >
        <span>View all luxury listings</span>
        <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
