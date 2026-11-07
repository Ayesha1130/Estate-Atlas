"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import { useLang } from "@/lib/i18n";
import {
  UploadCloud,
  Trash2,
  Star,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Camera,
  Image as ImageIcon,
} from "lucide-react";

type Img = { id: string; url: string; path: string | null; position: number };
const MAX = 8;
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const OK = ["image/jpeg", "image/png", "image/webp"];
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export default function Photos() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useUser();
  const { t } = useLang();
  const [imgs, setImgs] = useState<Img[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const loadPhotos = useCallback(async () => {
    const { data } = await supabase
      .from("property_images")
      .select("id,url,path,position")
      .eq("property_id", id)
      .order("position");
    setImgs((data ?? []) as Img[]);
  }, [id]);

  useEffect(() => {
    if (user) loadPhotos();
  }, [user, loadPhotos]);

  async function handleUpload(files: FileList | null) {
    if (!files || !user) return;
    setMsg("");
    const list = Array.from(files);

    if (imgs.length + list.length > MAX) {
      return setMsg(t("maxImgs"));
    }

    let pos = imgs.length ? Math.max(...imgs.map((i) => i.position)) + 1 : 0;

    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!OK.includes(f.type)) {
        setMsg(`${f.name}: ${t("badType")}`);
        break;
      }
      if (f.size > MAX_BYTES) {
        setMsg(`${f.name}: ${t("tooBig")}`);
        break;
      }

      setBusy(`${t("uploading")} photo ${i + 1} of ${list.length}...`);
      const path = `${user.id}/${id}/${crypto.randomUUID()}.${EXT[f.type]}`;

      // Upload to Supabase Storage
      const up = await supabase.storage
        .from("property-images")
        .upload(path, f, { contentType: f.type });

      if (up.error) {
        setMsg(`Upload failed: ${up.error.message}. Verify Supabase Storage bucket 'property-images'.`);
        break;
      }

      const url = supabase.storage.from("property-images").getPublicUrl(path).data.publicUrl;

      // Register row in property_images
      const ins = await supabase
        .from("property_images")
        .insert({ property_id: id, url, path, position: pos++ });

      if (ins.error) {
        await supabase.storage.from("property-images").remove([path]);
        setMsg(ins.error.message);
        break;
      }
    }

    setBusy("");
    loadPhotos();
  }

  async function setAsCover(img: Img) {
    const order = [img, ...imgs.filter((i) => i.id !== img.id)];
    await Promise.all(
      order.map((o, k) =>
        supabase.from("property_images").update({ position: k }).eq("id", o.id)
      )
    );
    loadPhotos();
  }

  async function removePhoto(img: Img) {
    if (!window.confirm(t("confirmDel"))) return;
    if (img.path) {
      await supabase.storage.from("property-images").remove([img.path]);
    }
    await supabase.from("property_images").delete().eq("id", img.id);
    loadPhotos();
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 text-center text-mute">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading gallery editor...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-[#0D1412] border border-white/[0.08] text-center shadow-luxury-card">
        <p className="text-mute mb-4">Please log in to manage property photographs.</p>
        <Link href="/login" className="px-6 py-2.5 rounded-full bg-sand-100 text-[#080B0A] text-xs font-semibold uppercase">
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio Dashboard</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
            {t("photos")} Management
          </h1>
          <p className="text-xs text-mute mt-1">
            Upload up to 8 high-resolution architectural photographs. The first photo serves as the primary cover card.
          </p>
        </div>

        <div className="text-xs font-mono text-sand-200 bg-[#090D0B] border border-line px-4 py-2 rounded-full self-start">
          {imgs.length} / {MAX} Uploaded
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleUpload(e.dataTransfer.files);
        }}
        className={`group relative rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition flex flex-col items-center justify-center ${
          dragActive
            ? "border-gold bg-gold/10"
            : "border-line hover:border-gold/50 bg-[#0D1412]/80"
        } ${busy ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4 group-hover:scale-105 transition">
          <UploadCloud className="w-7 h-7" />
        </div>
        <p className="font-serif text-lg text-sand-50 mb-1">
          {busy || t("uploadPhotos")}
        </p>
        <p className="text-xs text-mute">
          Drag and drop images here, or click to browse files
        </p>
        <p className="text-[11px] text-mute/80 mt-2 font-mono">
          JPG, PNG, or WebP · Max 5 MB per file
        </p>

        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          disabled={Boolean(busy) || imgs.length >= MAX}
          className="sr-only"
          onChange={(e) => {
            handleUpload(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {/* Error Message */}
      {msg && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Uploaded Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {imgs.map((img, k) => {
          const isCover = k === 0;
          return (
            <div
              key={img.id}
              className={`group relative rounded-2xl overflow-hidden bg-card border transition ${
                isCover
                  ? "border-gold shadow-glow-gold"
                  : "border-white/[0.08] hover:border-white/20"
              }`}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={img.url}
                  alt={`Photograph ${k + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {isCover && (
                  <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-gold text-[#080B0A] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-[#080B0A]" />
                    <span>Primary Cover</span>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-[#0A0E0C] flex items-center justify-between text-xs">
                {!isCover ? (
                  <button
                    onClick={() => setAsCover(img)}
                    className="text-mute hover:text-gold transition text-[11px] font-medium"
                  >
                    {t("setCover")}
                  </button>
                ) : (
                  <span className="text-emerald-glow text-[11px] font-medium">Cover Set</span>
                )}

                <button
                  onClick={() => removePhoto(img)}
                  title={t("del")}
                  className="p-1.5 rounded-lg text-mute hover:text-red-400 hover:bg-card transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!imgs.length && (
        <div className="rounded-3xl bg-[#0D1412] border border-white/[0.08] p-10 text-center text-mute shadow-luxury-card">
          <ImageIcon className="w-8 h-8 text-gold mx-auto mb-3" />
          <p className="text-sand-100 font-medium">No photographs uploaded yet.</p>
          <p className="text-xs text-mute mt-1">Upload photos to showcase your property in high definition.</p>
        </div>
      )}
    </main>
  );
}
