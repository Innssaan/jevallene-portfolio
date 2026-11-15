import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { playModalOpenSound, playSlideSound } from "@/lib/sound";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
  Maximize2,
  Minimize2,
  Sparkles,
  X,
} from "lucide-react";

export interface DetailLightboxLink {
  label: string;
  href: string;
}

export interface DetailLightboxItem {
  id: string;
  eyebrow: string;
  badge?: string;
  title: string;
  subtitle?: string;
  image?: string;
  images?: string[];
  imageAlt?: string;
  gradientFallback?: string;
  visualAccentRgb?: string;
  visualIcon?: ReactNode;
  description: string;
  highlights?: string[];
  tags?: string[];
  links?: DetailLightboxLink[];
  primaryAction?: {
    label: string;
    active?: boolean;
    onClick: () => void;
  };
}

interface DetailLightboxModalProps {
  items: DetailLightboxItem[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
  lang?: "id" | "en";
}

export function DetailLightboxModal({
  items,
  activeIndex,
  onClose,
  onChangeIndex,
  lang = "id",
}: DetailLightboxModalProps) {
  const [imageExpanded, setImageExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const swipeStartX = useRef<number | null>(null);

  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < items.length;
  const item = isOpen ? items[activeIndex] : null;
  const hasMultiple = items.length > 1;
  const gallery = item?.images && item.images.length > 0 ? item.images : item?.image ? [item.image] : [];
  const hasGallery = gallery.length > 1;

  useEffect(() => {
    setImageExpanded(false);
    setImgError(false);
    setSlideIndex(0);
    setDragOffset(0);
  }, [activeIndex, item?.id]);

  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      playModalOpenSound();
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  const handleHeroPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!hasGallery) return;
    if ((e.target as HTMLElement).closest("button")) return;
    swipeStartX.current = e.clientX;
  };

  const handleHeroPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!hasGallery || swipeStartX.current === null) return;
    setDragOffset(e.clientX - swipeStartX.current);
  };

  const handleHeroPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (!hasGallery || swipeStartX.current === null) return;
    const dx = e.clientX - swipeStartX.current;
    swipeStartX.current = null;
    setDragOffset(0);
    if (dx < -40) {
      playSlideSound();
      setSlideIndex((prev) => (prev + 1) % gallery.length);
    } else if (dx > 40) {
      playSlideSound();
      setSlideIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && hasMultiple && activeIndex !== null) {
        onChangeIndex((activeIndex + 1) % items.length);
      } else if (e.key === "ArrowLeft" && hasMultiple && activeIndex !== null) {
        onChangeIndex((activeIndex - 1 + items.length) % items.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, hasMultiple, activeIndex, items.length, onClose, onChangeIndex]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          key="detail-lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-lightbox-title"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
        >
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-white text-neutral-950 shadow-[0_24px_80px_rgba(0,0,0,0.65)] dark:border-white/15 dark:bg-[#111116] dark:text-[#FAFAFA]"
          >
            {/* Top-right floating controls */}
            <div className="absolute right-3 top-3 z-30 flex items-center gap-2">
              {hasGallery && !imgError && (
                <span className="rounded-full border border-white/25 bg-black/55 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white backdrop-blur-md">
                  {slideIndex + 1} / {gallery.length}
                </span>
              )}
              {gallery.length > 0 && !imgError && (
                <button
                  type="button"
                  onClick={() => setImageExpanded((prev) => !prev)}
                  aria-label={
                    imageExpanded
                      ? lang === "en"
                        ? "Shrink image"
                        : "Perkecil gambar"
                      : lang === "en"
                        ? "Expand full image"
                        : "Perbesar gambar penuh"
                  }
                  title={
                    imageExpanded
                      ? lang === "en"
                        ? "Normal View"
                        : "Mode Normal"
                      : lang === "en"
                        ? "Full Image View"
                        : "Mode Gambar Penuh"
                  }
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:bg-accent"
                >
                  {imageExpanded ? (
                    <Minimize2 className="size-4" />
                  ) : (
                    <Maximize2 className="size-4" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label={lang === "en" ? "Close preview" : "Tutup pratinjau"}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable modal body */}
            <div className="flex-1 overflow-y-auto">
              {/* Large Image / Visual Showcase */}
              <div
                onPointerDown={handleHeroPointerDown}
                onPointerMove={handleHeroPointerMove}
                onPointerUp={handleHeroPointerEnd}
                onPointerCancel={handleHeroPointerEnd}
                className={`relative flex w-full select-none items-end overflow-hidden border-b border-white/10 bg-gradient-to-br ${
                  item.gradientFallback ?? "from-neutral-900 via-[#1b1216] to-black"
                } transition-all duration-300 ${
                  hasGallery ? "cursor-grab active:cursor-grabbing touch-pan-y " : ""
                }${
                  imageExpanded ? "h-[58vh] sm:h-[65vh]" : "h-56 sm:h-72 md:h-84"
                }`}
              >
                {gallery.length > 0 && !imgError && (
                  <div
                    className="absolute inset-0 flex h-full w-full transition-transform duration-300 ease-out"
                    style={{
                      transform: `translateX(calc(-${slideIndex * 100}% + ${dragOffset}px))`,
                      transitionDuration: dragOffset !== 0 ? "0ms" : undefined,
                    }}
                  >
                    {gallery.map((src, idx) => (
                      <div key={src + idx} className="relative h-full w-full shrink-0">
                        <img
                          src={src}
                          alt={`${item.imageAlt ?? item.title}${hasGallery ? ` (${idx + 1}/${gallery.length})` : ""}`}
                          draggable={false}
                          onError={() => setImgError(true)}
                          className={`h-full w-full transition-all duration-500 ${
                            imageExpanded
                              ? "bg-black/95 object-contain p-2"
                              : "object-cover"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {hasGallery && !imgError && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        playSlideSound();
                        setSlideIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
                      }}
                      aria-label={lang === "en" ? "Previous photo" : "Foto sebelumnya"}
                      className="absolute left-3 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:bg-accent"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playSlideSound();
                        setSlideIndex((prev) => (prev + 1) % gallery.length);
                      }}
                      aria-label={lang === "en" ? "Next photo" : "Foto berikutnya"}
                      className="absolute right-3 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:bg-accent"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </>
                )}

                {/* Ambient radial glow when visualAccentRgb is provided */}
                {item.visualAccentRgb && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 50% 45%, rgba(${item.visualAccentRgb}, 0.32), transparent 68%)`,
                    }}
                  />
                )}

                {/* Gradient scrim for text readability */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/15"
                />

                {/* Optional large centered icon emblem (great for Tech Stack or fallback) */}
                {item.visualIcon && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                      className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-black/45 text-white shadow-[0_0_50px_rgba(0,0,0,0.45)] backdrop-blur-md sm:h-28 sm:w-28 [&_svg]:h-12 [&_svg]:w-12 sm:[&_svg]:h-14 sm:[&_svg]:w-14"
                      style={
                        item.visualAccentRgb
                          ? {
                              boxShadow: `0 0 48px rgba(${item.visualAccentRgb}, 0.35)`,
                              borderColor: `rgba(${item.visualAccentRgb}, 0.45)`,
                            }
                          : undefined
                      }
                    >
                      {item.visualIcon}
                    </div>
                  </div>
                )}

                {/* Bottom overlay badges inside hero image */}
                <div className="relative z-10 flex w-full flex-wrap items-center justify-between gap-2 p-4 sm:p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    <Sparkles className="size-3.5 text-accent" />
                    {item.eyebrow}
                  </span>

                  {hasGallery && !imgError && (
                    <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1.5 backdrop-blur-md">
                      {gallery.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSlideIndex(idx)}
                          aria-label={`${lang === "en" ? "Photo" : "Foto"} ${idx + 1}`}
                          className={`h-1.5 cursor-pointer rounded-full transition-all ${
                            idx === slideIndex
                              ? "w-4 bg-white"
                              : "w-1.5 bg-white/45 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {item.badge && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      <span className="tb-pulse h-1.5 w-1.5 rounded-full bg-[#35C46A]" />
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Full Description & Details */}
              <div className="p-5 sm:p-7">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3
                    id="detail-lightbox-title"
                    className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                  >
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                      {item.subtitle}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.description}
                </p>

                {item.highlights && item.highlights.length > 0 && (
                  <div className="mt-5 rounded-xl border border-border bg-muted/35 p-4 dark:bg-white/[0.03]">
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80">
                      {lang === "en" ? "Key Highlights & Details" : "Poin Utama & Detail"}
                    </p>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {item.highlights.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground sm:text-sm"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground dark:border-[#26262B] dark:bg-[#1A1A1F]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action links & Prev/Next controls */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {item.primaryAction && (
                      <motion.button
                        type="button"
                        onClick={item.primaryAction.onClick}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                          item.primaryAction.active
                            ? "border-accent bg-accent text-white shadow-[0_0_20px_rgba(var(--accent-rgb),0.35)]"
                            : "border-accent/50 bg-accent/12 text-accent hover:bg-accent hover:text-white dark:text-white"
                        }`}
                      >
                        <Sparkles className="size-3.5" />
                        {item.primaryAction.label}
                      </motion.button>
                    )}

                    {item.links?.map((link) => {
                      const isExternal = link.href.startsWith("http");
                      return (
                        <motion.a
                          key={link.label}
                          href={link.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          onClick={() => {
                            if (!isExternal) onClose();
                          }}
                          whileHover={{ x: 2, scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent/60 hover:bg-accent/15 dark:border-white/15 dark:bg-white/[0.05] dark:hover:text-white"
                        >
                          {link.label === "GitHub" ? (
                            <FolderGit2 className="size-3.5" />
                          ) : (
                            <ArrowUpRight className="size-3.5" />
                          )}
                          {link.label}
                        </motion.a>
                      );
                    })}
                  </div>

                  {hasMultiple && activeIndex !== null && (
                    <div className="flex items-center gap-2">
                      <span className="mr-1 text-xs tabular-nums text-muted-foreground">
                        {activeIndex + 1} / {items.length}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onChangeIndex((activeIndex - 1 + items.length) % items.length)
                        }
                        aria-label={lang === "en" ? "Previous item" : "Item sebelumnya"}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-muted/50 text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-white"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeIndex((activeIndex + 1) % items.length)}
                        aria-label={lang === "en" ? "Next item" : "Item berikutnya"}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-muted/50 text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-white"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
