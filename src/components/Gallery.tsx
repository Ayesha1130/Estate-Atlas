"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const safeImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"];

  const step = useCallback(
    (d: number) => setIndex((v) => (v + d + safeImages.length) % safeImages.length),
    [safeImages.length]
  );

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, step]);

  return (
    <div className="flex flex-col gap-3">
      {/* Primary Hero Image */}
      <div
        onClick={() => setOpen(true)}
        className="group relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-black/40 border border-white/[0.08] cursor-pointer shadow-luxury-card"
      >
        <Image
          src={safeImages[index]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Fullscreen Expand Pill */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs text-sand-50 group-hover:bg-gold group-hover:text-black transition">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>View Fullscreen</span>
        </div>

        {/* Counter Badge */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs text-sand-200 font-mono">
          {index + 1} / {safeImages.length}
        </div>
      </div>

      {/* Thumbnails Strip */}
      {safeImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {safeImages.map((url, k) => (
            <button
              key={k}
              onClick={() => setIndex(k)}
              aria-label={`Photo ${k + 1}`}
              className={`relative h-18 w-24 sm:h-20 sm:w-28 shrink-0 rounded-2xl overflow-hidden border-2 transition ${
                k === index
                  ? "border-gold shadow-glow-gold scale-95"
                  : "border-transparent opacity-65 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label={t("close")}
            className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-card/80 border border-white/20 text-white flex items-center justify-center hover:bg-gold hover:text-black transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative max-h-[85vh] max-w-[92vw] aspect-[16/10] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={safeImages[index]}
              alt={alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={t("prev")}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 border border-white/20 text-white flex items-center justify-center hover:bg-gold hover:text-black transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={t("next")}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 border border-white/20 text-white flex items-center justify-center hover:bg-gold hover:text-black transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 inset-x-0 text-center text-xs font-mono text-sand-200">
            {index + 1} of {safeImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
