"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/useUser";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import {
  Compass,
  Heart,
  Plus,
  User,
  Sliders,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Building2,
} from "lucide-react";

export default function Nav() {
  const { user } = useUser();
  const { t, toggle, isUrdu } = useLang();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setIsAdmin(data?.role === "admin"));
  }, [user]);

  const navLinkClass =
    "text-sand-200/80 hover:text-gold transition-colors text-sm font-medium tracking-wide flex items-center gap-1.5 py-1 px-2";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080B0A]/90 backdrop-blur-xl border-b border-line shadow-2xl py-3.5"
          : "bg-[#080B0A]/60 backdrop-blur-md border-b border-white/[0.04] py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold via-gold/80 to-emerald-light p-[1px] shadow-glow-gold">
            <div className="w-full h-full bg-[#0E1412] rounded-[11px] flex items-center justify-center">
              <span className="font-serif text-gold font-bold text-lg leading-none">P</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-[0.25em] text-lg font-semibold text-sand-50 leading-none">
              PROPERTY<span className="text-gold">HUB</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-gold/80 mt-1 font-sans font-medium">
              PREMIER · LUXURY ESTATES
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
          <Link href="/properties?listing=buy" className={navLinkClass}>
            {t("buy")}
          </Link>
          <Link href="/properties?listing=rent" className={navLinkClass}>
            {t("rent")}
          </Link>
          <Link href="/properties?type=commercial" className={navLinkClass}>
            <Building2 className="w-4 h-4 text-gold/80" />
            {t("commercial")}
          </Link>
          <Link href="/properties" className={navLinkClass}>
            <Compass className="w-4 h-4 text-sand-200/60" />
            {t("all")}
          </Link>
          <Link href="/tools" className={navLinkClass}>
            <Sliders className="w-4 h-4 text-sand-200/60" />
            {t("tools")}
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Sell / List CTA */}
          <Link
            href="/sell"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border border-gold/40 text-sand-100 bg-gold/10 hover:bg-gold/20 hover:border-gold transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-gold" />
            {t("sell")}
          </Link>

          {/* User authenticated actions */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-line">
              <Link
                href="/favorites"
                title={t("favorites")}
                className="p-2 rounded-full text-sand-200 hover:text-gold hover:bg-card transition"
              >
                <Heart className="w-4 h-4" />
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  title={t("admin")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald/60 text-emerald-glow border border-emerald-light/40 text-xs font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card hover:bg-cardMuted border border-line text-xs font-medium text-sand-100 transition"
              >
                <User className="w-3.5 h-3.5 text-gold" />
                <span>{t("dashboard")}</span>
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                title={t("logout")}
                className="p-2 rounded-full text-mute hover:text-red-400 hover:bg-card transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase bg-sand-100 text-bg hover:bg-sand-200 transition shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              {t("login")}
            </Link>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggle}
            className="px-3 py-1.5 rounded-full border border-line hover:border-gold/50 text-xs text-sand-200 hover:text-gold transition font-medium ml-1"
          >
            {t("lang")}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            className="px-2.5 py-1 rounded-full border border-line text-xs text-sand-200"
          >
            {t("lang")}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-card border border-line text-sand-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#0A0E0C]/95 backdrop-blur-2xl border-b border-line px-6 py-8 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
          <Link
            href="/properties?listing=buy"
            onClick={() => setMobileOpen(false)}
            className="text-lg py-2 border-b border-line/50 text-sand-100 flex items-center justify-between"
          >
            <span>{t("buy")}</span>
            <span className="text-xs text-gold uppercase tracking-wider">Villas & Houses</span>
          </Link>
          <Link
            href="/properties?listing=rent"
            onClick={() => setMobileOpen(false)}
            className="text-lg py-2 border-b border-line/50 text-sand-100 flex items-center justify-between"
          >
            <span>{t("rent")}</span>
            <span className="text-xs text-gold uppercase tracking-wider">Penthouses</span>
          </Link>
          <Link
            href="/properties?type=commercial"
            onClick={() => setMobileOpen(false)}
            className="text-lg py-2 border-b border-line/50 text-sand-100 flex items-center justify-between"
          >
            <span>{t("commercial")}</span>
            <span className="text-xs text-gold uppercase tracking-wider">Plazas & Offices</span>
          </Link>
          <Link
            href="/properties"
            onClick={() => setMobileOpen(false)}
            className="text-lg py-2 border-b border-line/50 text-sand-100"
          >
            {t("all")}
          </Link>
          <Link
            href="/tools"
            onClick={() => setMobileOpen(false)}
            className="text-lg py-2 border-b border-line/50 text-sand-100"
          >
            {t("tools")}
          </Link>
          <Link
            href="/sell"
            onClick={() => setMobileOpen(false)}
            className="text-lg py-2 border-b border-line/50 text-gold font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("sell")}
          </Link>

          <div className="pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-card border border-line text-sand-100 text-sm font-medium"
                >
                  {t("dashboard")}
                </Link>
                <Link
                  href="/favorites"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-card border border-line text-sand-100 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 text-gold" />
                  {t("favorites")}
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-emerald/60 border border-emerald-light/40 text-emerald-glow text-sm font-medium"
                  >
                    {t("admin")}
                  </Link>
                )}
                <button
                  onClick={() => {
                    supabase.auth.signOut();
                    setMobileOpen(false);
                  }}
                  className="w-full text-center py-3 rounded-xl bg-red-950/40 border border-red-900/40 text-red-300 text-sm font-medium"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-sand-100 text-bg text-sm font-semibold tracking-wider uppercase"
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
