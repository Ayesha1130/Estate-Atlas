"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { CITIES, TYPES, CURATED_ARCHITECTURAL_SHOWCASE } from "@/lib/constants";
import {
  Compass,
  Search,
  Sparkles,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MapPin,
  Layers,
  Building,
  CheckCircle2,
} from "lucide-react";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

export default function Hero() {
  const { t, isUrdu } = useLang();
  const [canRun3D, setCanRun3D] = useState(false);
  const [use3DMode, setUse3DMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"Exterior" | "Amenities" | "Residences" | "Location">("Exterior");
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>("pool");

  // Search Bar State
  const [searchListing, setSearchListing] = useState<"buy" | "rent" | "commercial">("buy");
  const [searchCity, setSearchCity] = useState("Lahore");
  const [searchType, setSearchType] = useState("");
  const [searchBudget, setSearchBudget] = useState("");

  // Inspect client hardware capabilities for smooth 60fps 3D
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLowPower = (navigator.hardwareConcurrency ?? 8) <= 2;
    let webglSupported = false;
    try {
      const canvas = document.createElement("canvas");
      webglSupported = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webglSupported = false;
    }
    const eligible = !prefersReducedMotion && !isLowPower && webglSupported;
    setCanRun3D(eligible);
    setUse3DMode(eligible);
  }, []);

  const currentShowcase = CURATED_ARCHITECTURAL_SHOWCASE[activeSlide % CURATED_ARCHITECTURAL_SHOWCASE.length];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % CURATED_ARCHITECTURAL_SHOWCASE.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + CURATED_ARCHITECTURAL_SHOWCASE.length) % CURATED_ARCHITECTURAL_SHOWCASE.length);
  };

  const buildSearchHref = () => {
    const params = new URLSearchParams();
    if (searchListing === "commercial") {
      params.set("type", "commercial");
    } else {
      params.set("listing", searchListing);
      if (searchType) params.set("type", searchType);
    }
    if (searchCity) params.set("city", searchCity);

    if (searchBudget === "1") {
      params.set("max", "10000000"); // 1 Crore
    } else if (searchBudget === "2") {
      params.set("min", "10000000");
      params.set("max", "30000000"); // 1 - 3 Crore
    } else if (searchBudget === "3") {
      params.set("min", "30000000");
      params.set("max", "70000000"); // 3 - 7 Crore
    } else if (searchBudget === "4") {
      params.set("min", "70000000"); // 7+ Crore
    }

    return `/properties?${params.toString()}`;
  };

  return (
    <section className="relative w-full pt-4 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-emerald/20 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-[500px] h-[450px] bg-gold/15 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Architectural Showcase Container */}
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#0C1210]/90 border border-white/[0.08] shadow-2xl overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 flex flex-col justify-between z-10">
              <div>
                {/* Brand Tag Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/80 border border-line text-xs font-medium text-sand-200 tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-glow animate-pulse" />
                  <span className="font-sans uppercase text-[11px] text-gold tracking-[0.2em]">
                    Exclusive Architectural Residences
                  </span>
                </div>

                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-sand-50 leading-[1.12]"
                >
                  {t("h1")} <br />
                  <span className="italic font-light text-gold">
                    {t("h2")}
                  </span>
                </motion.h1>

                {/* Subtitle Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="mt-6 text-sand-200/80 text-sm sm:text-base leading-relaxed font-light max-w-lg"
                >
                  {t("sub")}
                </motion.p>

                {/* Primary Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mt-8 flex flex-wrap gap-4 items-center"
                >
                  <Link
                    href="/properties?listing=buy"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-emerald hover:bg-emerald-light text-sand-50 font-medium text-sm tracking-wide transition shadow-lg shadow-emerald-dark/60 hover:shadow-glow group"
                  >
                    <span>{t("exploreNow")}</span>
                    <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/sell"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-card/80 hover:bg-cardMuted border border-line hover:border-gold/50 text-sand-100 font-medium text-sm tracking-wide transition shadow-sm"
                  >
                    <Calendar className="w-4 h-4 text-gold" />
                    <span>{t("bookConsultation")}</span>
                  </Link>
                </motion.div>
              </div>

              {/* Bottom Feature Teaser Cards (from reference image) */}
              <div className="grid grid-cols-2 gap-4 mt-10 pt-6 border-t border-white/[0.06]">
                {/* Teaser 1: Sky Lounge */}
                <div className="group relative rounded-2xl overflow-hidden bg-card/60 border border-line p-3 flex flex-col justify-between hover:border-gold/40 transition">
                  <div className="relative h-24 w-full rounded-xl overflow-hidden mb-2">
                    <Image
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                      alt="Sky Lounge"
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-sand-100 font-medium">
                      Sky Lounge
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-sand-200">
                    <span className="font-medium">Executive Living</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition" />
                  </div>
                </div>

                {/* Teaser 2: Oceanfront / City Vista */}
                <div className="rounded-2xl bg-card/60 border border-line p-3.5 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-gold">
                    <Compass className="w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wide uppercase">
                      Panoramic
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] text-mute leading-snug mt-1">
                      Floor-to-ceiling views across elite golf courses & skyline
                    </p>
                    <p className="font-serif text-2xl font-normal text-sand-50 mt-1">
                      270°
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Architectural Visual & 3D Interactive Canvas */}
            <div className="lg:col-span-7 relative h-[480px] sm:h-[560px] lg:h-[620px] rounded-3xl overflow-hidden border border-white/[0.08] bg-black/40 shadow-inner group">
              
              {/* Top Control Bar: Category Tabs & 3D Toggle */}
              <div className="absolute top-5 inset-x-5 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
                {/* 3D / Photo Mode Switcher */}
                {canRun3D && (
                  <div className="pointer-events-auto flex items-center gap-1 bg-[#0A0F0D]/85 backdrop-blur-xl border border-white/10 p-1 rounded-full shadow-lg">
                    <button
                      onClick={() => setUse3DMode(true)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        use3DMode
                          ? "bg-gold text-[#0B0E0D] font-semibold shadow-sm"
                          : "text-sand-200 hover:text-sand-50"
                      }`}
                    >
                      3D Interactive
                    </button>
                    <button
                      onClick={() => setUse3DMode(false)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        !use3DMode
                          ? "bg-gold text-[#0B0E0D] font-semibold shadow-sm"
                          : "text-sand-200 hover:text-sand-50"
                      }`}
                    >
                      Gallery View
                    </button>
                  </div>
                )}

                {/* Category Pills (Exterior, Amenities, Residences, Location) */}
                <div className="pointer-events-auto flex items-center bg-[#0A0F0D]/85 backdrop-blur-xl border border-white/10 p-1 rounded-full shadow-lg">
                  {(["Exterior", "Amenities", "Residences", "Location"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveCategory(tab);
                        if (use3DMode) setUse3DMode(false); // Switch to corresponding showcase
                      }}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition ${
                        activeCategory === tab
                          ? "bg-emerald text-sand-50 font-semibold shadow-md"
                          : "text-sand-200/80 hover:text-sand-50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport: Either 3D Canvas or Rich Photographic Showcase with Hotspots */}
              {canRun3D && use3DMode ? (
                <div className="w-full h-full">
                  <Hero3D />
                  {/* Subtle 3D Instructions Badge */}
                  <div className="absolute bottom-5 left-5 z-20 pointer-events-none bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[11px] text-sand-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    <span>Drag mouse to orbit · Scroll to zoom · Hover pins</span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full select-none">
                  {/* High-Resolution Luxury Architectural Photography */}
                  <Image
                    src={currentShowcase.image}
                    alt={currentShowcase.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                  {/* Interactive Pulsing Hotspot Pins (from Reference Image) */}
                  {currentShowcase.hotspots.map((hotspot) => {
                    const isOpen = activeHotspot === hotspot.id;
                    return (
                      <div
                        key={hotspot.id}
                        style={{ top: hotspot.top, left: hotspot.left }}
                        className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                      >
                        {/* Hotspot Trigger Ring */}
                        <button
                          onClick={() => setActiveHotspot(isOpen ? null : hotspot.id)}
                          aria-label={hotspot.title}
                          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/80 shadow-2xl transition hover:scale-110 group/btn"
                        >
                          <span className="w-3.5 h-3.5 rounded-full bg-white group-hover/btn:bg-gold transition" />
                          <span className="absolute inset-0 rounded-full border border-white/60 animate-ping opacity-60" />
                        </button>

                        {/* Expanded Tooltip Card */}
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute left-1/2 -translate-x-1/2 bottom-10 z-30 w-64 bg-[#0E1513]/95 backdrop-blur-2xl border border-gold/40 p-3.5 rounded-2xl shadow-2xl text-left"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-xs font-semibold text-sand-50">
                                  {hotspot.title}
                                </p>
                                <p className="text-[11px] text-mute mt-1 leading-snug">
                                  {hotspot.subtitle}
                                </p>
                              </div>
                              <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1" />
                            </div>
                            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gold font-medium">
                              <span>Architectural Specification</span>
                              <Link href="/properties" className="hover:underline">
                                View project →
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}

                  {/* Bottom Location Indicator & Carousel Controls */}
                  <div className="absolute bottom-5 inset-x-5 z-20 flex items-center justify-between pointer-events-none">
                    {/* Location Badge */}
                    <div className="pointer-events-auto flex items-center gap-2 bg-[#0A0F0D]/85 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-lg">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      <span className="text-xs font-medium text-sand-100">
                        {currentShowcase.location}
                      </span>
                    </div>

                    {/* Pagination Slide Counter */}
                    <div className="pointer-events-auto flex items-center gap-3 bg-[#0A0F0D]/85 backdrop-blur-xl border border-white/10 px-3.5 py-1.5 rounded-full shadow-lg">
                      <button
                        onClick={handlePrevSlide}
                        aria-label="Previous property"
                        className="text-sand-200 hover:text-gold transition p-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono tracking-widest text-sand-100">
                        0{activeSlide + 1} / 0{CURATED_ARCHITECTURAL_SHOWCASE.length}
                      </span>
                      <button
                        onClick={handleNextSlide}
                        aria-label="Next property"
                        className="text-sand-200 hover:text-gold transition p-1"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Integrated Luxury Search Bar */}
          <div className="mt-8 pt-8 border-t border-white/[0.08]">
            {/* Search Type Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { id: "buy", label: "Buy Villa / House" },
                { id: "rent", label: "Rent Penthouse" },
                { id: "commercial", label: "Commercial Hubs" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSearchListing(tab.id as "buy" | "rent" | "commercial")}
                  className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide transition ${
                    searchListing === tab.id
                      ? "bg-sand-100 text-[#0B0E0D] font-semibold shadow-md"
                      : "bg-card/70 hover:bg-card border border-line text-sand-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input Controls Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-card/60 backdrop-blur-xl border border-white/[0.08] p-3 rounded-2xl shadow-xl">
              {/* City Selector */}
              <div className="flex flex-col px-3 py-2 bg-[#090D0B] rounded-xl border border-line/60">
                <span className="text-[10px] uppercase font-bold tracking-wider text-mute mb-1">
                  Location
                </span>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="bg-transparent text-sm font-medium text-sand-100 outline-none cursor-pointer"
                  aria-label="Select City"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0E1412] text-sand-100">
                      {c}, Pakistan
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type Selector */}
              <div className="flex flex-col px-3 py-2 bg-[#090D0B] rounded-xl border border-line/60">
                <span className="text-[10px] uppercase font-bold tracking-wider text-mute mb-1">
                  Property Type
                </span>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="bg-transparent text-sm font-medium text-sand-100 outline-none cursor-pointer capitalize"
                  aria-label="Property Type"
                >
                  <option value="" className="bg-[#0E1412] text-sand-100">
                    All Architectural Types
                  </option>
                  {TYPES.map((t) => (
                    <option key={t} value={t} className="bg-[#0E1412] text-sand-100 capitalize">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Range Selector */}
              <div className="flex flex-col px-3 py-2 bg-[#090D0B] rounded-xl border border-line/60">
                <span className="text-[10px] uppercase font-bold tracking-wider text-mute mb-1">
                  Budget (PKR)
                </span>
                <select
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  className="bg-transparent text-sm font-medium text-sand-100 outline-none cursor-pointer"
                  aria-label="Budget Range"
                >
                  <option value="" className="bg-[#0E1412] text-sand-100">
                    Any Budget
                  </option>
                  <option value="1" className="bg-[#0E1412] text-sand-100">
                    Under 1 Crore
                  </option>
                  <option value="2" className="bg-[#0E1412] text-sand-100">
                    1 to 3 Crore
                  </option>
                  <option value="3" className="bg-[#0E1412] text-sand-100">
                    3 to 7 Crore
                  </option>
                  <option value="4" className="bg-[#0E1412] text-sand-100">
                    7+ Crore (Ultra Luxury)
                  </option>
                </select>
              </div>

              {/* Search Submit Button */}
              <Link
                href={buildSearchHref()}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gold hover:bg-gold-light text-[#0A0D0C] font-semibold text-sm tracking-wide transition shadow-lg shadow-gold/20 hover:shadow-glow-gold"
              >
                <Search className="w-4 h-4 text-[#0A0D0C]" />
                <span>Search Properties</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
