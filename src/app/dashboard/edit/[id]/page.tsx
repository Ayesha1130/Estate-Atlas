"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PropertyForm, { FormState } from "@/components/PropertyForm";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useUser();
  const [init, setInit] = useState<FormState | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return setMissing(true);
        setInit({
          title: data.title,
          description: data.description ?? "",
          listing: data.listing,
          type: data.type,
          city: data.city,
          area: data.area ?? "",
          price: String(data.price),
          bedrooms: data.bedrooms == null ? "" : String(data.bedrooms),
          size_sqft: String(data.size_sqft ?? ""),
        });
      });
  }, [user, id]);

  if (loading) {
    return (
      <main className="max-w-md mx-auto px-6 py-20 text-center text-mute">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading property details...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-[#0D1412] border border-white/[0.08] text-center shadow-luxury-card">
        <p className="text-mute mb-4">Please log in to edit this listing.</p>
        <Link href="/login" className="px-6 py-2.5 rounded-full bg-sand-100 text-[#080B0A] text-xs font-semibold uppercase">
          Sign In
        </Link>
      </main>
    );
  }

  if (missing) {
    return (
      <main className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-[#0D1412] border border-red-900/40 text-center shadow-luxury-card">
        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <h2 className="font-serif text-2xl text-sand-50 mb-2">Listing Not Found</h2>
        <p className="text-xs text-mute leading-relaxed mb-6">
          This property does not exist or you do not possess ownership authorization to edit it.
        </p>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </main>
    );
  }

  if (!init) return null;

  return <PropertyForm initial={init} endpoint={`/api/properties/${id}`} method="PATCH" />;
}
