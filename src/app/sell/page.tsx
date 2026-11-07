"use client";
import PropertyForm from "@/components/PropertyForm";
import { useUser } from "@/lib/useUser";
import Link from "next/link";
import { Building2, User, Lock } from "lucide-react";

export default function Sell() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <main className="max-w-md mx-auto px-6 py-20 text-center text-mute">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading listing studio...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-[#0D1412] border border-white/[0.08] text-center shadow-luxury-card">
        <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto mb-4">
          <Building2 className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl text-sand-50 mb-2">Member Authentication Required</h2>
        <p className="text-sm text-mute leading-relaxed mb-6">
          To market a luxury property on PropertyHub Premier, please sign in or create an owner account.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 rounded-full bg-sand-100 text-[#080B0A] text-xs font-semibold uppercase tracking-wider transition"
        >
          Sign In to List Property
        </Link>
      </main>
    );
  }

  return <PropertyForm endpoint="/api/properties" method="POST" />;
}
