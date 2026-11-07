"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ title }: { title: string }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setDone(true);
        setTimeout(() => setDone(false), 2200);
      }
    } catch {
      // User cancelled
    }
  }

  return (
    <button
      onClick={share}
      aria-label="Share property link"
      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card hover:bg-cardMuted border border-line hover:border-gold/50 text-xs font-semibold text-sand-100 transition shadow-sm"
    >
      {done ? <Check className="w-3.5 h-3.5 text-emerald-glow" /> : <Share2 className="w-3.5 h-3.5 text-gold" />}
      <span>{done ? t("copied") : t("share")}</span>
    </button>
  );
}
