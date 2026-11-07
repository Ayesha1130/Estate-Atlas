"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase, Property, pkr } from "@/lib/supabase";
import { formatArea } from "@/lib/format";
import { useLang } from "@/lib/i18n";
import { useUser } from "@/lib/useUser";
import {
  Plus,
  Edit,
  Camera,
  Trash2,
  Lock,
  Unlock,
  Building2,
  MessageSquare,
  Heart,
  User,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

type Inq = { id: string; name: string; phone: string; message: string; properties: { title: string } | null; created_at?: string };

export default function Dashboard() {
  const { user, loading } = useUser();
  const { t } = useLang();
  const [inq, setInq] = useState<Inq[]>([]);
  const [items, setItems] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<"listings" | "inquiries">("listings");
  const [statusFilter, setStatusFilter] = useState("");

  const loadProperties = () => {
    if (user) {
      supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => setItems((data as Property[]) ?? []));
    }
  };

  useEffect(() => {
    loadProperties();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) {
      supabase
        .from("inquiries")
        .select("id,name,phone,message,created_at,properties(title)")
        .order("created_at", { ascending: false })
        .limit(25)
        .then(({ data }) => setInq((data ?? []) as unknown as Inq[]));
    }
  }, [user]);

  async function handleDelete(id: string) {
    if (!window.confirm(t("confirmDel"))) return;
    await supabase.from("properties").delete().eq("id", id);
    loadProperties();
  }

  async function handleToggleStatus(id: string, currentStatus?: string) {
    const nextStatus = currentStatus === "approved" ? "closed" : "approved";
    const { data } = await supabase.auth.getSession();
    await fetch(`/api/properties/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.session?.access_token}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });
    loadProperties();
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 text-center text-mute">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading your portfolio...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-[#0D1412] border border-white/[0.08] text-center shadow-luxury-card">
        <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto mb-4">
          <User className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-sand-50 mb-2">Member Authentication Required</h2>
        <p className="text-sm text-mute leading-relaxed mb-6">
          Please sign in to access your personal dashboard, manage listings, and view inquiries.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 rounded-full bg-sand-100 text-[#080B0A] text-xs font-semibold uppercase tracking-wider transition"
        >
          Sign In / Create Account
        </Link>
      </main>
    );
  }

  const filteredItems = items.filter((p) => (!statusFilter || p.status === statusFilter));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold block mb-1">
            Personal Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
            {t("dashboard")}
          </h1>
          <p className="text-xs text-mute mt-1 font-mono">
            Signed in as: <span className="text-sand-100">{user.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/favorites"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-line hover:border-gold/50 text-xs font-medium text-sand-100 transition"
          >
            <Heart className="w-4 h-4 text-gold" />
            <span>{t("favorites")}</span>
          </Link>
          <Link
            href="/sell"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold hover:bg-gold-light text-[#080B0A] text-xs font-semibold uppercase tracking-wider transition shadow-md"
          >
            <Plus className="w-4 h-4 text-[#080B0A]" />
            <span>{t("newListing")}</span>
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 shadow-luxury-card">
          <p className="text-xs uppercase font-bold tracking-wider text-mute mb-1">
            Properties Listed
          </p>
          <p className="font-serif text-3xl font-bold text-sand-50">{items.length}</p>
        </div>
        <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 shadow-luxury-card">
          <p className="text-xs uppercase font-bold tracking-wider text-mute mb-1">
            Active Public
          </p>
          <p className="font-serif text-3xl font-bold text-emerald-glow">
            {items.filter((p) => p.status === "approved").length}
          </p>
        </div>
        <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 shadow-luxury-card">
          <p className="text-xs uppercase font-bold tracking-wider text-mute mb-1">
            Inquiries Received
          </p>
          <p className="font-serif text-3xl font-bold text-gold">{inq.length}</p>
        </div>
      </div>

      {/* View Switcher: Listings vs Inquiries */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition ${
              activeTab === "listings"
                ? "bg-gold text-[#080B0A]"
                : "bg-card border border-line text-sand-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t("myListings")} ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition ${
              activeTab === "inquiries"
                ? "bg-gold text-[#080B0A]"
                : "bg-card border border-line text-sand-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t("myInquiries")} ({inq.length})</span>
          </button>
        </div>

        {activeTab === "listings" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-mute">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#090D0B] border border-line rounded-full px-4 py-1.5 text-xs text-sand-100 outline-none focus:border-gold"
            >
              <option value="">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {/* SECTION 1: MY PROPERTIES */}
      {activeTab === "listings" && (
        <div className="space-y-4">
          {filteredItems.map((p) => {
            const isApproved = p.status === "approved";
            return (
              <div
                key={p.id}
                className="rounded-3xl bg-[#0D1412] border border-white/[0.08] hover:border-gold/30 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-luxury-card transition"
              >
                {/* Thumbnail & Title Details */}
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-20 rounded-2xl overflow-hidden bg-black/40 shrink-0">
                    <Image
                      src={p.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80"}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                          p.status === "approved"
                            ? "bg-emerald/30 text-emerald-glow border border-emerald-light/40"
                            : p.status === "pending"
                            ? "bg-yellow-950/40 text-yellow-300 border border-yellow-700/40"
                            : "bg-red-950/40 text-red-300 border border-red-800/40"
                        }`}
                      >
                        {p.status}
                      </span>
                      <span className="text-xs text-mute capitalize">{p.type} · {p.listing}</span>
                    </div>

                    <Link
                      href={`/property/${p.id}`}
                      className="font-serif text-lg font-normal text-sand-50 hover:text-gold transition flex items-center gap-1 leading-snug"
                    >
                      <span>{p.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gold" />
                    </Link>

                    <p className="text-xs text-mute mt-1">
                      <span className="text-sand-50 font-semibold">{pkr(p.price)}</span> ·{" "}
                      <span>{formatArea(p.size_sqft || 2250)}</span> · {p.city}
                    </p>
                  </div>
                </div>

                {/* Listing Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                  <Link
                    href={`/dashboard/edit/${p.id}`}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-full bg-card hover:bg-cardMuted border border-line text-xs font-medium text-sand-200 hover:text-gold transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>{t("edit")}</span>
                  </Link>

                  <Link
                    href={`/dashboard/photos/${p.id}`}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-full bg-card hover:bg-cardMuted border border-line text-xs font-medium text-sand-200 hover:text-gold transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t("photos")}</span>
                  </Link>

                  {(p.status === "approved" || p.status === "closed") && (
                    <button
                      onClick={() => handleToggleStatus(p.id, p.status)}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-full bg-card hover:bg-cardMuted border border-line text-xs font-medium text-sand-200 transition"
                    >
                      {isApproved ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{isApproved ? t("closeL") : t("reopen")}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-full bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-xs font-medium text-red-300 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t("del")}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {!filteredItems.length && (
            <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-12 text-center text-mute shadow-luxury-card">
              <Building2 className="w-8 h-8 text-gold mx-auto mb-3" />
              <p className="text-sand-100 font-medium mb-1">{t("noListings")}</p>
              <p className="text-xs text-mute mb-4">Market your property to thousands of high-net-worth investors.</p>
              <Link
                href="/sell"
                className="inline-block px-6 py-2.5 rounded-full bg-gold text-[#080B0A] font-semibold text-xs uppercase tracking-wider"
              >
                {t("newListing")}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: INQUIRIES RECEIVED */}
      {activeTab === "inquiries" && (
        <div className="space-y-4">
          {inq.map((i) => (
            <div
              key={i.id}
              className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 shadow-luxury-card space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-sand-50 text-sm">{i.name}</span>
                  <span className="text-xs text-gold font-mono ml-3">{i.phone}</span>
                </div>
                {i.created_at && (
                  <span className="text-xs text-mute">
                    {new Date(i.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-sand-200/90">
                <span className="text-mute font-medium">Target Listing:</span>{" "}
                <span className="text-gold">{i.properties?.title || "Property"}</span>
              </p>
              <div className="bg-[#090D0B] p-4 rounded-2xl border border-line text-xs text-sand-200/90 leading-relaxed">
                “{i.message || "I am interested in scheduling a private inspection for this residence."}”
              </div>
            </div>
          ))}

          {!inq.length && (
            <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-12 text-center text-mute shadow-luxury-card">
              <MessageSquare className="w-8 h-8 text-gold mx-auto mb-3" />
              <p className="text-sand-100 font-medium">No inquiries received yet.</p>
              <p className="text-xs text-mute mt-1">Direct buyer messages and tour requests will appear here.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
