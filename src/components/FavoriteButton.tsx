"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/i18n";
import { useUser } from "@/lib/useUser";
import { Heart } from "lucide-react";

export default function FavoriteButton({ id }: { id: string }) {
  const { user } = useUser();
  const { t } = useLang();
  const router = useRouter();
  const [fav, setFav] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("favorites")
      .select("property_id")
      .eq("user_id", user.id)
      .eq("property_id", id)
      .then(({ data }) => setFav(Boolean(data?.length)));
  }, [user, id]);

  async function toggle() {
    if (!user) return router.push("/login");
    setBusy(true);
    const next = !fav;
    setFav(next);

    if (next) {
      await supabase.from("favorites").insert({ user_id: user.id, property_id: id });
    } else {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("property_id", id);
    }
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label="Wishlist toggle"
      className={`w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border text-xs font-semibold tracking-wide transition shadow-sm ${
        fav
          ? "bg-gold/15 border-gold text-gold"
          : "bg-card hover:bg-cardMuted border-line hover:border-gold/50 text-sand-100"
      }`}
    >
      <Heart className={`w-3.5 h-3.5 ${fav ? "fill-gold text-gold" : "text-sand-200"}`} />
      <span>{fav ? t("saved") : t("save")}</span>
    </button>
  );
}
