"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import { useLang } from "@/lib/i18n";
import { User, Phone, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Profile() {
  const { user, loading } = useUser();
  const { t } = useLang();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name,phone")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setName(data?.full_name ?? "");
        setPhone(data?.phone ?? "");
      });
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMsg("");
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name.trim(), phone: phone.trim() })
      .eq("id", user.id);
    setSaving(false);
    setMsg(error ? error.message : t("profileSaved"));
  }

  if (loading) {
    return (
      <main className="max-w-md mx-auto px-6 py-20 text-center text-mute">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-[#0D1412] border border-white/[0.08] text-center shadow-luxury-card">
        <p className="text-mute mb-4">Please log in to manage your profile.</p>
        <Link href="/login" className="px-6 py-2.5 rounded-full bg-sand-100 text-[#080B0A] text-xs font-semibold uppercase">
          Sign In
        </Link>
      </main>
    );
  }

  const inp =
    "w-full bg-[#0A0E0C] border border-line rounded-xl px-4 py-3 text-sm text-sand-100 placeholder:text-mute outline-none focus:border-gold transition";

  return (
    <main className="max-w-md mx-auto my-16 px-4">
      <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-8 shadow-luxury-card">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto mb-3">
            <User className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl text-sand-50 font-normal">
            {t("profile")}
          </h1>
          <p className="text-xs text-mute mt-1 font-mono">{user.email}</p>
        </div>

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gold" />
              <span>{t("fullName")}</span>
            </label>
            <input
              className={inp}
              placeholder="e.g. Tariq Mehmood"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>{t("phone")} / WhatsApp</span>
            </label>
            <input
              className={inp}
              placeholder="e.g. +92 300 1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={30}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-2 py-3 rounded-xl bg-gold hover:bg-gold-light text-[#080B0A] font-semibold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
          >
            {saving ? t("saving") : t("saveBtn")}
          </button>

          {msg && (
            <div className="p-3 rounded-xl bg-emerald/30 border border-emerald-light/40 text-emerald-glow text-xs flex items-center gap-2 mt-4">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{msg}</span>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
