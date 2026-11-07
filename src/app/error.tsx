"use client";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="max-w-md mx-auto my-32 px-4 text-center">
      <div className="rounded-3xl bg-[#0D1412] border border-red-900/40 p-10 shadow-luxury-card">
        <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-700/50 text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-2xl text-sand-50 font-normal mb-2">
          Temporary Platform Anomaly
        </h1>
        <p className="text-xs sm:text-sm text-mute leading-relaxed mb-6">
          An unexpected server error occurred while retrieving architectural assets.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gold hover:bg-gold-light text-[#080B0A] font-bold text-xs uppercase tracking-wider transition shadow-md"
        >
          <RotateCcw className="w-4 h-4 text-[#080B0A]" />
          <span>Retry Operation</span>
        </button>
      </div>
    </main>
  );
}
