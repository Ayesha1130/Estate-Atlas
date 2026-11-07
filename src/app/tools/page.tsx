"use client";
import { useState } from "react";
import Emi from "@/components/Emi";
import { useLang } from "@/lib/i18n";
import { pkr } from "@/lib/format";
import {
  MARLA_STANDARDS,
  MarlaStandard,
  DEFAULT_MARLA_SQFT,
  UNITS,
  Unit,
  toSqft,
  fromSqft,
  totalPrice,
  pricePerSqft,
  estimateConstructionCost,
} from "@/lib/units";
import {
  Calculator,
  Sliders,
  Building,
  Hammer,
  Layers,
  ArrowRightLeft,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function Tools() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<"converter" | "valuation" | "construction" | "mortgage">("converter");

  // Land converter state
  const [standard, setStandard] = useState<MarlaStandard>("lda");
  const [inputVal, setInputVal] = useState<number>(10);
  const [inputUnit, setInputUnit] = useState<Unit | "acre">("marla");

  const marlaSqft = MARLA_STANDARDS[standard].sqft;
  const currentTotalSqft = toSqft(inputVal, inputUnit, marlaSqft);
  const conversions = fromSqft(currentTotalSqft, marlaSqft);

  // Property Valuation state
  const [valArea, setValArea] = useState(1);
  const [valUnit, setValUnit] = useState<Unit>("kanal");
  const [valRate, setValRate] = useState(45000000); // 4.5 Crore per Kanal
  const valTotal = totalPrice(valArea, valUnit, valRate);
  const valSqftRate = pricePerSqft(valArea, valUnit, valRate, marlaSqft);

  // Construction Cost state
  const [constArea, setConstArea] = useState(10);
  const [constUnit, setConstUnit] = useState<Unit>("marla");
  const [constQuality, setConstQuality] = useState<"economy" | "standard" | "luxury" | "premium">("luxury");
  const [coveredPercent, setCoveredPercent] = useState(75);
  const constEstimate = estimateConstructionCost(constArea, constUnit, constQuality, coveredPercent, marlaSqft);

  const inp = "w-full bg-[#0A0E0C] border border-line rounded-xl px-4 py-3 text-sm text-sand-100 outline-none focus:border-gold transition";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Page Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-gold block mb-2">
          Engineering & Financial Suite
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-sand-50 font-normal leading-tight">
          {t("tools")}
        </h1>
        <p className="text-sand-200/80 text-sm sm:text-base mt-2 font-light">
          {t("toolsSub")}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {[
          { id: "converter", label: "Land & Marla Converter", icon: ArrowRightLeft },
          { id: "valuation", label: "Property Price Estimator", icon: Calculator },
          { id: "construction", label: "Construction Cost Estimator", icon: Hammer },
          { id: "mortgage", label: "Mortgage / EMI Simulator", icon: Building },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold tracking-wide transition ${
                isActive
                  ? "bg-gold text-[#080B0A] shadow-glow-gold"
                  : "bg-card border border-line hover:border-gold/50 text-sand-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LAND & MARLA CONVERTER */}
      {activeTab === "converter" && (
        <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 sm:p-10 shadow-luxury-card space-y-8 animate-in fade-in-50">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-gold block mb-1">
              Measurement Calibration
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-sand-50 font-normal">
              Universal Pakistani Land Measurement Converter
            </h2>
            <p className="text-xs text-mute mt-1">
              Convert seamlessly between Marla, Kanal, Square Feet, Square Yards (Guz), and Acres.
            </p>
          </div>

          {/* Regional Standard Selection */}
          <div className="p-4 rounded-2xl bg-[#090D0B] border border-line">
            <label className="block text-xs font-bold uppercase tracking-wider text-sand-100 mb-2">
              Select Regional Marla Convention:
            </label>
            <div className="grid sm:grid-cols-3 gap-3">
              {(Object.keys(MARLA_STANDARDS) as MarlaStandard[]).map((key) => {
                const s = MARLA_STANDARDS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStandard(key)}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      standard === key
                        ? "border-gold bg-gold/10 text-sand-50"
                        : "border-line bg-card/60 text-mute hover:border-gold/30"
                    }`}
                  >
                    <p className="text-xs font-bold text-sand-50">{s.label}</p>
                    <p className="text-[11px] text-mute mt-1 leading-snug">{s.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Controls */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                Enter Land Value
              </label>
              <input
                type="number"
                min={0}
                value={inputVal}
                onChange={(e) => setInputVal(Math.max(0, +e.target.value))}
                className={inp}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                Input Unit
              </label>
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value as Unit | "acre")}
                className={inp}
              >
                <option value="marla">Marla</option>
                <option value="kanal">Kanal (20 Marla)</option>
                <option value="sqft">Square Feet (sqft)</option>
                <option value="sqyd">Square Yards (Guz)</option>
                <option value="acre">Acre (8 Kanal)</option>
              </select>
            </div>
          </div>

          {/* Live Calculated Output Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/[0.06]">
            <div className="rounded-2xl bg-[#090D0B] border border-line p-4 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-mute block mb-1">
                Marla
              </span>
              <p className="font-serif text-2xl font-bold text-sand-50">{conversions.marla}</p>
            </div>
            <div className="rounded-2xl bg-[#090D0B] border border-line p-4 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-mute block mb-1">
                Kanal
              </span>
              <p className="font-serif text-2xl font-bold text-sand-50">{conversions.kanal}</p>
            </div>
            <div className="rounded-2xl bg-[#090D0B] border border-line p-4 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-mute block mb-1">
                Square Feet
              </span>
              <p className="font-serif text-2xl font-bold text-sand-50">{conversions.sqft.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-[#090D0B] border border-line p-4 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-mute block mb-1">
                Sq. Yards (Guz)
              </span>
              <p className="font-serif text-2xl font-bold text-sand-50">{conversions.sqyd.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-[#090D0B] border border-line p-4 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-mute block mb-1">
                Acre
              </span>
              <p className="font-serif text-2xl font-bold text-sand-50">{conversions.acre}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROPERTY VALUATION */}
      {activeTab === "valuation" && (
        <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 sm:p-10 shadow-luxury-card space-y-8 animate-in fade-in-50">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-gold block mb-1">
              Valuation Modeler
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-sand-50 font-normal">
              Property Price & Per-Sqft Calculator
            </h2>
            <p className="text-xs text-mute mt-1">
              Calculate total market demand and derive true per-square-foot cost based on prevailing society rates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                {t("areaL")}
              </label>
              <input
                type="number"
                min={0}
                value={valArea}
                onChange={(e) => setValArea(Math.max(0, +e.target.value))}
                className={inp}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                {t("unitL")}
              </label>
              <select
                value={valUnit}
                onChange={(e) => setValUnit(e.target.value as Unit)}
                className={inp}
              >
                <option value="marla">Marla</option>
                <option value="kanal">Kanal</option>
                <option value="sqft">Sq. Feet</option>
                <option value="sqyd">Sq. Yards (Guz)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                {t("rateL")}
              </label>
              <input
                type="number"
                min={0}
                step={500000}
                value={valRate}
                onChange={(e) => setValRate(Math.max(0, +e.target.value))}
                className={inp}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-white/[0.06]">
            <div className="rounded-2xl bg-[#090D0B] border border-line p-5">
              <span className="text-xs text-mute uppercase font-bold tracking-wider block mb-1">
                {t("totalL")}
              </span>
              <p className="font-serif text-3xl font-bold text-sand-50">{pkr(Math.round(valTotal))}</p>
            </div>
            <div className="rounded-2xl bg-[#090D0B] border border-line p-5">
              <span className="text-xs text-mute uppercase font-bold tracking-wider block mb-1">
                Total Plot Area (sqft)
              </span>
              <p className="font-serif text-3xl font-bold text-sand-50">
                {toSqft(valArea, valUnit, marlaSqft).toLocaleString("en-US")}
              </p>
            </div>
            <div className="rounded-2xl bg-[#090D0B] border border-line p-5">
              <span className="text-xs text-mute uppercase font-bold tracking-wider block mb-1">
                {t("perSqft")}
              </span>
              <p className="font-serif text-3xl font-bold text-gold">
                {pkr(Math.round(valSqftRate))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONSTRUCTION COST ESTIMATOR */}
      {activeTab === "construction" && (
        <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 sm:p-10 shadow-luxury-card space-y-8 animate-in fade-in-50">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-gold block mb-1">
              Turnkey Construction Estimation
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-sand-50 font-normal">
              2026 Pakistani Construction Cost Estimator
            </h2>
            <p className="text-xs text-mute mt-1">
              Estimate grey structure vs. A+ turnkey luxury architectural finishing costs across major Pakistani metros.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                Plot Size
              </label>
              <input
                type="number"
                min={1}
                value={constArea}
                onChange={(e) => setConstArea(Math.max(1, +e.target.value))}
                className={inp}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                Plot Unit
              </label>
              <select
                value={constUnit}
                onChange={(e) => setConstUnit(e.target.value as Unit)}
                className={inp}
              >
                <option value="marla">Marla</option>
                <option value="kanal">Kanal</option>
                <option value="sqft">Sq. Feet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                Specification Standard
              </label>
              <select
                value={constQuality}
                onChange={(e) => setConstQuality(e.target.value as typeof constQuality)}
                className={inp}
              >
                <option value="economy">Economy Standard (PKR 3,500/sqft)</option>
                <option value="standard">Standard Residential (PKR 4,800/sqft)</option>
                <option value="luxury">A+ Luxury Finishes (PKR 7,200/sqft)</option>
                <option value="premium">Ultra-Luxury Architectural (PKR 9,800/sqft)</option>
              </select>
            </div>
          </div>

          {/* Construction Breakdown */}
          <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-white/[0.06]">
            <div className="rounded-2xl bg-[#090D0B] border border-line p-5">
              <span className="text-xs text-mute uppercase font-bold tracking-wider block mb-1">
                Covered Area ({coveredPercent}%)
              </span>
              <p className="font-serif text-3xl font-bold text-sand-50">
                {constEstimate.coveredAreaSqft.toLocaleString()} sqft
              </p>
              <p className="text-xs text-mute mt-1">Basement, Ground & 1st Floor</p>
            </div>

            <div className="rounded-2xl bg-[#090D0B] border border-line p-5">
              <span className="text-xs text-mute uppercase font-bold tracking-wider block mb-1">
                Grey Structure (~55%)
              </span>
              <p className="font-serif text-3xl font-bold text-sand-50">
                {pkr(constEstimate.breakdown.structure)}
              </p>
              <p className="text-xs text-mute mt-1">Bricks, cement, steel, plumbing</p>
            </div>

            <div className="rounded-2xl bg-[#090D0B] border border-line p-5">
              <span className="text-xs text-mute uppercase font-bold tracking-wider block mb-1">
                Turnkey Finishing (~45%)
              </span>
              <p className="font-serif text-3xl font-bold text-sand-50">
                {pkr(constEstimate.breakdown.finishing)}
              </p>
              <p className="text-xs text-mute mt-1">Marble, woodwork, glass, electrical</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-gold block">
                Total Estimated Construction Outlay
              </span>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-sand-50 mt-1">
                {pkr(constEstimate.totalCost)}
              </p>
            </div>
            <span className="text-xs text-sand-200 font-mono">
              @ PKR {constEstimate.ratePerSqft.toLocaleString()}/sqft
            </span>
          </div>
        </div>
      )}

      {/* TAB 4: MORTGAGE & EMI SIMULATOR */}
      {activeTab === "mortgage" && (
        <div className="animate-in fade-in-50">
          <Emi price={valTotal > 0 ? valTotal : 35000000} />
        </div>
      )}
    </main>
  );
}
