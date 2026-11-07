"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { POPULAR_LOCATIONS, LUXURY_CATEGORIES } from "@/lib/constants";
import {
  ShieldCheck,
  Sparkles,
  Calculator,
  ArrowRight,
  Building2,
  MapPin,
  TrendingUp,
  Award,
} from "lucide-react";

export function Categories() {
  const { t } = useLang();
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block mb-2">
            Signature Asset Classes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
            {t("browseBy")}
          </h2>
        </div>
        <p className="text-sand-200/70 text-sm max-w-md">
          Carefully selected architectural residences, corporate towers, and prime lands across Pakistan’s top development authorities.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {LUXURY_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative h-96 rounded-3xl overflow-hidden bg-card border border-white/[0.08] hover:border-gold/50 shadow-luxury-card flex flex-col justify-end p-6 transition duration-500"
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C] via-[#0A0E0C]/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold mb-1 block">
                Exclusive Collection
              </span>
              <h3 className="font-serif text-xl text-sand-50 font-normal leading-snug group-hover:text-gold transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-sand-200/80 mt-1.5 leading-relaxed font-light">
                {cat.subtitle}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-sand-100 group-hover:text-gold transition">
                <span>Explore Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Locations() {
  const { t } = useLang();
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block mb-2">
            Prime Geographic Nodes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
            {t("popular")}
          </h2>
        </div>
        <p className="text-sand-200/70 text-sm max-w-md">
          Explore prime real estate opportunities in high-growth neighborhoods with verified infrastructure and capital appreciation.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_LOCATIONS.map((loc, idx) => (
          <Link
            key={idx}
            href={`/properties?city=${loc.city}`}
            className="group relative h-64 rounded-3xl overflow-hidden bg-card border border-white/[0.08] hover:border-gold/50 shadow-luxury-card flex flex-col justify-between p-6 transition duration-500"
          >
            <Image
              src={loc.image}
              alt={loc.area}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080B0A] via-[#080B0A]/40 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#0A0E0C]/85 backdrop-blur-md text-sand-100 border border-white/10">
                {loc.city}
              </span>
              <span className="text-xs text-gold font-medium bg-[#0A0E0C]/80 px-2.5 py-1 rounded-full backdrop-blur-md">
                {loc.count}+ Listings
              </span>
            </div>

            <div className="relative z-10">
              <p className="text-[11px] uppercase tracking-wider text-sand-200/80 font-medium">
                {loc.tag}
              </p>
              <h3 className="font-serif text-2xl text-sand-50 font-normal group-hover:text-gold transition-colors mt-0.5">
                {loc.area}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Why() {
  const { t } = useLang();
  const features = [
    {
      icon: ShieldCheck,
      titleKey: "why1",
      descKey: "why1d",
      badge: "Deed & Title Verification",
    },
    {
      icon: Sparkles,
      titleKey: "why2",
      descKey: "why2d",
      badge: "Generative AI Concierge",
    },
    {
      icon: Calculator,
      titleKey: "why3",
      descKey: "why3d",
      badge: "Precision Calculations",
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-2">
          The PropertyHub Advantage
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
          {t("why")}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="relative rounded-3xl bg-[#0D1311] border border-white/[0.08] hover:border-gold/40 p-8 shadow-luxury-card transition duration-500 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 to-emerald/20 border border-gold/30 flex items-center justify-center text-gold mb-6 shadow-sm">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-glow block mb-2">
                  {item.badge}
                </span>
                <h3 className="font-serif text-xl text-sand-50 font-normal mb-3">
                  {t(item.titleKey)}
                </h3>
                <p className="text-sand-200/80 text-sm leading-relaxed font-light">
                  {t(item.descKey)}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-1.5 text-xs text-gold font-medium">
                <Award className="w-3.5 h-3.5" />
                <span>Premier Standard Verified</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Cta() {
  const { t } = useLang();
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#12231E] via-[#0D1814] to-[#0A100E] border border-gold/30 p-10 sm:p-16 text-center shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald/20 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-3">
            Private Portfolio Management
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-sand-50 font-normal leading-tight mb-6">
            {t("cta")}
          </h2>
          <p className="text-sand-200/80 text-sm sm:text-base mb-8 font-light max-w-lg mx-auto">
            List your luxury residence with Pakistan’s premier architectural marketplace. Gain verified buyers, VIP privacy, and AI-driven match targeting.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold hover:bg-gold-light text-[#0A0D0C] font-semibold text-sm tracking-wide transition shadow-lg shadow-gold/20 hover:shadow-glow-gold"
            >
              <span>{t("ctaBtn")}</span>
              <ArrowRight className="w-4 h-4 text-[#0A0D0C]" />
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-card/80 hover:bg-card border border-line hover:border-gold/50 text-sand-100 font-medium text-sm tracking-wide transition"
            >
              <span>Browse Marketplace</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
