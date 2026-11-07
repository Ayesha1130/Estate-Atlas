"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase, pkr } from "@/lib/supabase";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  Users,
  Building2,
  MessageSquare,
  Activity,
  Search,
  Filter,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

type Prop = { id: string; title: string; price: number; listing: string; status: string; city?: string; area?: string };
type Inq = { id: string; name: string; phone: string; message: string; properties: { title: string } | null; created_at?: string };
type U = { id: string; full_name: string | null; role: string; email?: string };
type Log = { id: string; action: string; target: string | null; created_at: string };
type Data = {
  stats: { total: number; pending: number; approved: number; rejected: number };
  properties: Prop[];
  inquiries: Inq[];
  users: U[];
  logs: Log[];
};

export default function Admin() {
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"listings" | "users" | "inquiries" | "logs">("listings");

  const getToken = async () => (await supabase.auth.getSession()).data.session?.access_token;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setErr("Please log in with an administrator account.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.error) {
        setErr(json.error);
      } else {
        setData(json as Data);
      }
    } catch (e) {
      setErr("Failed to connect to administration server.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleAction(body: object, confirmMsg: string) {
    if (!window.confirm(confirmMsg)) return;
    const token = await getToken();
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json.error) {
      alert(json.error);
    } else {
      loadData();
    }
  }

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !data) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-20 text-center text-mute">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Verifying server-side administrative credentials...</p>
      </main>
    );
  }

  if (err) {
    return (
      <main className="max-w-md mx-auto mt-20 p-8 rounded-3xl bg-[#0D1412] border border-red-900/40 text-center shadow-luxury-card">
        <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-700/50 text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-sand-50 mb-2">Restricted Access</h2>
        <p className="text-sm text-mute leading-relaxed mb-6">
          Access to this console requires verified administrator privileges: {err}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-full bg-sand-100 text-bg text-xs font-semibold uppercase tracking-wider"
        >
          Return to Marketplace
        </Link>
      </main>
    );
  }

  if (!data) return null;

  const matchesSearch = (text: string | null | undefined) =>
    (text ?? "").toLowerCase().includes(searchTerm.toLowerCase());

  const filteredProps = (data.properties ?? []).filter(
    (p) => matchesSearch(p.title) && (!statusFilter || p.status === statusFilter)
  );

  const filteredUsers = (data.users ?? []).filter(
    (u) => matchesSearch(u.full_name) || matchesSearch(u.id) || matchesSearch(u.role)
  );

  const filteredInquiries = (data.inquiries ?? []).filter(
    (i) => matchesSearch(i.name) || matchesSearch(i.phone) || matchesSearch(i.message) || matchesSearch(i.properties?.title)
  );

  const kpis = [
    { label: "Total Portfolios", value: data.stats.total, color: "text-sand-50" },
    { label: "Pending Verification", value: data.stats.pending, color: "text-yellow-400" },
    { label: "Active Public Listings", value: data.stats.approved, color: "text-emerald-glow" },
    { label: "Soft Rejected", value: data.stats.rejected, color: "text-red-400" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-glow mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Command</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
            Platform Moderation & Security
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData()}
            className="px-4 py-2 rounded-full bg-card border border-line hover:border-gold text-xs text-sand-100 transition"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-6 shadow-luxury-card"
          >
            <p className="text-xs uppercase font-bold tracking-wider text-mute mb-1">
              {kpi.label}
            </p>
            <p className={`font-serif text-3xl sm:text-4xl font-bold ${kpi.color}`}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-[#090D0B] p-1 rounded-full border border-line w-full sm:w-auto overflow-x-auto">
          {[
            { id: "listings", label: `Listings (${filteredProps.length})`, icon: Building2 },
            { id: "users", label: `Users (${filteredUsers.length})`, icon: Users },
            { id: "inquiries", label: `Inquiries (${filteredInquiries.length})`, icon: MessageSquare },
            { id: "logs", label: `Audit Trail (${data.logs?.length ?? 0})`, icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition ${
                  active ? "bg-gold text-[#080B0A]" : "text-sand-200 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search listings, users..."
              className="w-full bg-[#090D0B] border border-line rounded-full pl-9 pr-4 py-2 text-xs text-sand-100 outline-none focus:border-gold"
            />
          </div>

          {activeTab === "listings" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#090D0B] border border-line rounded-full px-4 py-2 text-xs text-sand-100 outline-none focus:border-gold cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
            </select>
          )}
        </div>
      </div>

      {/* TAB 1: LISTINGS MODERATION */}
      {activeTab === "listings" && (
        <section className="space-y-3">
          {filteredProps.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-[#0D1412] border border-white/[0.08] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm hover:border-gold/30 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/property/${p.id}`}
                    target="_blank"
                    className="font-semibold text-sand-100 hover:text-gold flex items-center gap-1"
                  >
                    <span>{p.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
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
                </div>
                <p className="text-xs text-mute">
                  Demand: <span className="text-sand-50 font-semibold">{pkr(p.price)}</span> · Listing:{" "}
                  <span className="capitalize">{p.listing}</span>
                </p>
              </div>

              {/* Moderation Actions */}
              <div className="flex items-center gap-2">
                {p.status !== "approved" && (
                  <button
                    onClick={() =>
                      handleAction(
                        { id: p.id, action: "approve" },
                        "Approve and publish this property listing to the public marketplace?"
                      )
                    }
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-emerald/60 hover:bg-emerald text-emerald-glow hover:text-white border border-emerald-light/50 text-xs font-semibold transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {p.status === "pending" && (
                  <button
                    onClick={() =>
                      handleAction(
                        { id: p.id, action: "reject" },
                        "Soft reject this listing? The owner can edit and resubmit for review."
                      )
                    }
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-yellow-950/60 hover:bg-yellow-900/80 text-yellow-300 border border-yellow-700/50 text-xs font-semibold transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    handleAction(
                      { id: p.id, action: "delete" },
                      "Permanently purge this listing from the database? This cannot be undone."
                    )
                  }
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 text-xs font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}

          {!filteredProps.length && (
            <div className="rounded-2xl bg-[#0D1412] border border-white/[0.08] p-10 text-center text-mute text-sm">
              No property listings match the selected filters.
            </div>
          )}
        </section>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === "users" && (
        <section className="space-y-3">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="rounded-2xl bg-[#0D1412] border border-white/[0.08] p-4 sm:p-5 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-sand-50 text-sm">
                  {u.full_name || "Premier Member"}
                </p>
                <p className="text-xs text-mute font-mono">
                  ID: {u.id} · Role:{" "}
                  <span
                    className={
                      u.role === "admin"
                        ? "text-emerald-glow font-bold"
                        : "text-sand-200"
                    }
                  >
                    {u.role.toUpperCase()}
                  </span>
                </p>
              </div>

              <button
                onClick={() =>
                  handleAction(
                    {
                      id: u.id,
                      action: "set_role",
                      role: u.role === "admin" ? "user" : "admin",
                    },
                    `Change account role to ${
                      u.role === "admin" ? "standard user" : "administrator"
                    }?`
                  )
                }
                className="px-4 py-2 rounded-full bg-card border border-line hover:border-gold text-xs text-sand-100 font-medium transition"
              >
                {u.role === "admin" ? "Revoke Admin Role" : "Promote to Admin"}
              </button>
            </div>
          ))}
        </section>
      )}

      {/* TAB 3: INQUIRIES */}
      {activeTab === "inquiries" && (
        <section className="space-y-3">
          {filteredInquiries.map((i) => (
            <div
              key={i.id}
              className="rounded-2xl bg-[#0D1412] border border-white/[0.08] p-5 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sand-50">{i.name}</span>
                <span className="text-gold font-mono">{i.phone}</span>
              </div>
              <p className="text-xs text-sand-200/90 font-light">
                <span className="text-mute font-medium">Estate:</span>{" "}
                {i.properties?.title || "Property"}
              </p>
              <p className="text-xs text-sand-200/80 bg-[#090D0B] p-3 rounded-xl border border-line">
                “{i.message || "Requesting a private VIP viewing."}”
              </p>
            </div>
          ))}
          {!filteredInquiries.length && (
            <div className="p-8 text-center text-mute text-sm">No client inquiries found.</div>
          )}
        </section>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "logs" && (
        <section className="rounded-2xl bg-[#0D1412] border border-white/[0.08] p-6 divide-y divide-white/[0.06]">
          {data.logs.map((l) => (
            <div key={l.id} className="py-3 flex items-center justify-between text-xs">
              <div className="space-x-3">
                <span className="font-mono text-sand-50 font-bold uppercase">
                  {l.action}
                </span>
                <span className="text-mute font-mono">
                  Target: {l.target?.slice(0, 8)}...
                </span>
              </div>
              <span className="text-mute">
                {new Date(l.created_at).toLocaleString()}
              </span>
            </div>
          ))}
          {!data.logs.length && (
            <p className="text-mute text-xs">No admin activity logged yet.</p>
          )}
        </section>
      )}
    </main>
  );
}
