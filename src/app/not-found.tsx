import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="max-w-lg mx-auto my-32 px-4 text-center">
      <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-10 sm:p-12 shadow-luxury-card">
        <span className="font-serif text-6xl sm:text-7xl font-bold text-gold block mb-2">
          404
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-sand-50 font-normal mb-3">
          Architectural Landmark Not Found
        </h1>
        <p className="text-xs sm:text-sm text-mute leading-relaxed mb-8 max-w-sm mx-auto">
          The property listing or destination page you are seeking has been archived or does not exist.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-sand-100 text-[#080B0A] font-semibold text-xs uppercase tracking-wider transition"
          >
            Return Home
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card hover:bg-cardMuted border border-line hover:border-gold/50 text-sand-100 text-xs font-semibold tracking-wider uppercase transition"
          >
            <Compass className="w-4 h-4 text-gold" />
            <span>Browse Marketplace</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
