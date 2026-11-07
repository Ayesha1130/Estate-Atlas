import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/api";

const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
// Admin status comes from the database (profiles.role), verified server-side on every call.
async function getAdmin(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const sb = db();
  const { data } = await sb.auth.getUser(token);
  if (!data.user) return null;
  const { data: prof } = await sb.from("profiles").select("role").eq("id", data.user.id).single();
  return prof?.role === "admin" ? data.user : null;
}
const Action = z.union([
  z.object({ action: z.enum(["approve", "reject", "delete"]), id: z.string().uuid() }),
  z.object({ action: z.literal("set_role"), id: z.string().uuid(), role: z.enum(["user", "admin"]) }),
]);

export async function GET(req: Request) {
  if (!(await getAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const sb = db();
  const count = async (status?: string) => {
    let q = sb.from("properties").select("id", { count: "exact", head: true });
    if (status) q = q.eq("status", status);
    return (await q).count ?? 0;
  };
  const [total, pending, approved, rejected, properties, inquiries, users, logs] = await Promise.all([
    count(), count("pending"), count("approved"), count("rejected"),
    sb.from("properties").select("id,title,price,listing,status").order("created_at", { ascending: false }).limit(100),
    sb.from("inquiries").select("id,name,phone,message,properties(title)").order("created_at", { ascending: false }).limit(50),
    sb.from("profiles").select("id,full_name,role").order("created_at", { ascending: false }).limit(50),
    sb.from("admin_logs").select("id,action,target,created_at").order("created_at", { ascending: false }).limit(20),
  ]);
  return NextResponse.json({ stats: { total, pending, approved, rejected }, properties: properties.data, inquiries: inquiries.data, users: users.data, logs: logs.data });
}

export async function POST(req: Request) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!(await rateLimit(req, "admin", 60))) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const parsed = Action.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const a = parsed.data, sb = db();
  if (a.action === "set_role") {
    if (a.id === admin.id) return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 });
    await sb.from("profiles").update({ role: a.role }).eq("id", a.id);
  } else if (a.action === "approve") await sb.from("properties").update({ status: "approved" }).eq("id", a.id);
  else if (a.action === "reject") await sb.from("properties").update({ status: "rejected" }).eq("id", a.id);
  else await sb.from("properties").delete().eq("id", a.id);
  await sb.from("admin_logs").insert({ admin_id: admin.id, action: a.action, target: a.id });
  return NextResponse.json({ ok: true });
}
