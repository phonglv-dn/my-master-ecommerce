"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Expand, Package, X } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  outOfStockLabel?: string | null;
}

export default function ProductGallery({
  images,
  alt,
  outOfStockLabel,
}: ProductGalleryProps) {
  const t = useTranslations("product");
  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const goPrev = useCallback(() => {
    setImgError(false);
    setActiveIndex((idx) => (idx - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setImgError(false);
    setActiveIndex((idx) => (idx + 1) % images.length);
  }, [images.length]);

  // Keyboard nav (only when lightbox is open)
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goPrev, goNext]);

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [lightboxOpen]);

  const activeImage = hasImages ? images[activeIndex] : null;

  return (
    <div className="flex w-full flex-1 flex-col gap-4 lg:max-w-[640px]">
      {/* Image + vertical thumb strip row (thumbs only show on lg+) */}
      <div className="flex w-full gap-3">
        {/* ── Vertical thumbnail strip (desktop, on the left of main image) ── */}
        {hasMultiple && (
          <div className="hidden w-[88px] shrink-0 flex-col gap-3 lg:flex">
            {images.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  setImgError(false);
                }}
                aria-label={`${alt} — ${idx + 1}`}
                aria-pressed={activeIndex === idx}
                className={`relative aspect-square w-full overflow-hidden bg-[#f0efeb] transition ${
                  activeIndex === idx
                    ? "opacity-100 ring-1 ring-black"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${alt} - ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="88px"
                />
              </button>
            ))}
          </div>
        )}

        {/* ── Main image ── */}
        <div className="group relative aspect-square w-full flex-1 overflow-hidden bg-[#f0efeb] dark:bg-gray-800">
          {activeImage && !imgError ? (
            <Image
              key={activeImage}
              src={activeImage}
              alt={alt}
              fill
              className="cursor-zoom-in object-cover transition-opacity duration-300 motion-safe:animate-[fadeIn_0.3s_ease-out]"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
              onError={() => setImgError(true)}
              onClick={() => setLightboxOpen(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <Package size={80} />
            </div>
          )}

          {outOfStockLabel && (
            <span className="absolute left-4 top-4 bg-black px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
              {outOfStockLabel}
            </span>
          )}

          {/* Expand affordance (desktop hover) */}
          {hasImages && (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={t("expandImage")}
              className="absolute right-4 top-4 hidden h-9 w-9 items-center justify-center bg-white/80 text-black opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-white lg:flex"
            >
              <Expand size={16} />
            </button>
          )}

          {/* Prev / Next chevrons */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label={t("prevImage")}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/80 text-black backdrop-blur transition hover:bg-white lg:opacity-0 lg:group-hover:opacity-100"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label={t("nextImage")}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/80 text-black backdrop-blur transition hover:bg-white lg:opacity-0 lg:group-hover:opacity-100"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Counter badge */}
          {hasMultiple && (
            <span className="absolute bottom-4 right-4 bg-black/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur">
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </div>
      </div>

      {/* ── Mobile horizontal thumbnail strip ── */}
      {hasMultiple && (
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
          {images.map((img, idx) => (
            <button
              key={`m-${img}-${idx}`}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                setImgError(false);
              }}
              aria-label={`${alt} — ${idx + 1}`}
              aria-pressed={activeIndex === idx}
              className={`relative h-20 w-20 shrink-0 overflow-hidden bg-[#f0efeb] transition ${
                activeIndex === idx
                  ? "opacity-100 ring-1 ring-black"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} - ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox modal ── */}
      {lightboxOpen && activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/95 p-6 sm:p-12"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            aria-label={t("close")}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <X size={22} />
          </button>

          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label={t("prevImage")}
              className="absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition hover:text-white"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <div
            className="relative h-full max-h-[78vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={`lb-${activeImage}`}
              src={activeImage}
              alt={alt}
              fill
              className="object-contain motion-safe:animate-[fadeIn_0.25s_ease-out]"
              sizes="90vw"
              priority
            />
          </div>

          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label={t("nextImage")}
              className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition hover:text-white"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {hasMultiple && (
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-white/70">
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
