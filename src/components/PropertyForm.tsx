"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { pkr, formatArea } from "@/lib/format";
import { useLang } from "@/lib/i18n";
import { CITIES, TYPES } from "@/lib/constants";
import {
  Building2,
  MapPin,
  DollarSign,
  Bed,
  Maximize,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Info,
} from "lucide-react";

export type FormState = {
  title: string;
  description: string;
  listing: string;
  type: string;
  city: string;
  area: string;
  price: string;
  bedrooms: string;
  size_sqft: string;
};

export const emptyForm: FormState = {
  title: "",
  description: "",
  listing: "buy",
  type: "house",
  city: "Lahore",
  area: "",
  price: "",
  bedrooms: "4",
  size_sqft: "2250",
};

type Props = {
  initial?: FormState;
  endpoint: string;
  method: "POST" | "PATCH";
};

export default function PropertyForm({ initial = emptyForm, endpoint, method }: Props) {
  const { t } = useLang();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const setField =
    (k: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setBusy(false);
        return setMsg("Please log in before publishing a listing.");
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      setBusy(false);

      if (json.error) {
        return setMsg(json.error);
      }

      if (method === "POST" && json.id) {
        router.push(`/dashboard/photos/${json.id}`);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setBusy(false);
      setMsg("Connection failed. Please check network and retry.");
    }
  }

  const numericPrice = Number(form.price);
  const numericSqft = Number(form.size_sqft);

  const inp =
    "w-full bg-[#0A0E0C] border border-line rounded-xl px-4 py-3 text-sm text-sand-100 placeholder:text-mute outline-none focus:border-gold transition";
  const label = "block text-xs font-bold uppercase tracking-wider text-mute mb-1.5";

  return (
    <main className="max-w-3xl mx-auto my-12 px-4">
      <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-8 sm:p-10 shadow-luxury-card">
        {/* Form Header */}
        <div className="mb-8">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block mb-1">
            Property Registration
          </span>
          <h1 className="font-serif text-3xl text-sand-50 font-normal">
            {t("listTitle")}
          </h1>
          {method === "PATCH" && (
            <div className="mt-2 p-3 rounded-xl bg-yellow-950/40 border border-yellow-700/40 text-yellow-300 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{t("editNote")}</span>
            </div>
          )}
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Title */}
          <div>
            <label className={label}>{t("titleF")} *</label>
            <input
              className={inp}
              placeholder="e.g. 1 Kanal Designer Modern Villa in DHA Phase 6"
              value={form.title}
              onChange={setField("title")}
              maxLength={120}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={label}>{t("desc")}</label>
            <textarea
              className={inp}
              rows={4}
              placeholder="Highlight architectural materials, brand fixtures, floor plan, view, and society security..."
              value={form.description}
              onChange={setField("description")}
              maxLength={1500}
            />
          </div>

          {/* Listing, Type & City Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={label}>Purpose</label>
              <select className={inp} value={form.listing} onChange={setField("listing")}>
                <option value="buy">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className={label}>Category</label>
              <select className={inp} value={form.type} onChange={setField("type")}>
                {TYPES.map((x) => (
                  <option key={x} value={x} className="capitalize">
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={label}>City</label>
              <select className={inp} value={form.city} onChange={setField("city")}>
                {CITIES.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Area & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>{t("area")} (Society / Sector)</label>
              <input
                className={inp}
                placeholder="e.g. DHA Phase 5, Block C"
                value={form.area}
                onChange={setField("area")}
                maxLength={80}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={label}>{t("price")} (PKR) *</label>
                {numericPrice > 0 && (
                  <span className="text-xs font-serif text-gold font-bold">
                    {pkr(numericPrice)}
                  </span>
                )}
              </div>
              <input
                className={inp}
                type="number"
                min={1}
                placeholder="e.g. 35000000"
                value={form.price}
                onChange={setField("price")}
                required
              />
            </div>
          </div>

          {/* Bedrooms & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>{t("bedrooms")}</label>
              <input
                className={inp}
                type="number"
                min={0}
                max={20}
                placeholder="e.g. 5"
                value={form.bedrooms}
                onChange={setField("bedrooms")}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={label}>{t("size")} (sqft) *</label>
                {numericSqft > 0 && (
                  <span className="text-xs text-gold font-medium">
                    {formatArea(numericSqft)}
                  </span>
                )}
              </div>
              <input
                className={inp}
                type="number"
                min={1}
                placeholder="e.g. 2250 (10 Marla) or 4500 (1 Kanal)"
                value={form.size_sqft}
                onChange={setField("size_sqft")}
                required
              />
            </div>
          </div>

          {/* Quick Area Preset Buttons */}
          <div className="p-3.5 rounded-2xl bg-[#090D0B] border border-line flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-mute uppercase font-bold tracking-wider mr-2">
              Quick Size:
            </span>
            {[
              { label: "5 Marla", sqft: "1125" },
              { label: "10 Marla", sqft: "2250" },
              { label: "1 Kanal", sqft: "4500" },
              { label: "2 Kanal", sqft: "9000" },
            ].map((pItem) => (
              <button
                key={pItem.label}
                type="button"
                onClick={() => setForm({ ...form, size_sqft: pItem.sqft })}
                className="px-3 py-1 rounded-full bg-card hover:bg-cardMuted border border-line text-xs text-sand-200 hover:text-gold transition"
              >
                {pItem.label} ({pItem.sqft} sqft)
              </button>
            ))}
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-white/[0.06]">
            <button
              type="submit"
              disabled={busy}
              className="w-full py-4 rounded-xl bg-gold hover:bg-gold-light text-[#080B0A] font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-gold/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{busy ? t("saving") : t("publish")}</span>
              <ArrowRight className="w-4 h-4 text-[#080B0A]" />
            </button>
          </div>

          {/* Feedback Message */}
          {msg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{msg}</span>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
