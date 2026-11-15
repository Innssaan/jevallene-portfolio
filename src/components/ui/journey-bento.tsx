import { useState } from "react";
import { Briefcase, Camera, Code2, Cpu, Gamepad2, GraduationCap, Maximize2, Sparkles } from "lucide-react";
import { GlowCard, type GlowAccent } from "@/components/ui/glow-card";
import {
  DetailLightboxModal,
  type DetailLightboxItem,
} from "@/components/ui/detail-lightbox-modal";

interface JourneyItem {
  id: string;
  period: { id: string; en: string };
  title: { id: string; en: string };
  place: { id: string; en: string };
  description: { id: string; en: string };
  fullDescription: { id: string; en: string };
  highlights: { id: string[]; en: string[] };
  image: string;
  imageAlt: string;
  gradientFallback: string;
  accent: GlowAccent;
  active?: boolean;
  tags: string[];
  highlight: { id: string; en: string };
  icon: typeof Briefcase;
}

const JOURNEY_ITEMS: JourneyItem[] = [
  {
    id: "fullstack",
    period: { id: "2024 — Sekarang", en: "2024 — Present" },
    title: { id: "Fullstack Developer", en: "Fullstack Developer" },
    place: { id: "Perusahaan Teknologi", en: "Technology Company" },
    description: {
      id: "Mengembangkan aplikasi web end-to-end dari antarmuka UI, API backend, hingga integrasi basis data dan performa.",
      en: "Building end-to-end web applications from UI interfaces and backend APIs to database integration and performance.",
    },
    fullDescription: {
      id: "Berperan sebagai Fullstack Developer yang bertanggung jawab membangun aplikasi web berskala produksi secara menyeluruh—mulai dari antarmuka React & TypeScript, perancangan REST/WebSocket API di Node.js, pengelolaan skema PostgreSQL, hingga optimasi Core Web Vitals dan deployment.",
      en: "Serving as a Fullstack Developer responsible for building production-scale web applications end-to-end—spanning React & TypeScript interfaces, Node.js REST/WebSocket APIs, PostgreSQL schema design, Core Web Vitals optimization, and deployment.",
    },
    highlights: {
      id: [
        "Merancang antarmuka modular dan API backend yang terintegrasi rapi",
        "Mengelola skema basis data relasional, caching, dan keamanan akses",
        "Mengoptimalkan Core Web Vitals (LCP, CLS, INP) hingga skor hijau konsisten",
        "Kolaborasi lintas tim dengan TypeScript ketat dari frontend hingga backend",
      ],
      en: [
        "Built modular frontend interfaces paired with clean backend APIs",
        "Managed relational database schemas, caching, and access security",
        "Optimized Core Web Vitals (LCP, CLS, INP) to consistently green scores",
        "Cross-team collaboration with strict TypeScript across the full stack",
      ],
    },
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Ruang kerja pengembangan aplikasi Fullstack Developer",
    gradientFallback: "from-neutral-900 via-[#2a1015] to-black",
    accent: "indigo",
    active: true,
    tags: ["React & TypeScript", "Node.js & API", "PostgreSQL"],
    highlight: {
      id: "Fokus pada pengembangan aplikasi web end-to-end dari UI hingga backend.",
      en: "Focused on end-to-end web application development from UI to backend.",
    },
    icon: Code2,
  },
  {
    id: "freelance",
    period: { id: "2022 — 2024", en: "2022 — 2024" },
    title: {
      id: "Freelance Web Designer & Developer",
      en: "Freelance Web Designer & Developer",
    },
    place: { id: "Independen", en: "Independent" },
    description: {
      id: "Membantu UMKM dan kreator membangun website profil bisnis, landing page, serta portofolio digital.",
      en: "Helping SMEs and creators build company profiles, landing pages, and digital portfolios.",
    },
    fullDescription: {
      id: "Mengelola proyek independen dari tahap konsultasi kebutuhan klien, perancangan wireframe dan desain UI di Figma, hingga implementasi website siap pakai dan deployment. Pengalaman ini membentuk kemampuan menerjemahkan tujuan bisnis klien menjadi pengalaman web yang jelas, cepat, dan mudah dikelola.",
      en: "Managed independent client projects end-to-end from discovery consultations and Figma wireframing to full implementation and deployment. This honed the ability to translate business goals into clear, fast, and maintainable web experiences.",
    },
    highlights: {
      id: [
        "Merancang landing page dan profil bisnis dengan konversi tinggi",
        "Menyusun alur komunikasi langsung dari brief hingga serah terima",
        "Optimasi SEO dasar, kecepatan aset, dan tampilan responsif di semua layar",
        "Membangun fondasi identitas digital melalui studio personal Jevallene",
      ],
      en: [
        "Designed high-converting landing pages and business profiles",
        "Managed direct client communication from brief to final handoff",
        "Baseline SEO, asset optimization, and responsive layouts across screens",
        "Established the digital studio foundation under Jevallene",
      ],
    },
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Laptop dan workspace desain web independen",
    gradientFallback: "from-stone-900 via-[#241418] to-black",
    accent: "cyan",
    tags: ["Landing Page", "UI/UX", "Portofolio"],
    highlight: {
      id: "Mengubah kebutuhan bisnis menjadi website cepat dan mudah digunakan.",
      en: "Turning business needs into fast, intuitive websites.",
    },
    icon: Briefcase,
  },
  {
    id: "university",
    period: { id: "2022", en: "2022" },
    title: { id: "S1 Teknik Informatika", en: "B.Sc. in Informatics Engineering" },
    place: { id: "Universitas", en: "University" },
    description: {
      id: "Fokus pada rekayasa perangkat lunak, interaksi manusia-komputer, dan pengembangan aplikasi web.",
      en: "Focused on software engineering, human-computer interaction, and web application development.",
    },
    fullDescription: {
      id: "Menempuh pendidikan sarjana Teknik Informatika dengan pendalaman pada rekayasa perangkat lunak, interaksi manusia-komputer (HCI), basis data, dan pengembangan web modern. Aktif mengerjakan proyek kolaboratif serta mengeksplorasi bagaimana prinsip desain visual dapat berpadu mulus dengan rekayasa kode yang bersih.",
      en: "Completed an undergraduate degree in Informatics Engineering specializing in software engineering, human-computer interaction (HCI), databases, and modern web development. Actively built collaborative projects blending visual design principles with clean engineering.",
    },
    highlights: {
      id: [
        "Pendalaman rekayasa perangkat lunak, algoritma, dan struktur data",
        "Riset & praktik Interaksi Manusia-Komputer (HCI) dan usability",
        "Pengembangan berbagai proyek web full-stack dalam tim akademik",
        "Membangun kebiasaan dokumentasi teknis dan pemecahan masalah sistematis",
      ],
      en: [
        "Strong foundation in software engineering, algorithms, and data structures",
        "Research and practice in Human-Computer Interaction (HCI) & usability",
        "Built full-stack web projects in academic team environments",
        "Cultivated systematic debugging and technical documentation habits",
      ],
    },
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Lingkungan belajar dan pemrograman Teknik Informatika",
    gradientFallback: "from-zinc-900 via-[#1f1316] to-black",
    accent: "emerald",
    tags: ["Software Engineering", "HCI", "Web Dev"],
    highlight: {
      id: "Fondasi kuat di algoritma, struktur data, dan desain interaksi.",
      en: "Solid foundation in algorithms, data structures, and interaction design.",
    },
    icon: GraduationCap,
  },
  {
    id: "visual-creator",
    period: { id: "2018 — Sekarang", en: "2018 — Present" },
    title: { id: "Photographer & Videographer", en: "Photographer & Videographer" },
    place: { id: "Proyek Kreatif & Komersial", en: "Creative & Commercial Projects" },
    description: {
      id: "Menangani sesi fotografi potret, produk, dan event serta produksi video pendek sinematik lengkap dengan editing dan color grading.",
      en: "Handling portrait, product, and event photography alongside 4K cinematic short-form video production and color grading.",
    },
    fullDescription: {
      id: "Di luar dunia kode, saya aktif memproduksi karya visual berupa fotografi potret, produk komersial, dokumentasi acara, hingga video pendek sinematik. Kepekaan terhadap pencahayaan, komposisi frame, dan ritme storytelling visual turut memperkaya cara saya merancang antarmuka digital yang terasa hidup.",
      en: "Beyond code, I actively produce visual work spanning portrait photography, commercial product shoots, event coverage, and cinematic short-form videos. A keen eye for lighting, framing, and storytelling enriches how I craft living digital interfaces.",
    },
    highlights: {
      id: [
        "Pemotretan potret editorial, katalog produk, dan dokumentasi acara",
        "Produksi video pendek sinematik (Reels & TikTok) dari konsep hingga rilis",
        "Pengolahan warna (color grading) dan retouching foto profesional",
        "Menjaga konsistensi mood visual dan narasi cerita di setiap frame",
      ],
      en: [
        "Editorial portrait, product catalog, and event photography",
        "End-to-end cinematic Reels & TikTok production",
        "Professional color grading and photo retouching",
        "Consistent visual mood and narrative pacing in every frame",
      ],
    },
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Kamera dan produksi fotografi videografi kreatif",
    gradientFallback: "from-neutral-900 via-[#2c1512] to-black",
    accent: "amber",
    tags: ["Photography", "Videography", "Color Grading"],
    highlight: {
      id: "Menggabungkan komposisi visual, pencahayaan, dan storytelling sinematik.",
      en: "Combining visual composition, lighting, and cinematic storytelling.",
    },
    icon: Camera,
  },
  {
    id: "lua-game-dev",
    period: { id: "2021 — Sekarang", en: "2021 — Present" },
    title: { id: "Lua & Game Programming", en: "Lua & Game Programming" },
    place: { id: "Game Scripting & Systems", en: "Game Scripting & Systems" },
    description: {
      id: "Mengembangkan mekanik gameplay, sistem event client-server, dan skrip interaktif berbasis .lua / Luau.",
      en: "Developing gameplay mechanics, client-server event systems, and interactive scripts powered by .lua / Luau.",
    },
    fullDescription: {
      id: "Menguasai pemrograman game menggunakan bahasa .lua (termasuk Luau, FiveM scripting, dan LÖVE2D). Terbiasa merancang state machine gameplay, logika fisika & interaksi objek, optimasi loop frame-rate, serta sinkronisasi data antara client dan server secara real-time.",
      en: "Proficient in game programming with .lua (including Luau, FiveM scripting, and LÖVE2D). Experienced in designing gameplay state machines, object physics & interaction logic, frame-loop optimization, and real-time client-server state synchronization.",
    },
    highlights: {
      id: [
        "Scripting sistem gameplay, inventory, UI HUD, dan AI behavior berbasis .lua",
        "Sinkronisasi event client-server yang aman dari exploit dan rendah latensi",
        "Optimasi memory & tick loop agar gameplay tetap mulus di 60+ FPS",
        "Integrasi modular dengan resource game engine dan REST/database eksternal",
      ],
      en: [
        "Scripting gameplay systems, inventories, HUDs, and AI behaviors in .lua",
        "Low-latency, exploit-resistant client-server event synchronization",
        "Memory and tick-loop optimization for smooth 60+ FPS gameplay",
        "Modular integration with game engine resources and external REST/databases",
      ],
    },
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Pengembangan game dan scripting Lua",
    gradientFallback: "from-indigo-950 via-[#1b1636] to-black",
    accent: "indigo",
    tags: [".lua", "Luau", "Game Scripting"],
    highlight: {
      id: "Membangun logika gameplay dan skrip server-client real-time dengan .lua.",
      en: "Building real-time gameplay logic and client-server scripts with .lua.",
    },
    icon: Gamepad2,
  },
  {
    id: "iot-embedded",
    period: { id: "2022 — Sekarang", en: "2022 — Present" },
    title: { id: "IoT & Embedded Systems", en: "IoT & Embedded Systems" },
    place: { id: "Hardware, Sensor & Jaringan", en: "Hardware, Sensors & Networking" },
    description: {
      id: "Merancang sistem Internet of Things dengan C/C++ (Arduino, ESP32), MicroPython, protokol MQTT, dan integrasi sensor.",
      en: "Building Internet of Things systems with C/C++ (Arduino, ESP32), MicroPython, MQTT protocols, and sensor integration.",
    },
    fullDescription: {
      id: "Berpengalaman membangun proyek IoT dan sistem tertanam (embedded) menggunakan bahasa pemrograman C, C++ (Arduino/ESP-IDF), MicroPython, serta scripting pendukung seperti Python dan Node.js untuk gateway. Mencakup pembacaan sensor real-time, komunikasi MQTT/HTTP/WebSocket, kontrol aktuator, dan dashboard monitoring web.",
      en: "Experienced in building IoT and embedded projects using C, C++ (Arduino/ESP-IDF), MicroPython, and supporting gateway languages like Python and Node.js. Covers real-time sensor telemetry, MQTT/HTTP/WebSocket communication, actuator control, and live web monitoring dashboards.",
    },
    highlights: {
      id: [
        "Pemrograman mikrokontroler ESP32, ESP8266, dan Arduino dengan C/C++ & MicroPython",
        "Komunikasi data real-time melalui protokol MQTT, HTTP REST, dan WebSocket",
        "Kalibrasi & akuisisi data berbagai sensor lingkungan, relay, dan modul nirkabel",
        "Menghubungkan perangkat keras IoT langsung ke dashboard monitoring web",
      ],
      en: [
        "Programming ESP32, ESP8266, and Arduino microcontrollers in C/C++ & MicroPython",
        "Real-time telemetry over MQTT, HTTP REST, and WebSocket protocols",
        "Sensor calibration, relay control, and wireless hardware integration",
        "Connecting physical IoT hardware directly to live web monitoring dashboards",
      ],
    },
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Mikrokontroler, sirkuit elektronik, dan sistem IoT",
    gradientFallback: "from-emerald-950 via-[#0e2620] to-black",
    accent: "emerald",
    tags: ["C / C++", "MicroPython", "ESP32 & MQTT"],
    highlight: {
      id: "Integrasi mikrokontroler, sensor, dan protokol jaringan IoT ke web.",
      en: "Connecting microcontrollers, sensors, and IoT network protocols to the web.",
    },
    icon: Cpu,
  },
];

export default function JourneyBento({ lang = "id" }: { lang?: "id" | "en" }) {
  const [activeId, setActiveId] = useState<string>(JOURNEY_ITEMS[0].id);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const current = JOURNEY_ITEMS.find((item) => item.id === activeId) ?? JOURNEY_ITEMS[0];

  const modalItems: DetailLightboxItem[] = JOURNEY_ITEMS.map((item) => {
    const Icon = item.icon;
    return {
      id: item.id,
      eyebrow: item.period[lang],
      badge: item.active ? (lang === "en" ? "Current" : "Saat ini") : undefined,
      title: item.title[lang],
      subtitle: item.place[lang],
      image: item.image,
      imageAlt: item.imageAlt,
      gradientFallback: item.gradientFallback,
      visualIcon: <Icon />,
      description: item.fullDescription[lang],
      highlights: item.highlights[lang],
      tags: item.tags,
    };
  });

  return (
    <section className="section w-full px-4 sm:px-6 lg:px-8" id="pengalaman">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 max-w-2xl sm:mb-6">
          <p className="mb-2.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <span className="font-semibold text-accent">03</span>
            <span className="h-px w-6 bg-[#9A9AA2]/40" />
            {lang === "en" ? "Journey" : "Perjalanan"}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {lang === "en" ? "Experience & Education" : "Pengalaman & Pendidikan"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "en"
              ? "Career milestones, independent work, and the background shaping my craft."
              : "Perjalanan karier, proyek independen, dan latar belakang yang membentuk standar karya saya."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <GlowCard
                key={item.id}
                accent={item.accent}
                className="cursor-pointer"
                contentClassName="p-3.5 sm:p-4"
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={
                    lang === "en"
                      ? `View details and large image for ${item.title[lang]}`
                      : `Lihat detail dan gambar besar ${item.title[lang]}`
                  }
                  onClick={() => setSelectedIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedIndex(index);
                    }
                  }}
                  className="group flex h-full flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                      <Icon className="size-3.5 text-foreground/80" />
                      {item.period[lang]}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.active && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-300">
                          <span className="tb-pulse h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                          {lang === "en" ? "Current" : "Saat ini"}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors group-hover:border-accent/50 group-hover:text-foreground">
                        <Maximize2 className="size-2.5" />
                        Detail
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {item.title[lang]}
                  </h3>
                  <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                    {item.place[lang]}
                  </p>

                  <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description[lang]}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-2.5">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-accent">
                      {lang === "en" ? "Story →" : "Detail →"}
                    </span>
                  </div>
                </div>
              </GlowCard>
            );
          })}

          <GlowCard accent="amber" className="sm:col-span-2 lg:col-span-4" contentClassName="p-3.5 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <Sparkles className="size-3.5 text-foreground" />
                {lang === "en" ? "Journey Phase Summary" : "Ringkasan Fase Perjalanan"}
              </h3>
              <span className="text-[11px] text-muted-foreground">
                {lang === "en"
                  ? "Select a phase to see its main focus"
                  : "Pilih fase untuk melihat fokus utama"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {JOURNEY_ITEMS.map((item) => {
                const on = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    onMouseEnter={() => setActiveId(item.id)}
                    className={`flex cursor-pointer flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      on
                        ? "border-accent bg-accent text-white shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
                        : "border-[#D4D4D8] bg-white text-neutral-950 hover:border-accent/60 dark:border-[#3A3A44] dark:bg-[#1A1A1F] dark:text-[#FAFAFA] dark:hover:border-accent/70"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-medium ${
                        on ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      {item.period[lang]}
                    </span>
                    <span className="line-clamp-1 text-xs font-semibold sm:text-sm">{item.title[lang]}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-3 min-h-[18px] text-xs text-muted-foreground sm:text-sm" aria-live="polite">
              <span key={`${current.id}-${lang}`} className="tb-fade">
                <strong className="font-medium text-foreground">
                  {current.title[lang]}:
                </strong>{" "}
                {current.highlight[lang]}
              </span>
            </p>
          </GlowCard>
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
