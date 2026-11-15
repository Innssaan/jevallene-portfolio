import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, FolderGit2, Layers, Maximize2, Sparkles } from "lucide-react";
import { GlowCard, type GlowAccent } from "@/components/ui/glow-card";
import {
  DetailLightboxModal,
  type DetailLightboxItem,
} from "@/components/ui/detail-lightbox-modal";

export type ProjectCategory = "all" | "web" | "design" | "tools" | "visual";

export interface ProjectItem {
  id: string;
  category: Exclude<ProjectCategory, "all">;
  categoryLabel: { id: string; en: string };
  image: string;
  images?: string[];
  imageAlt: string;
  gradientFallback: string;
  title: string;
  description: { id: string; en: string };
  fullDescription: { id: string; en: string };
  highlights: { id: string[]; en: string[] };
  tags: string[];
  accent: GlowAccent;
  featured?: boolean;
  metrics?: string;
  links: Array<{ label: { id: string; en: string }; href: string }>;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "olu-dashboard",
    category: "web",
    categoryLabel: { id: "Web App", en: "Web App" },
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Pratinjau dashboard analitik dan manajemen tugas OLU — Our Little Universe",
    gradientFallback: "from-indigo-500 via-violet-500 to-fuchsia-500",
    title: "OLU Dashboard · Our Little Universe",
    description: {
      id: "Manajemen tugas tim dengan drag-and-drop, filter cepat, dan mode gelap.",
      en: "Team task management with drag-and-drop, quick filters, and dark mode.",
    },
    fullDescription: {
      id: "OLU Dashboard (Our Little Universe) dirancang untuk tim produk dan pengembang yang membutuhkan alur kerja kanban yang ringan namun responsif. Antarmukanya memadukan papan tugas interaktif drag-and-drop, filter status dan prioritas secara real-time, ringkasan analitik progres mingguan, serta mode gelap kontras tinggi yang nyaman dipakai berjam-jam.",
      en: "OLU Dashboard (Our Little Universe) is built for product teams and developers who need a lightweight yet responsive kanban workflow. It combines interactive drag-and-drop task boards, real-time status and priority filters, weekly progress analytics, and a high-contrast dark mode designed for long sessions.",
    },
    highlights: {
      id: [
        "Drag-and-drop antar kolom status dengan animasi transisi mulus",
        "Filter instan berdasarkan prioritas, label, dan tenggat waktu",
        "Skor Lighthouse 99 dengan rendering komponen yang dioptimalkan",
        "Desain responsif penuh untuk desktop, tablet, dan perangkat mobile",
      ],
      en: [
        "Smooth drag-and-drop across status columns",
        "Instant filtering by priority, label, and due date",
        "99 Lighthouse score with optimized component rendering",
        "Fully responsive layout for desktop, tablet, and mobile",
      ],
    },
    tags: ["React", "TypeScript", "CSS"],
    accent: "indigo",
    featured: true,
    metrics: "99 Lighthouse",
    links: [
      { label: { id: "Demo", en: "Demo" }, href: "https://github.com/Innssaan?tab=repositories" },
      { label: { id: "GitHub", en: "GitHub" }, href: "https://github.com/Innssaan" },
    ],
  },
  {
    id: "kokop",
    category: "design",
    categoryLabel: { id: "UI/UX Design", en: "UI/UX Design" },
    image: "/projects/kokop.jpg",
    imageAlt: "Tampilan UI/UX e-commerce kopi spesialti KoKoP — Kopi Kopi Online Pas",
    gradientFallback: "from-amber-500 via-orange-500 to-rose-500",
    title: "KoKoP — Kopi Kopi Online Pas",
    description: {
      id: "Desain toko online kopi nusantara dengan storytelling produk & checkout cepat.",
      en: "Indonesian specialty coffee storefront UI focused on storytelling & fast checkout.",
    },
    fullDescription: {
      id: "KoKoP (Kopi Kopi Online Pas) adalah eksplorasi UI/UX untuk brand kopi spesialti lokal yang ingin menonjolkan asal-usul biji kopi (single origin) dari berbagai daerah di Indonesia. Fokus utamanya adalah pengalaman eksplorasi profil rasa yang intuitif, halaman detail produk editorial, dan alur checkout ringkas dalam tiga langkah.",
      en: "KoKoP (Kopi Kopi Online Pas) is a UI/UX exploration for a local specialty coffee brand highlighting single-origin beans across Indonesia. It centers on intuitive flavor profile discovery, editorial product pages, and a streamlined three-step checkout flow.",
    },
    highlights: {
      id: [
        "Design system lengkap dengan token tipografi, warna, dan komponen UI",
        "Kartu profil rasa (acidity, body, roast level) yang mudah dipahami",
        "Alur keranjang & checkout mobile-first yang memangkas friksi pengguna",
        "Prototipe interaktif di Figma siap untuk uji kegunaan (usability testing)",
      ],
      en: [
        "Complete design system with typography, color, and UI component tokens",
        "Clear flavor profile cards (acidity, body, roast level)",
        "Mobile-first cart and checkout flow reducing user friction",
        "Interactive Figma prototype ready for usability testing",
      ],
    },
    tags: ["Figma", "Design System"],
    accent: "cyan",
    metrics: "Mobile First",
    links: [{ label: { id: "Studi Kasus", en: "Case Study" }, href: "#kontak" }],
  },
  {
    id: "markdown-studio",
    category: "tools",
    categoryLabel: { id: "Tools", en: "Tools" },
    image: "/projects/markdown-studio.jpg",
    imageAlt: "Tampilan showcase editor berwarna untuk Markdown Note Studio",
    gradientFallback: "from-emerald-500 via-teal-500 to-cyan-500",
    title: "Markdown Note Studio",
    description: {
      id: "Editor catatan ringan berbasis browser dengan live preview & ekspor instan.",
      en: "Lightweight browser note editor with live preview & instant PDF/HTML export.",
    },
    fullDescription: {
      id: "Markdown Note Studio dibangun sebagai utilitas menulis bebas distraksi yang berjalan langsung di browser tanpa perlu akun atau server tambahan. Setiap perubahan tersimpan otomatis ke LocalStorage dengan dukungan split-screen live preview, shortcut keyboard, serta ekspor sekali klik ke format HTML maupun PDF siap cetak.",
      en: "Markdown Note Studio is a distraction-free writing utility running directly in the browser with no account or backend required. Changes auto-save to LocalStorage with split-screen live preview, keyboard shortcuts, and one-click HTML or print-ready PDF export.",
    },
    highlights: {
      id: [
        "Split-view editor & live preview tersinkronisasi secara real-time",
        "Penyimpanan otomatis offline-ready menggunakan LocalStorage",
        "Ekspor instan ke dokumen HTML bersih dan PDF siap bagikan",
        "Dukungan syntax highlighting blok kode dan tabel Markdown",
      ],
      en: [
        "Real-time synchronized split-view editor & live preview",
        "Offline-ready auto-save powered by LocalStorage",
        "Instant export to clean HTML and shareable PDF documents",
        "Syntax highlighting for code blocks and Markdown tables",
      ],
    },
    tags: ["JavaScript", "LocalStorage"],
    accent: "emerald",
    metrics: "Offline Ready",
    links: [
      { label: { id: "Demo", en: "Demo" }, href: "https://github.com/Innssaan?tab=repositories" },
      { label: { id: "GitHub", en: "GitHub" }, href: "https://github.com/Innssaan" },
    ],
  },
  {
    id: "sannverse-visual-stories",
    category: "visual",
    categoryLabel: { id: "Foto & Video", en: "Photo & Video" },
    image: "/projects/sannverse-1.jpg",
    images: [
      "/projects/sannverse-1.jpg",
      "/projects/sannverse-2.jpg",
      "/projects/sannverse-3.jpg",
      "/projects/sannverse-4.jpg",
      "/projects/sannverse-5.jpg",
    ],
    imageAlt: "Produksi fotografi dan videografi sinematik Sannverse Visual Stories",
    gradientFallback: "from-rose-500 via-fuchsia-500 to-indigo-500",
    title: "Sannverse Visual Stories",
    description: {
      id: "Serial fotografi editorial & video reels sinematik untuk brand lokal dan acara.",
      en: "Editorial photography & 4K cinematic reels for local brands and events.",
    },
    fullDescription: {
      id: "Sannverse Visual Stories merangkum karya produksi visual mulai dari pemotretan editorial potret dan produk hingga video pendek vertikal berirama sinematik. Setiap proyek digarap menyeluruh dari tahap konsep visual, pengarahan cahaya di lokasi, pengambilan gambar 4K, hingga penyuntingan dan color grading.",
      en: "Sannverse Visual Stories brings together visual production spanning editorial portraits, product shoots, and cinematic vertical short-form videos. Each project covers visual direction, on-set lighting, 4K capture, editing, and color grading.",
    },
    highlights: {
      id: [
        "Produksi foto editorial, katalog produk, dan dokumentasi event",
        "Video pendek vertikal (Reels & TikTok) dengan pacing dinamis",
        "Color grading sinematik konsisten menyesuaikan karakter brand",
        "Alur kerja cepat dari shooting hingga materi siap publikasi",
      ],
      en: [
        "Editorial portrait, product catalog, and event photography",
        "Dynamic vertical short-form video (Reels & TikTok)",
        "Consistent cinematic color grading tailored to brand identity",
        "Fast turnaround from shoot day to publish-ready assets",
      ],
    },
    tags: ["Photography", "Videography", "Color Grading"],
    accent: "amber",
    metrics: "4K Cinematic",
    links: [
      { label: { id: "Instagram", en: "Instagram" }, href: "https://www.instagram.com/innssaan_/" },
      { label: { id: "TikTok", en: "TikTok" }, href: "https://www.tiktok.com/@sannveerse" },
    ],
  },
];

const TECH_LABELS: Record<string, string[]> = {
  react: ["React"],
  next: ["React", "Next.js"],
  ts: ["TypeScript"],
  tailwind: ["CSS", "Tailwind"],
  node: ["Node.js"],
  postgres: ["Postgres"],
  redis: ["Redis"],
  docker: ["Docker"],
};

const FILTER_TABS: Array<{ id: ProjectCategory; label: { id: string; en: string } }> = [
  { id: "all", label: { id: "Semua", en: "All" } },
  { id: "web", label: { id: "Web App", en: "Web App" } },
  { id: "design", label: { id: "UI/UX Design", en: "UI/UX Design" } },
  { id: "tools", label: { id: "Tools", en: "Tools" } },
  { id: "visual", label: { id: "Foto & Video", en: "Photo & Video" } },
];

export interface ProjectsBentoProps {
  filter: ProjectCategory;
  onFilterChange: (category: ProjectCategory) => void;
  selectedTech: string | null;
  onSelectTech: (techId: string | null) => void;
  lang?: "id" | "en";
}

export default function ProjectsBento({
  filter,
  onFilterChange,
  selectedTech,
  onSelectTech,
  lang = "id",
}: ProjectsBentoProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredProjects =
    filter === "all"
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === filter);

  const matchTags = selectedTech ? TECH_LABELS[selectedTech] ?? [] : [];

  const modalItems: DetailLightboxItem[] = filteredProjects.map((project) => ({
    id: project.id,
    eyebrow: project.categoryLabel[lang],
    badge: project.featured ? (lang === "en" ? "Featured" : "Unggulan") : undefined,
    title: project.title,
    subtitle: project.metrics,
    image: project.image,
    images: project.images,
    imageAlt: project.imageAlt,
    gradientFallback: project.gradientFallback,
    description: project.fullDescription[lang],
    highlights: project.highlights[lang],
    tags: project.tags,
    links: project.links.map((l) => ({ label: l.label[lang], href: l.href })),
  }));

  return (
    <section className="section section-alt w-full px-4 sm:px-6 lg:px-8" id="proyek">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <span className="font-semibold text-accent">02</span>
              <span className="h-px w-6 bg-[#9A9AA2]/40" />
              {lang === "en" ? "Portfolio" : "Portofolio"}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {lang === "en" ? "Selected Projects" : "Proyek Pilihan"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {lang === "en"
                ? "Selected work across web apps, UI/UX design, interactive tools, and photo & video production."
                : "Pilihan karya web app, desain UI/UX, tools interaktif, hingga produksi foto & video."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedTech && (
              <button
                type="button"
                onClick={() => onSelectTech(null)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-accent bg-accent px-3 py-1 text-xs font-medium text-white shadow-[0_0_20px_rgba(var(--accent-rgb),0.35)] transition-all hover:bg-accent-hover"
              >
                <Sparkles className="size-3.5" />
                Sync: {selectedTech} ×
              </button>
            )}
          </div>
        </div>

        <div
          className="mb-6 flex flex-wrap gap-2"
          role="tablist"
          aria-label={lang === "en" ? "Filter project category" : "Filter kategori proyek"}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className={`filter-btn btn-21-shine relative overflow-hidden !px-3.5 !py-1.5 !text-xs ${isActive ? "active" : ""}`}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setSelectedIndex(null);
                  onFilterChange(tab.id);
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="project-filter-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 -z-0 bg-accent"
                  />
                )}
                <span className="relative z-10">{tab.label[lang]}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProjects.map((project, idx) => {
            const isMatched =
              selectedTech !== null &&
              project.tags.some((tag) => matchTags.includes(tag));

            return (
              <GlowCard
                key={project.id}
                accent={isMatched ? "amber" : project.accent}
                className={`cursor-pointer transition-all duration-300 ${
                  isMatched
                    ? "ring-2 ring-accent shadow-[0_0_28px_rgba(var(--accent-rgb),0.2)] -translate-y-0.5"
                    : selectedTech
                      ? "opacity-60"
                      : ""
                }`}
                contentClassName="p-0 overflow-hidden rounded-2xl"
              >
                <article
                  role="button"
                  tabIndex={0}
                  aria-label={
                    lang === "en"
                      ? `View details and large image for ${project.title}`
                      : `Lihat detail dan gambar besar ${project.title}`
                  }
                  onClick={() => setSelectedIndex(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedIndex(idx);
                    }
                  }}
                  className="group flex h-full flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div
                    className={`relative flex h-28 items-end overflow-hidden border-b border-white/20 bg-gradient-to-br ${project.gradientFallback} p-2.5 sm:h-32 dark:border-white/10`}
                  >
                    <img
                      src={project.image}
                      alt={project.imageAlt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
                    />
                    <span className="absolute right-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
                      <Maximize2 className="size-2.5" />
                      {lang === "en" ? "Expand" : "Perbesar"}
                    </span>
                    <span className="relative z-10 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                      <Layers className="size-2.5 text-accent" />
                      {project.categoryLabel[lang]}
                    </span>
                    {project.featured && (
                      <span className="relative z-10 ml-auto inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                        <span className="tb-pulse h-1.5 w-1.5 rounded-full bg-[#35C46A]" />
                        {lang === "en" ? "Featured" : "Unggulan"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3 sm:p-3.5">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <h3 className="truncate text-base font-semibold tracking-tight text-foreground">
                        {project.title}
                      </h3>
                      {project.metrics && (
                        <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                          {project.metrics}
                        </span>
                      )}
                    </div>

                    <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {project.description[lang]}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => {
                        const tagMatched = matchTags.includes(tag);
                        return (
                          <span
                            key={tag}
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                              tagMatched
                                ? "border-accent bg-accent text-white"
                                : "border-border bg-white/70 text-muted-foreground dark:border-[#26262B] dark:bg-[#1A1A1F]"
                            }`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-2.5">
                      {project.links.map((link) => {
                        const isExternal = link.href.startsWith("http");
                        const label = link.label[lang];
                        return (
                          <motion.a
                            key={label}
                            href={link.href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                            onClick={(e) => e.stopPropagation()}
                            whileHover={{ x: 1, y: -1, scale: 1.04 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 420, damping: 22 }}
                            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-semibold text-foreground transition-colors hover:border-accent/60 hover:bg-accent/15 hover:text-white"
                          >
                            {label === "GitHub" ? (
                              <FolderGit2 className="size-3" />
                            ) : (
                              <ArrowUpRight className="size-3" />
                            )}
                            {label}
                          </motion.a>
                        );
                      })}
                      <span className="ml-auto text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-accent">
                        {lang === "en" ? "Details →" : "Detail →"}
                      </span>
                    </div>
                  </div>
                </article>
              </GlowCard>
            );
          })}
        </div>
      </div>

      <DetailLightboxModal
        items={modalItems}
        activeIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onChangeIndex={setSelectedIndex}
        lang={lang}
      />
    </section>
  );
}
