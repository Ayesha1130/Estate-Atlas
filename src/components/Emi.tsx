"use client";
import { useState, useMemo } from "react";
import { useLang } from "@/lib/i18n";
import { pkr } from "@/lib/supabase";
import { calculateEmi } from "@/lib/units";
import { DollarSign, Percent, Calendar, ShieldCheck, PieChart } from "lucide-react";

export default function Emi({ price }: { price: number }) {
  const { t } = useLang();
  const [propertyPrice, setPropertyPrice] = useState(price > 0 ? price : 25000000);
  const [downPercent, setDownPercent] = useState(25);
  const [rate, setRate] = useState(14.5); // Current prevailing Pakistan home finance benchmark
  const [years, setYears] = useState(15);

  const emiDetails = useMemo(() => {
    return calculateEmi(propertyPrice, downPercent, rate, years);
  }, [propertyPrice, downPercent, rate, years]);

  return (
    <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 sm:p-8 shadow-luxury-card">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Property Price */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-mute">
                Property Value (PKR)
              </label>
              <span className="font-serif text-lg font-bold text-sand-50">
                {pkr(propertyPrice)}
              </span>
            </div>
            <input
              type="range"
              min={2000000}
              max={200000000}
              step={1000000}
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(+e.target.value)}
              className="w-full accent-gold h-1.5 bg-[#090D0B] rounded-lg cursor-pointer"
            />
          </div>

          {/* Down Payment % */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-mute">
                {t("down")} ({downPercent}%)
              </label>
              <span className="text-sm font-semibold text-gold">
                {pkr(emiDetails.downPaymentAmount)}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={downPercent}
              onChange={(e) => setDownPercent(+e.target.value)}
              className="w-full accent-gold h-1.5 bg-[#090D0B] rounded-lg cursor-pointer"
            />
          </div>

          {/* Interest / Profit Rate % */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-mute">
                {t("interest")} ({rate.toFixed(1)}%)
              </label>
              <span className="text-xs text-mute font-mono">1 Year KIBOR + Spread</span>
            </div>
            <input
              type="range"
              min={5}
              max={28}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(+e.target.value)}
              className="w-full accent-gold h-1.5 bg-[#090D0B] rounded-lg cursor-pointer"
            />
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-mute">
                {t("years")} ({years} Years / {years * 12} Months)
              </label>
            </div>
            <input
              type="range"
              min={3}
              max={25}
              step={1}
              value={years}
              onChange={(e) => setYears(+e.target.value)}
              className="w-full accent-gold h-1.5 bg-[#090D0B] rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Financial Summary Column */}
        <div className="lg:col-span-5 rounded-2xl bg-[#090D0B] border border-line p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold block mb-1">
              Monthly Obligation
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-sand-50">
              {pkr(emiDetails.monthlyEmi)}
              <span className="text-xs font-sans text-mute font-normal"> /month</span>
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/[0.06] text-xs">
            <div className="flex justify-between text-sand-200">
              <span className="text-mute">{t("loanAmount")}:</span>
              <span className="font-semibold text-sand-50">{pkr(emiDetails.loanAmount)}</span>
            </div>
            <div className="flex justify-between text-sand-200">
              <span className="text-mute">{t("totalInterest")}:</span>
              <span className="font-semibold text-sand-50">{pkr(emiDetails.totalInterest)}</span>
            </div>
            <div className="flex justify-between text-sand-200 pt-2 border-t border-white/[0.06]">
              <span className="text-sand-50 font-medium">{t("totalPayable")}:</span>
              <span className="font-bold text-gold">{pkr(emiDetails.totalPayment)}</span>
            </div>
          </div>

          <p className="text-[11px] text-mute leading-relaxed pt-2">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
