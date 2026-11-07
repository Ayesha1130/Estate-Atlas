"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { User, Phone, MessageSquare, Send, CheckCircle2, AlertTriangle } from "lucide-react";

export default function InquiryForm({ id }: { id: string }) {
  const { t } = useLang();
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.phone.trim()) {
      return setErr("Please provide your name and contact phone number.");
    }
    setBusy(true);
    setErr("");
    try {
      const { error } = await supabase.from("inquiries").insert({
        property_id: id,
        name: f.name.trim(),
        phone: f.phone.trim(),
        message: f.message.trim(),
      });
      setBusy(false);
      if (error) {
        setErr(error.message);
      } else {
        setDone(true);
      }
    } catch {
      setBusy(false);
      setErr("Failed to submit inquiry. Please try again.");
    }
  }

  const inp =
    "w-full bg-[#0A0E0C] border border-line rounded-xl px-4 py-3 text-xs sm:text-sm text-sand-100 placeholder:text-mute outline-none focus:border-gold transition";

  if (done) {
    return (
      <div className="p-6 rounded-2xl bg-emerald/20 border border-emerald-light/40 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-glow mx-auto" />
        <h4 className="font-serif text-lg text-sand-50 font-normal">Private Tour Requested</h4>
        <p className="text-xs text-sand-200/90 leading-relaxed max-w-sm mx-auto">
          {t("thanks")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="space-y-3">
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-mute mb-1">
          {t("yourName")} *
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            className={`${inp} pl-10`}
            placeholder="e.g. Tariq Mehmood"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-mute mb-1">
          {t("phone")} / WhatsApp *
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            className={`${inp} pl-10`}
            placeholder="e.g. +92 300 1234567"
            value={f.phone}
            onChange={(e) => setF({ ...f, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-mute mb-1">
          {t("msgOpt")}
        </label>
        <textarea
          rows={2}
          className={inp}
          placeholder="Preferred appointment date or specific inquiries regarding the title deed..."
          value={f.message}
          onChange={(e) => setF({ ...f, message: e.target.value })}
        />
      </div>

      {err && (
        <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-light text-[#080B0A] font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
      >
        <Send className="w-3.5 h-3.5 text-[#080B0A]" />
        <span>{busy ? "Submitting..." : t("contact")}</span>
      </button>
    </form>
  );
}
