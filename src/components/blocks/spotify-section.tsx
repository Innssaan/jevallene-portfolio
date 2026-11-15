import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Disc3, ExternalLink, Headphones } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { Magnetic } from "@/components/ui/micro-interactions";

const SPOTIFY_PLAYLIST_URL =
  "https://open.spotify.com/playlist/0jLgldvuOTDVtHrH2M48QT?si=2b41b74c2de94a86";
const SPOTIFY_EMBED_URL =
  "https://open.spotify.com/embed/playlist/0jLgldvuOTDVtHrH2M48QT?utm_source=generator&theme=0";

export function SpotifySection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SPOTIFY_PLAYLIST_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback if clipboard permission is unavailable
      setCopied(false);
    }
  };

  return (
    <section
      id="spotify"
      aria-labelledby="spotify-heading"
      className="px-4 sm:px-6 lg:px-8 py-10 sm:py-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left column: Daily Spotify info & direct CTA */}
          <GlowCard
            className="lg:col-span-5"
            contentClassName="p-6 sm:p-8 flex flex-col justify-between gap-6"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-zinc-700 dark:text-[#C4C4CC]">
                  <span
                    className="w-2 h-2 rounded-full bg-accent animate-pulse"
                    aria-hidden="true"
                  />
                  Daily Spotify
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border border-[#D4D4D8] dark:border-[#3A3A44] bg-zinc-100 dark:bg-[#1A1A1F] text-zinc-800 dark:text-[#FAFAFA]">
                  <Disc3 className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                  Live Playlist
                </span>
              </div>

              <h2
                id="spotify-heading"
                className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-[#FAFAFA] mb-3"
              >
                Soundtrack Harian
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-[#C4C4CC]">
                Playlist pilihan yang menemani sesi desain, ngoding, dan editing
                visual. Putar langsung di sini atau buka di aplikasi Spotify.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-[#D4D4D8] dark:border-[#3A3A44] bg-zinc-100 dark:bg-[#1A1A1F] text-zinc-800 dark:text-[#FAFAFA]">
                  <Headphones className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                  Daily Rotation
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-[#D4D4D8] dark:border-[#3A3A44] bg-zinc-100 dark:bg-[#1A1A1F] text-zinc-800 dark:text-[#FAFAFA]">
                  Coding &amp; Focus
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4D4D8] dark:border-[#3A3A44] flex flex-wrap items-center gap-3">
              <Magnetic strength={0.18}>
                <a
                  href={SPOTIFY_PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-21-shine group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent hover:bg-[var(--accent-mid)] text-white text-sm font-medium transition-colors border border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                >
                  <span>Buka di Spotify</span>
                  <ExternalLink
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </Magnetic>

              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-[#D4D4D8] dark:border-[#3A3A44] bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1A1A1F] dark:hover:bg-[#23232A] text-zinc-900 dark:text-[#FAFAFA] transition-colors cursor-pointer"
                aria-label="Salin tautan playlist Daily Spotify"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.16 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-[#35C46A]" aria-hidden="true" />
                      <span>Tersalin</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.16 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      <span>Salin Link</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </GlowCard>

          {/* Right column: Embedded Spotify Playlist Player */}
          <GlowCard
            className="lg:col-span-7"
            contentClassName="p-3 sm:p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between px-2 pb-2.5">
              <span className="text-xs font-mono text-zinc-700 dark:text-[#C4C4CC]">
                open.spotify.com/playlist/0jLgldvuOTDVtHrH2M48QT
              </span>
              <a
                href={SPOTIFY_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-accent hover:underline inline-flex items-center gap-1"
              >
                Direct Link
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#D4D4D8] dark:border-[#3A3A44] bg-[#121212]">
              <iframe
                title="Daily Spotify Playlist"
                src={SPOTIFY_EMBED_URL}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block w-full border-0"
              />
            </div>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}
