"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/i18n";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";

export default function Forgot() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setBusy(false);
      if (error) {
        setMsg(error.message);
        setSuccess(false);
      } else {
        setMsg(t("linkSent"));
        setSuccess(true);
      }
    } catch {
      setBusy(false);
      setMsg("Failed to request reset link. Please retry.");
      setSuccess(false);
    }
  }

  const inp =
    "w-full bg-[#0A0E0C] border border-line rounded-xl pl-10 pr-4 py-3 text-sm text-sand-100 placeholder:text-mute outline-none focus:border-gold transition";

  return (
    <main className="max-w-md mx-auto my-20 px-4">
      <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-8 sm:p-10 shadow-luxury-card">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <h1 className="font-serif text-2xl sm:text-3xl text-sand-50 font-normal mb-2">
          {t("forgot")}
        </h1>
        <p className="text-xs text-mute leading-relaxed mb-6">
          Enter your registered email address. We will transmit a secure, one-time recovery link to reset your account password.
        </p>

        <form onSubmit={send} className="space-y-4">
          <div className="relative">
            <Mail className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              className={inp}
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-light text-[#080B0A] font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{busy ? "Transmitting link..." : t("sendLink")}</span>
            <ArrowRight className="w-4 h-4 text-[#080B0A]" />
          </button>

          {msg && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                success
                  ? "bg-emerald/30 border border-emerald-light/40 text-emerald-glow"
                  : "bg-red-950/40 border border-red-800/40 text-red-300"
              }`}
            >
              {success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{msg}</span>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
