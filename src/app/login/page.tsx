"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    try {
      const { error, data } = signup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      setBusy(false);

      if (error) {
        return setMsg(error.message);
      }

      if (signup && !data.session) {
        return setMsg("Account created! Check your email to confirm, then log in.");
      }

      router.push("/dashboard");
    } catch {
      setBusy(false);
      setMsg("Connection failed. Please retry.");
    }
  }

  const inp =
    "w-full bg-[#0A0E0C] border border-line rounded-xl pl-10 pr-4 py-3 text-sm text-sand-100 placeholder:text-mute outline-none focus:border-gold transition";

  return (
    <main className="max-w-md mx-auto my-20 px-4">
      <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-8 sm:p-10 shadow-luxury-card">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold to-emerald-light p-[1px] mx-auto mb-4">
            <div className="w-full h-full bg-[#0E1412] rounded-[15px] flex items-center justify-center">
              <span className="font-serif text-gold font-bold text-xl leading-none">P</span>
            </div>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-sand-50 font-normal">
            {signup ? t("create") : t("welcome")}
          </h1>
          <p className="text-xs text-mute mt-1 font-light">
            {signup
              ? "Join Pakistan's premier luxury real estate marketplace"
              : "Enter your credentials to access your private portfolio"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
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

          <div className="relative">
            <Lock className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              className={inp}
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-light text-[#080B0A] font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <span>{busy ? "Authenticating..." : signup ? t("signup") : t("login")}</span>
            <ArrowRight className="w-4 h-4 text-[#080B0A]" />
          </button>

          {!signup && (
            <div className="text-center pt-2">
              <Link
                href="/forgot-password"
                className="text-xs text-mute hover:text-gold transition"
              >
                {t("forgot")}
              </Link>
            </div>
          )}

          {msg && (
            <div className="p-3 rounded-xl bg-yellow-950/40 border border-yellow-700/40 text-yellow-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          <div className="pt-4 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={() => {
                setSignup(!signup);
                setMsg("");
              }}
              className="text-xs text-mute hover:text-sand-100 transition"
            >
              {signup ? t("haveAcc") : t("newHere")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
