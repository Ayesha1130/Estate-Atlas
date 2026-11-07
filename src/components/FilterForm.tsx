"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { CITIES, TYPES } from "@/lib/constants";
import { Search, SlidersHorizontal, RotateCcw, Building2, MapPin, DollarSign, Bed, Bath, Layers } from "lucide-react";

export default function FilterForm({ sp }: { sp: Record<string, string | undefined> }) {
  const { t } = useLang();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  // Form states
  const [listing, setListing] = useState(sp.listing ?? "");
  const [city, setCity] = useState(sp.city ?? "");
  const [type, setType] = useState(sp.type ?? "");
  const [minPrice, setMinPrice] = useState(sp.min ?? "");
  const [maxPrice, setMaxPrice] = useState(sp.max ?? "");
  const [beds, setBeds] = useState(sp.beds ?? "");
  const [baths, setBaths] = useState(sp.baths ?? "");
  const [size, setSize] = useState(sp.size ?? "");
  const [sort, setSort] = useState(sp.sort ?? "");

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (listing) params.set("listing", listing);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (minPrice) params.set("min", minPrice);
    if (maxPrice) params.set("max", maxPrice);
    if (beds) params.set("beds", beds);
    if (baths) params.set("baths", baths);
    if (size) params.set("size", size);
    if (sort) params.set("sort", sort);
    router.push(`/properties?${params.toString()}`);
  };

  const handleReset = () => {
    setListing("");
    setCity("");
    setType("");
    setMinPrice("");
    setMaxPrice("");
    setBeds("");
    setBaths("");
    setSize("");
    setSort("");
    router.push("/properties");
  };

  const activeFiltersCount = [listing, city, type, minPrice, maxPrice, beds, baths, size, sort].filter(Boolean).length;

  const selectStyle =
    "w-full bg-[#0A0E0C] border border-line rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-sand-100 outline-none focus:border-gold transition cursor-pointer";
  const inputStyle =
    "w-full bg-[#0A0E0C] border border-line rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-sand-100 placeholder:text-mute outline-none focus:border-gold transition";

  return (
    <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] shadow-luxury-card p-5 sm:p-6 mb-10">
      {/* Top Quick Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        {/* Listing Type Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "", label: t("all") },
            { id: "buy", label: t("buy") },
            { id: "rent", label: t("rent") },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setListing(item.id);
                const params = new URLSearchParams(window.location.search);
                if (item.id) params.set("listing", item.id);
                else params.delete("listing");
                params.delete("page");
                router.push(`/properties?${params.toString()}`);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition ${
                listing === item.id
                  ? "bg-gold text-[#080B0A] shadow-glow-gold"
                  : "bg-[#090D0B] text-sand-200 border border-line hover:border-gold/40"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Toggle for Detailed Filters */}
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-mute hover:text-red-400 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t("clearFilters")}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#090D0B] border border-line hover:border-gold/50 text-xs font-medium text-sand-100 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gold" />
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-gold text-[#080B0A] font-bold text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Filter Grid */}
      <form onSubmit={handleApply} className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-mute mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gold" />
            <span>{t("allCities")}</span>
          </label>
          <select value={city} onChange={(e) => setCity(e.target.value)} className={selectStyle}>
            <option value="">All Metros in Pakistan</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-mute mb-1.5 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-gold" />
            <span>{t("allTypes")}</span>
          </label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectStyle}>
            <option value="">All Categories</option>
            {TYPES.map((tItem) => (
              <option key={tItem} value={tItem} className="capitalize">
                {tItem}
              </option>
            ))}
          </select>
        </div>

        {/* Price Presets / Min Price */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-mute mb-1.5 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-gold" />
            <span>{t("minP")} (PKR)</span>
          </label>
          <input
            type="number"
            min={0}
            step={500000}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="e.g. 10000000 (1 Crore)"
            className={inputStyle}
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-mute mb-1.5 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-gold" />
            <span>{t("maxP")} (PKR)</span>
          </label>
          <input
            type="number"
            min={0}
            step={500000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="e.g. 50000000 (5 Crore)"
            className={inputStyle}
          />
        </div>

        {/* Expanded Filters Drawer */}
        {expanded && (
          <>
            {/* Bedrooms */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-mute mb-1.5 flex items-center gap-1">
                <Bed className="w-3 h-3 text-gold" />
                <span>{t("bedrooms")}</span>
              </label>
              <select value={beds} onChange={(e) => setBeds(e.target.value)} className={selectStyle}>
                <option value="">{t("anyBeds")}</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}+ {t("beds")}
                  </option>
                ))}
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-mute mb-1.5 flex items-center gap-1">
                <Bath className="w-3 h-3 text-gold" />
                <span>{t("baths")}</span>
              </label>
              <select value={baths} onChange={(e) => setBaths(e.target.value)} className={selectStyle}>
                <option value="">{t("anyBaths")}</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}+ {t("baths")}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Size (sqft) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-mute mb-1.5 flex items-center gap-1">
                <Layers className="w-3 h-3 text-gold" />
                <span>{t("minSize")}</span>
              </label>
              <input
                type="number"
                min={0}
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 2250 (10 Marla)"
                className={inputStyle}
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-mute mb-1.5">
                {t("sortL")}
              </label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectStyle}>
                <option value="">{t("sortNew")}</option>
                <option value="low">{t("sortLow")}</option>
                <option value="high">{t("sortHigh")}</option>
              </select>
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gold hover:bg-gold-light text-[#080B0A] font-semibold text-xs uppercase tracking-wider transition shadow-md"
          >
            <Search className="w-4 h-4 text-[#080B0A]" />
            <span>{t("filter")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
