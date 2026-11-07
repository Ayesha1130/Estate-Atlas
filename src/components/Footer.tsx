"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { CITIES } from "@/lib/constants";
import { ShieldCheck, Sparkles, Building2, MapPin, Heart } from "lucide-react";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-line/60 bg-[#060807] text-sand-200/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-emerald-light p-[1px]">
                <div className="w-full h-full bg-[#0E1412] rounded-[11px] flex items-center justify-center">
                  <span className="font-serif text-gold font-bold text-base leading-none">P</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.25em] text-base font-semibold text-sand-50 leading-none">
                  PROPERTY<span className="text-gold">HUB</span>
                </span>
                <span className="text-[8px] uppercase tracking-[0.3em] text-gold/80 mt-1 font-sans">
                  PREMIER REAL ESTATE
                </span>
              </div>
            </Link>
            <p className="text-xs text-mute leading-relaxed max-w-sm">
              {t("footerTag")} Discover Pakistan’s most prestigious architectural estates, verified plots, and high-yield commercial investments.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-glow">
              <ShieldCheck className="w-4 h-4" />
              <span>Bank-grade verified listings & RLS security</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-sand-50 mb-4 font-sans">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/properties?listing=buy" className="hover:text-gold transition">
                  {t("buy")} Villas & Houses
                </Link>
              </li>
              <li>
                <Link href="/properties?listing=rent" className="hover:text-gold transition">
                  {t("rent")} Penthouses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=commercial" className="hover:text-gold transition">
                  {t("commercial")}
                </Link>
              </li>
              <li>
                <Link href="/properties?type=plot" className="hover:text-gold transition">
                  Prime Residential Plots
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-gold transition text-gold font-medium">
                  {t("sell")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Engineering Tools */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-sand-50 mb-4 font-sans">
              Property Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/tools" className="hover:text-gold transition">
                  Universal Marla Converter
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-gold transition">
                  Home Finance & EMI Simulator
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-gold transition">
                  Construction Cost Estimator
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-gold transition">
                  Regional Marla Standards (LDA/CDA)
                </Link>
              </li>
            </ul>
          </div>

          {/* Prime Cities */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-sand-50 mb-4 font-sans">
              Prime Destinations
            </h4>
            <ul className="space-y-2.5 text-xs">
              {CITIES.map((c) => (
                <li key={c}>
                  <Link href={`/properties?city=${c}`} className="hover:text-gold transition">
                    {c}, Pakistan
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-mute gap-4">
          <p>© {year} PropertyHub Premier. All rights reserved across Pakistan.</p>
          <div className="flex items-center gap-6 text-xs">
            <span>PKR Currency Standard</span>
            <span>•</span>
            <span>Verified Society Deeds</span>
            <span>•</span>
            <span>OpenAI Neural Assistant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
