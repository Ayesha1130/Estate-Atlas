"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { supabase, Property } from "@/lib/supabase";
import { useLang } from "@/lib/i18n";
import { useUser } from "@/lib/useUser";
import { Heart, Compass, User } from "lucide-react";

export default function Favorites() {
  const { user, loading } = useUser();
  const { t } = useLang();
  const [items, setItems] = useState<Property[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("favorites")
      .select("properties(*)")
      .eq("user_id", user.id)
      .then(({ data }) =>
        setItems(
          ((data as unknown as { properties: Property | null }[]) ?? [])
            .map((r) => r.properties)
            .filter((p): p is Property => Boolean(p))
        )
      );
  }, [user]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 text-center text-mute">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading your saved wishlist...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-[#0D1412] border border-white/[0.08] text-center shadow-luxury-card">
        <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto mb-4">
          <User className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-sand-50 mb-2">Member Wishlist</h2>
        <p className="text-sm text-mute leading-relaxed mb-6">
          Sign in to your account to view and synchronize your saved luxury properties across devices.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 rounded-full bg-sand-100 text-[#080B0A] text-xs font-semibold uppercase tracking-wider"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shadow-sm">
          <Heart className="w-5 h-5 fill-gold text-gold" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block">
            Curated Wishlist
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
            {t("yourFav")}
          </h1>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-12 text-center max-w-xl mx-auto my-8 shadow-luxury-card">
          <Heart className="w-8 h-8 text-mute mx-auto mb-3" />
          <h3 className="font-serif text-2xl text-sand-50 mb-2 font-normal">
            {t("nothingSaved")}
          </h3>
          <p className="text-sand-200/70 text-sm leading-relaxed mb-6 font-light">
            Tap the heart icon on any villa, penthouse, or commercial listing to save it to your private portfolio.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gold text-[#080B0A] text-xs font-semibold uppercase tracking-wider transition shadow-md"
          >
            <Compass className="w-4 h-4 text-[#080B0A]" />
            <span>Explore Premier Estates</span>
          </Link>
        </div>
      )}
    </main>
  );
}
