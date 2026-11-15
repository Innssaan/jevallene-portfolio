import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Mail, MapPin, Star } from "lucide-react";
import { DiscordIcon } from "@/components/ui/social-icons";

const CHECKLIST_ITEMS = [
  "Balasan cepat maksimal 1x24 jam di hari kerja",
  "Diskusi ruang lingkup, desain, dan estimasi waktu yang jelas",
  "Kode TypeScript & React yang rapi, cepat, dan mudah dikembangkan",
  "Optimasi performa & Core Web Vitals siap rilis",
];

const TOPIC_OPTIONS = [
  "Web App",
  "UI/UX Design",
  "Design System",
  "Landing Page",
  "Photography",
  "Videography",
  "Konsultasi",
];

const REVIEWERS = [
  {
    initials: "AR",
    name: "Andi Pratama",
    role: "Product Lead, FinTech ID",
    quote:
      "Komunikasi rapi, eksekusi cepat, dan komponen UI-nya langsung siap dipakai tim engineering kami.",
  },
  {
    initials: "SR",
    name: "Sinta Rahma",
    role: "Founder, KopiLokal",
    quote:
      "Tampilan toko online jadi jauh lebih ringan dan alur checkout meningkat signifikan.",
  },
  {
    initials: "BW",
    name: "Bima Wijaya",
    role: "Engineering Manager",
    quote:
      "Struktur kodenya bersih, konsisten, dan sangat memperhatikan detail aksesibilitas.",
  },
];

export interface ContactSectionProps {
  formStatus: {
    message: string;
    type: "success" | "error" | "";
  };
  isSubmitting?: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function ContactSection({
  formStatus,
  isSubmitting = false,
  onSubmit,
}: ContactSectionProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["Web App"]);
  const [activeReviewer, setActiveReviewer] = useState(0);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic]
    );
  };

  const reviewer = REVIEWERS[activeReviewer];

  return (
    <section
      className="w-full py-6 px-4 sm:py-8 sm:px-6 lg:py-10 lg:px-8"
      id="kontak"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8">
          {/* Left column: Intro, checklist, reviewers, direct contact */}
          <div className="flex flex-col justify-between gap-5 lg:col-span-5">
            <div>
              <p className="mb-2.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                <span className="font-semibold text-accent">04</span>
                <span className="h-px w-6 bg-[#9A9AA2]/40" />
                Kontak
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
                Punya proyek menarik? Mari diskusi.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
                Butuh website modern, desain UI/UX, atau produksi foto &amp; video untuk
                brand Anda? Kirimkan detailnya lewat formulir di samping.
              </p>

              <ul className="mt-6 space-y-3" aria-label="Yang akan Anda dapatkan">
                {CHECKLIST_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                      <Check className="size-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {/* Reviewers social proof card */}
              <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/65 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/70 dark:border-white/[0.12] dark:bg-[#121218]/55 dark:shadow-[0_16px_42px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] dark:hover:border-accent/75">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 bottom-0 h-[2px] origin-center scale-x-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-x-100"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center -space-x-2">
                    {REVIEWERS.map((rev, idx) => (
                      <button
                        key={rev.name}
                        type="button"
                        onClick={() => setActiveReviewer(idx)}
                        aria-label={`Lihat ulasan ${rev.name}`}
                        className={`flex size-9 cursor-pointer items-center justify-center rounded-full border-2 text-xs font-semibold transition-transform ${idx === activeReviewer
                          ? "z-10 scale-105 border-accent bg-accent text-white"
                          : "border-white bg-neutral-200 text-neutral-700 hover:z-10 dark:border-[#111114] dark:bg-[#1A1A1F] dark:text-[#9A9AA2]"
                          }`}
                      >
                        {rev.initials}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1" aria-label="Rating 5 dari 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-accent text-accent"
                      />
                    ))}
                    <span className="ml-1.5 text-xs font-medium text-neutral-600 dark:text-[#9A9AA2] tnum">
                      5.0 · 10+ Klien
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  &ldquo;{reviewer.quote}&rdquo;
                </p>
                <p className="mt-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {reviewer.name} — {reviewer.role}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <a
                  href="mailto:rifkitv21@gmail.com"
                  className="inline-flex items-center gap-1.5 font-medium text-neutral-900 transition-opacity hover:opacity-70 dark:text-neutral-100"
                >
                  <Mail className="size-3.5" />
                  rifkitv21@gmail.com
                </a>
                <a
                  href="https://discord.gg/yQnaVA475"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-neutral-900 transition-colors hover:text-[#5865F2] dark:text-neutral-100 dark:hover:text-[#7289DA]"
                >
                  <DiscordIcon className="size-3.5 text-[#5865F2]" />
                  Discord Server
                </a>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  Jakarta, Indonesia
                </span>
              </div>
            </div>
          </div>

          {/* Right column: Split Form */}
          <div className="lg:col-span-7">
            <form
              className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/65 p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-200 hover:border-accent/70 sm:p-8 dark:border-white/[0.12] dark:bg-[#121218]/55 dark:shadow-[0_16px_42px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] dark:hover:border-accent/75"
              id="contactForm"
              noValidate
              onSubmit={onSubmit}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 bottom-0 h-[2px] origin-center scale-x-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-x-100"
              />
              <div className="mb-6">
                <span className="block text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-[#9A9AA2]">
                  Topik Kebutuhan
                </span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {TOPIC_OPTIONS.map((topic) => {
                    const active = selectedTopics.includes(topic);
                    return (
                      <motion.button
                        key={topic}
                        type="button"
                        whileHover={{ y: -2, scale: 1.03 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 400, damping: 24 }}
                        aria-pressed={active}
                        onClick={() => toggleTopic(topic)}
                        className={`btn-21-shine inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${active
                          ? "border-accent bg-accent text-white shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
                          : "border-black/10 bg-white/65 backdrop-blur-md text-neutral-700 hover:border-accent hover:bg-accent hover:text-[#08080A] dark:border-white/[0.12] dark:bg-[#14141A]/55 dark:text-[#C4C4CC] dark:hover:border-accent dark:hover:bg-accent dark:hover:text-[#08080A]"
                          }`}
                      >
                        {active && <Check className="size-3" />}
                        {topic}
                      </motion.button>
                    );
                  })}
                </div>
                <input
                  type="hidden"
                  name="topics"
                  value={selectedTopics.join(", ")}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Masukkan nama lengkap Anda"
                    required
                    className="w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-3.5 py-2.5 text-sm text-[#FAFAFA] backdrop-blur-md transition-colors placeholder:text-[#9A9AA2] focus:border-accent focus:bg-white/[0.07] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="nama@perusahaan.com"
                    required
                    className="w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-3.5 py-2.5 text-sm text-[#FAFAFA] backdrop-blur-md transition-colors placeholder:text-[#9A9AA2] focus:border-accent focus:bg-white/[0.07] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Detail Proyek / Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Ceritakan ruang lingkup proyek, target waktu, atau pertanyaan Anda..."
                  required
                  className="w-full resize-y rounded-xl border border-white/[0.12] bg-white/[0.04] px-3.5 py-2.5 text-sm text-[#FAFAFA] backdrop-blur-md transition-colors placeholder:text-[#9A9AA2] focus:border-accent focus:bg-white/[0.07] focus:outline-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={isSubmitting ? undefined : { y: -1 }}
                whileTap={isSubmitting ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className="btn-21-shine group mt-5 inline-flex w-full cursor-pointer items-center justify-between rounded-full bg-gradient-to-r from-accent to-[var(--accent-dark)] py-2 pl-6 pr-2 text-sm font-semibold text-white shadow-[0_0_40px_rgba(var(--accent-rgb),0.35)] transition-all hover:from-accent-hover hover:to-accent hover:shadow-[0_0_60px_rgba(var(--accent-rgb),0.55)] disabled:cursor-wait disabled:opacity-70"
              >
                <span>{isSubmitting ? "Mengirim..." : "Kirim Pesan"}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-all group-hover:bg-white/25 group-hover:rotate-12">
                  <ArrowUpRight className="size-4" />
                </span>
              </motion.button>

              {formStatus.message && (
                <p
                  className={`mt-3 text-xs font-medium ${formStatus.type === "error"
                    ? "text-red-600 dark:text-red-400"
                    : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  id="formStatus"
                  role="status"
                  aria-live="polite"
                >
                  {formStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
