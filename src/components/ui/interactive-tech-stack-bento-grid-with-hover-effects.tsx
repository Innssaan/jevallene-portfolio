// This is file of your component
// You can use any dependencies from npm; we import them automatically in package.json

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { GlowCard } from "@/components/ui/glow-card";
import {
  DetailLightboxModal,
  type DetailLightboxItem,
} from "@/components/ui/detail-lightbox-modal";

/* ==========================================================================
   Types
   ========================================================================== */

type LineType = "cmd" | "ok" | "info" | "url";

interface Tech {
  id: string;
  name: string;
  version: string;
  category: string;
  desc: string;
  fullDesc: string;
  highlights: string[];
  tags: string[];
  image: string;
  rgb: string; // "r, g, b" so we can use it inside rgba()
  icon: ReactNode;
}

interface TermLine {
  type: LineType;
  text: string;
}

// end of types


/* ==========================================================================
   Constants
   ========================================================================== */

const SERIES_LENGTH = 24; // points in the live latency chart
const TICK_MS = 2500; // how often the live server probe runs
const GITHUB_REPO = "Innssaan/jevallene-portfolio";
const PROD_URL = "https://innssaan.my.id";

const TERM_VISIBLE = 11; // lines shown at once
const LINE_STYLES: Record<LineType, { mark: string; markClass: string; textClass: string }> = {
  cmd: { mark: "$", markClass: "text-fuchsia-300", textClass: "text-slate-100" },
  ok: { mark: "✓", markClass: "text-emerald-300", textClass: "text-slate-300" },
  info: { mark: "›", markClass: "text-slate-500", textClass: "text-slate-400" },
  url: { mark: "●", markClass: "text-cyan-300", textClass: "text-cyan-300 underline underline-offset-2" },
};

// end of constants


/* ==========================================================================
   Helpers
   ========================================================================== */

// Join class names, skipping anything falsy
function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

// Counts smoothly from the current number to a new one whenever the target changes
function useAnimatedNumber(target: number, duration = 700): number {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = target;
      setValue(target);
      return;
    }

    const from = current.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      current.current = from + (target - from) * eased;
      setValue(current.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function getNavigationTiming(): PerformanceNavigationTiming | null {
  if (typeof performance === "undefined") return null;
  const entries = performance.getEntriesByType("navigation");
  return (entries[0] as PerformanceNavigationTiming | undefined) ?? null;
}

function getNavigationTTFB(): number {
  const nav = getNavigationTiming();
  if (!nav) return 0;
  return Math.max(1, Math.round(nav.responseStart - nav.requestStart));
}

async function probeEndpoint(
  url: string,
  init?: RequestInit
): Promise<{ ms: number; status: number; vercelId: string | null; vercelCache: string | null } | null> {
  const start = performance.now();
  try {
    const res = await fetch(url, { cache: "no-store", ...init });
    const ms = Math.max(1, Math.round(performance.now() - start));
    return {
      ms,
      status: res.status,
      vercelId: res.headers.get("x-vercel-id"),
      vercelCache: res.headers.get("x-vercel-cache"),
    };
  } catch {
    return null;
  }
}

// Smooth line through chart points
function toSmoothPath(points: Array<{ x: number; y: number }>): string {
  return points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const mid = (prev.x + p.x) / 2;
    return `${d} C ${mid} ${prev.y}, ${mid} ${p.y}, ${p.x} ${p.y}`;
  }, "");
}

const statusOf = (ms: number) =>
  ms < 60
    ? { dot: "bg-emerald-500 dark:bg-emerald-400", text: "text-emerald-600 dark:text-emerald-300" }
    : ms < 100
    ? { dot: "bg-amber-500 dark:bg-amber-400", text: "text-amber-600 dark:text-amber-300" }
    : { dot: "bg-rose-500 dark:bg-rose-400", text: "text-rose-600 dark:text-rose-300" };

// end of helpers


/* ==========================================================================
   Inline SVG: framework and tool icons (simple original marks)
   ========================================================================== */

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const TECHS: Tech[] = [
  {
    id: "react",
    name: "React",
    version: "19",
    category: "Frontend Library",
    desc: "React 19 · Component-driven user interfaces",
    fullDesc:
      "React 19 menjadi fondasi utama dalam membangun antarmuka interaktif berbasis komponen yang terstruktur dan mudah dirawat. Dengan dukungan concurrent rendering, custom hooks, dan transisi state yang halus, setiap bagian UI dapat merespons interaksi pengguna secara instan.",
    highlights: [
      "Arsitektur komponen reusable dengan komposisi yang bersih",
      "Optimasi render dan memoization untuk menjaga frame rate 60fps",
      "Integrasi mulus dengan Motion dan ekosistem UI modern",
      "State management terprediksi untuk alur aplikasi kompleks",
    ],
    tags: ["UI Components", "Hooks", "Concurrent UI"],
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    rgb: "97, 218, 251",
    icon: (
      <Icon>
        <ellipse cx="16" cy="16" rx="12" ry="4.6" />
        <ellipse cx="16" cy="16" rx="12" ry="4.6" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="12" ry="4.6" transform="rotate(120 16 16)" />
        <circle cx="16" cy="16" r="1.8" fill="currentColor" />
      </Icon>
    ),
  },
  {
    id: "next",
    name: "Next.js",
    version: "15",
    category: "Full-Stack Framework",
    desc: "Next.js 15 · Routing, rendering and server actions",
    fullDesc:
      "Next.js 15 digunakan untuk proyek web yang membutuhkan kombinasi performa tinggi, SEO optimal, dan arsitektur App Router. Mendukung Server Components, streaming SSR, dan optimasi aset otomatis sehingga halaman siap tampil seketika.",
    highlights: [
      "App Router dengan nested layout dan loading boundary otomatis",
      "Server-Side Rendering & Static Generation untuk skor SEO maksimal",
      "Optimasi gambar, font, dan code-splitting bawaan",
      "API routes & Server Actions terintegrasi dalam satu repositori",
    ],
    tags: ["App Router", "SSR / SSG", "SEO"],
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    rgb: "226, 232, 240",
    icon: (
      <Icon>
        <circle cx="16" cy="16" r="12" />
        <path d="M12 21V11l9 11" />
        <path d="M20.5 11v6" />
      </Icon>
    ),
  },
  {
    id: "ts",
    name: "TypeScript",
    version: "5.6",
    category: "Programming Language",
    desc: "TypeScript 5.6 · Typed code from the database to the UI",
    fullDesc:
      "TypeScript menjaga keandalan kode dari lapisan data hingga komponen tampilan. Dengan sistem tipe statis yang ketat, potensi bug dapat ditangkap sejak waktu kompilasi, mempercepat refactoring, dan membuat kontrak antar modul selalu jelas.",
    highlights: [
      "Type-safety menyeluruh dari skema API hingga props komponen",
      "Autocomplete akurat dan dokumentasi kontrak data otomatis",
      "Refactoring skala besar yang aman tanpa merusak fitur lain",
      "Strict mode aktif untuk mencegah null/undefined error di produksi",
    ],
    tags: ["Static Typing", "Type Safety", "DX"],
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    rgb: "96, 165, 250",
    icon: (
      <Icon>
        <rect x="4" y="4" width="24" height="24" rx="5" />
        <path d="M10 13h8M14 13v10" />
        <path d="M24 14.5c-.8-1-2-1.3-3-1-1.7.5-1.6 2.5.2 3.1l1.6.6c1.8.7 1.6 2.9-.2 3.3-1.2.3-2.4-.1-3.2-1.2" />
      </Icon>
    ),
  },
  {
    id: "tailwind",
    name: "Tailwind",
    version: "3.4",
    category: "Styling & Design Tokens",
    desc: "Tailwind 3.4 · Utility-first styling and design tokens",
    fullDesc:
      "Tailwind CSS memungkinkan perancangan antarmuka presisi dengan kecepatan iterasi tinggi. Dipadukan dengan CSS variables untuk tema gelap/terang, sistem spacing yang konsisten, serta ukuran bundle CSS produksi yang sangat ramping.",
    highlights: [
      "Konsistensi visual lewat design tokens untuk warna, radius, dan tipografi",
      "Dukungan tema gelap dan terang yang adaptif di seluruh komponen",
      "Desain responsif presisi dari layar ponsel hingga monitor ultra-wide",
      "Bundle CSS produksi minimal karena purge kelas otomatis",
    ],
    tags: ["Design Tokens", "Responsive UI", "Dark Mode"],
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    rgb: "56, 189, 248",
    icon: (
      <Icon>
        <path d="M5 11c2-4 5-6 9-5 2.2.6 3.2 2.2 5 3.5 2 1.4 4.3 1.5 8-.5-2 4-5 6-9 5-2.2-.6-3.2-2.2-5-3.5-2-1.4-4.3-1.5-8 .5Z" />
        <path d="M5 20c2-4 5-6 9-5 2.2.6 3.2 2.2 5 3.5 2 1.4 4.3 1.5 8-.5-2 4-5 6-9 5-2.2-.6-3.2-2.2-5-3.5-2-1.4-4.3-1.5-8 .5Z" />
      </Icon>
    ),
  },
  {
    id: "node",
    name: "Node.js",
    version: "22",
    category: "Backend Runtime",
    desc: "Node.js 22 · API routes, workers and background jobs",
    fullDesc:
      "Node.js 22 menjadi tulang punggung layanan backend, REST/WebSocket API, serta pemrosesan tugas latar belakang. Arsitektur non-blocking I/O memungkinkan penanganan ribuan permintaan bersamaan dengan latensi rendah.",
    highlights: [
      "REST API dan endpoint ringan dengan validasi skema ketat",
      "Pemrosesan background jobs, webhook, dan antrean asinkron",
      "Berbagi tipe data TypeScript langsung antara backend dan frontend",
      "Performa tinggi dan ekosistem paket npm yang matang",
    ],
    tags: ["API Routes", "Async I/O", "Workers"],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    rgb: "74, 222, 128",
    icon: (
      <Icon>
        <path d="m16 3 11 6.5v13L16 29 5 22.5v-13Z" />
        <circle cx="16" cy="16" r="3.4" />
      </Icon>
    ),
  },
  {
    id: "postgres",
    name: "Postgres",
    version: "16",
    category: "Relational Database",
    desc: "PostgreSQL 16 · Primary database with row-level security",
    fullDesc:
      "PostgreSQL 16 diandalkan sebagai basis data relasional utama untuk menyimpan data terstruktur dengan integritas tinggi. Memanfaatkan indeks komposit, transaksi ACID, serta Row-Level Security (RLS) untuk keamanan akses data per pengguna.",
    highlights: [
      "Skema relasional kuat dengan transaksi ACID yang terjamin",
      "Row-Level Security (RLS) untuk proteksi data multi-tenant",
      "Indexing optimal untuk query analitik dan pencarian cepat",
      "Dukungan JSONB fleksibel saat membutuhkan data semi-terstruktur",
    ],
    tags: ["SQL", "ACID", "Row-Level Security"],
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    rgb: "129, 140, 248",
    icon: (
      <Icon>
        <ellipse cx="16" cy="8" rx="10" ry="4" />
        <path d="M6 8v8c0 2.2 4.5 4 10 4s10-1.8 10-4V8" />
        <path d="M6 16v8c0 2.2 4.5 4 10 4s10-1.8 10-4v-8" />
      </Icon>
    ),
  },
  {
    id: "redis",
    name: "Redis",
    version: "7",
    category: "In-Memory Cache",
    desc: "Redis 7 · Caching, rate limits and queues",
    fullDesc:
      "Redis 7 berperan sebagai lapisan caching in-memory berkecepatan sub-milidetik, pengatur rate-limiting API, serta penyimpanan sesi dan antrean pesan real-time agar beban database utama tetap ringan saat lonjakan trafik.",
    highlights: [
      "Caching respons API dan query berat dengan latensi sub-milidetik",
      "Rate limiting adaptif untuk melindungi endpoint dari penyalahgunaan",
      "Pub/Sub dan antrean tugas untuk notifikasi real-time",
      "Manajemen sesi pengguna yang cepat dan terdistribusi",
    ],
    tags: ["In-Memory Cache", "Rate Limit", "Pub/Sub"],
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    rgb: "248, 113, 113",
    icon: (
      <Icon>
        <path d="m16 5 11 5-11 5-11-5Z" />
        <path d="m5 15 11 5 11-5" />
        <path d="m5 20 11 5 11-5" />
      </Icon>
    ),
  },
  {
    id: "docker",
    name: "Docker",
    version: "27",
    category: "Container & DevOps",
    desc: "Docker 27 · Identical builds from laptop to production",
    fullDesc:
      "Docker 27 memastikan lingkungan pengembangan di laptop identik sepenuhnya dengan server produksi. Dengan multi-stage build yang ramping, proses deployment menjadi konsisten, mudah direplikasi, dan cepat di-rollback bila diperlukan.",
    highlights: [
      "Lingkungan runtime konsisten dari lokal, staging, hingga produksi",
      "Multi-stage Dockerfile untuk ukuran image yang ringan dan aman",
      "Orkestrasi layanan lokal (app, database, cache) lewat Docker Compose",
      "Mempermudah otomasi CI/CD pipeline sebelum rilis ke server",
    ],
    tags: ["Containers", "CI/CD", "Multi-stage Build"],
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80",
    rgb: "59, 130, 246",
    icon: (
      <Icon>
        <rect x="5" y="12" width="5" height="5" rx="1" />
        <rect x="11.5" y="12" width="5" height="5" rx="1" />
        <rect x="18" y="12" width="5" height="5" rx="1" />
        <rect x="11.5" y="6" width="5" height="5" rx="1" />
        <path d="M3 19h23.5c1.2-3 3-3.5 3-3.5-.4 5-4.5 10-13 10C8 25.5 3 22.5 3 19Z" />
      </Icon>
    ),
  },
];

// end of icons


// Title row shared by most cards
function CardTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">{children}</h3>
      {right}
    </div>
  );
}

function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-300">
      <span className="tb-pulse h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
      Live
    </span>
  );
}

// end of GlowCard


/* ==========================================================================
   Card 1: Server latency (large)
   ========================================================================== */

function LatencyCard() {
  const [ttfb] = useState<number>(() => getNavigationTTFB());
  const [series, setSeries] = useState<number[]>(() => {
    const base = getNavigationTTFB() || 12;
    return [base, base];
  });
  const [edgePop, setEdgePop] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.hostname : "edge"
  );
  const [endpoints, setEndpoints] = useState<Array<{ name: string; ms: number | null }>>(() => [
    { name: "Origin Edge", ms: getNavigationTTFB() || null },
    { name: "Server TTFB", ms: getNavigationTTFB() || null },
    { name: "GitHub API", ms: null },
    { name: "Cloudflare DNS", ms: null },
  ]);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tickCount = 0;

    const pingOrigin = async () => {
      if (document.hidden) return;
      const res = await probeEndpoint(`/?_ping=${Date.now()}`, { method: "HEAD" });
      if (cancelled || !res) return;

      if (res.vercelId) {
        setEdgePop(res.vercelId.split("::")[0]);
      }

      setSeries((prev) => {
        const next = [...prev, res.ms];
        return next.length > SERIES_LENGTH ? next.slice(next.length - SERIES_LENGTH) : next;
      });
      setEndpoints((prev) =>
        prev.map((item) => (item.name === "Origin Edge" ? { ...item, ms: res.ms } : item))
      );
    };

    const pingExternal = async () => {
      if (document.hidden) return;
      const [gh, cf] = await Promise.all([
        probeEndpoint(`https://api.github.com/repos/${GITHUB_REPO}`, { method: "HEAD" }),
        probeEndpoint("https://cloudflare-dns.com/dns-query?name=innssaan.my.id&type=A", {
          headers: { Accept: "application/dns-json" },
        }),
      ]);
      if (cancelled) return;
      setEndpoints((prev) =>
        prev.map((item) => {
          if (item.name === "GitHub API" && gh) return { ...item, ms: gh.ms };
          if (item.name === "Cloudflare DNS" && cf) return { ...item, ms: cf.ms };
          return item;
        })
      );
    };

    // Initial burst of real probes so the chart populates immediately
    (async () => {
      await pingOrigin();
      void pingExternal();
      for (let i = 0; i < 4; i++) {
        await new Promise((r) => window.setTimeout(r, 180));
        if (cancelled) return;
        await pingOrigin();
      }
    })();

    const id = window.setInterval(() => {
      tickCount += 1;
      void pingOrigin();
      if (tickCount % 4 === 0) void pingExternal();
    }, TICK_MS);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const latest = Math.round(series[series.length - 1]);
  const average = Math.round(series.reduce((a, b) => a + b, 0) / series.length);
  const peak = Math.round(Math.max(...series));
  const animatedLatest = useAnimatedNumber(latest, 450);

  const maxScale = Math.max(60, Math.ceil((peak * 1.25) / 10) * 10);
  const points = series.map((v, i) => ({
    x: (i / (series.length - 1)) * 100,
    y: 95 - clamp(v / maxScale, 0, 1) * 85,
  }));
  const line = toSmoothPath(points);
  const area = `${line} L 100 100 L 0 100 Z`;
  const shown = Math.min(hover ?? series.length - 1, points.length - 1);

  const handleChartMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    setHover(Math.round(ratio * (series.length - 1)));
  };

  return (
    <GlowCard accent="indigo" className="min-h-[260px] sm:col-span-2 sm:min-h-[300px] lg:row-span-2">
      <CardTitle
        right={
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-border/70 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {edgePop}
            </span>
            <LiveBadge />
          </div>
        }
      >
        Server latency
      </CardTitle>

      {/* Headline numbers */}
      <div className="mb-3 flex flex-wrap items-end gap-x-5 gap-y-2">
        <div className="flex items-end gap-1.5">
          <span className="text-5xl font-semibold leading-none tracking-tight text-foreground [font-variant-numeric:tabular-nums]">
            {Math.round(animatedLatest)}
          </span>
          <span className="mb-1 text-sm text-muted-foreground">ms</span>
        </div>
        <div className="mb-1 flex gap-4 text-xs text-muted-foreground">
          <span>
            avg <b className="font-medium text-foreground">{average}ms</b>
          </span>
          <span>
            peak <b className="font-medium text-foreground">{peak}ms</b>
          </span>
          {ttfb > 0 && (
            <span>
              ttfb <b className="font-medium text-foreground">{ttfb}ms</b>
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div
        className="relative min-h-[130px] flex-1 cursor-crosshair"
        onMouseMove={handleChartMove}
        onMouseLeave={() => setHover(null)}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          role="img"
          aria-label="Live server latency chart"
        >
          <defs>
            <linearGradient id="tb-lat-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.38" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[25, 50, 75].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="var(--border-token)" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
          ))}

          <path d={area} fill="url(#tb-lat-fill)" />
          <path
            d={line}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ filter: "drop-shadow(0 0 8px rgba(var(--accent-rgb),0.7))" }}
          />

          {hover !== null && points[hover] && (
            <line x1={points[hover].x} x2={points[hover].x} y1="0" y2="100" stroke="rgba(var(--accent-rgb),0.5)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          )}
        </svg>

        {/* Dot on the point you are reading, plus a tooltip while hovering */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-200 bg-accent shadow-[0_0_12px_rgba(var(--accent-rgb),0.9)]"
          style={{ left: `${points[shown].x}%`, top: `${points[shown].y}%` }}
        />
        {hover !== null && points[hover] && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-border bg-card/95 px-2.5 py-1.5 text-xs shadow-xl backdrop-blur-md"
            style={{
              left: `clamp(48px, ${points[hover].x}%, calc(100% - 48px))`,
              top: `calc(${points[hover].y}% - 14px)`,
            }}
          >
            <div className="text-muted-foreground">
              {hover === series.length - 1 ? "latest" : `${Math.round(((series.length - 1 - hover) * TICK_MS) / 1000)}s ago`}
            </div>
            <div className="font-medium text-foreground">{Math.round(series[hover])} ms</div>
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>{series.length} probes ({Math.round((series.length * TICK_MS) / 1000)}s window)</span>
        <span>now</span>
      </div>

      {/* Real endpoint pings */}
      <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
        {endpoints.map((ep) => {
          const status = ep.ms !== null ? statusOf(ep.ms) : { dot: "bg-slate-400", text: "text-muted-foreground" };
          return (
            <li
              key={ep.name}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors duration-200 hover:bg-muted/60"
            >
              <span className={cx("h-2 w-2 shrink-0 rounded-full", status.dot)} />
              <span className="flex-1 text-foreground/85">{ep.name}</span>
              <span className={cx("text-xs [font-variant-numeric:tabular-nums]", status.text)}>
                {ep.ms !== null ? `${ep.ms} ms` : "—"}
              </span>
            </li>
          );
        })}
      </ul>
    </GlowCard>
  );
}

// end of LatencyCard


/* ==========================================================================
   Card 2: Deploy terminal (tall)
   ========================================================================== */

function TerminalCard() {
  const [lines, setLines] = useState<TermLine[]>(() => [
    { type: "cmd", text: "git log -n 4 --oneline" },
    { type: "info", text: "Fetching live commits from GitHub…" },
  ]);
  const [step, setStep] = useState(2);

  useEffect(() => {
    let cancelled = false;

    async function loadDeployLogs() {
      const origin = typeof window !== "undefined" ? window.location.origin : PROD_URL;
      const [commitsRes, originProbe] = await Promise.all([
        fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=4`, {
          cache: "no-store",
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        probeEndpoint(`/?_deploy_probe=${Date.now()}`, { method: "HEAD" }),
      ]);

      if (cancelled) return;

      const built: TermLine[] = [{ type: "cmd", text: "git log -n 4 --oneline" }];

      if (Array.isArray(commitsRes) && commitsRes.length > 0) {
        for (const c of commitsRes.slice(0, 4)) {
          const sha = typeof c?.sha === "string" ? c.sha.slice(0, 7) : "unknown";
          const rawMsg = typeof c?.commit?.message === "string" ? c.commit.message.split("\n")[0] : "";
          const msg = rawMsg.length > 36 ? `${rawMsg.slice(0, 35)}…` : rawMsg;
          built.push({ type: "ok", text: `${sha} · ${msg}` });
        }
      } else {
        built.push({ type: "info", text: `repo: ${GITHUB_REPO} (main)` });
      }

      built.push({ type: "cmd", text: `curl -I ${origin.replace(/^https?:\/\//, "")}` });

      if (originProbe) {
        const edge = originProbe.vercelId ? originProbe.vercelId.split("::")[0] : "origin";
        const cache = originProbe.vercelCache ?? "LIVE";
        built.push({ type: "info", text: `edge: ${edge} · cache: ${cache}` });
        built.push({ type: "ok", text: `HTTP ${originProbe.status} OK in ${originProbe.ms}ms` });
      } else {
        built.push({ type: "info", text: "edge: origin probe unavailable" });
      }

      built.push({ type: "url", text: origin });
      setLines(built);
      setStep(1);
    }

    void loadDeployLogs();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s >= lines.length + 5 ? 1 : s + 1));
    }, 750);
    return () => window.clearInterval(id);
  }, [lines.length]);

  const printed = Math.min(step, lines.length);
  const first = Math.max(0, printed - TERM_VISIBLE);
  const visible = lines.slice(first, printed);

  return (
    <GlowCard accent="fuchsia" className="min-h-[250px] sm:col-span-2 sm:min-h-[280px] lg:col-span-1 lg:row-span-2">
      <CardTitle
        right={
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </span>
        }
      >
        deploy.sh
      </CardTitle>

      <div
        className="flex flex-1 flex-col justify-end gap-1.5 overflow-hidden rounded-xl border border-white/10 bg-[#07080d] p-4 font-mono text-xs leading-relaxed text-slate-200"
        aria-label="Live deployment & commit log"
        role="log"
      >
        {visible.map((line, i) => {
          const style = LINE_STYLES[line.type];
          const isLast = first + i === printed - 1;
          return (
            <div key={`${first + i}-${line.text}`} className="tb-slide flex gap-2">
              <span className={cx("w-3 shrink-0 text-center", style.markClass)}>{style.mark}</span>
              <span className={cx("min-w-0 break-words", style.textClass)}>
                {line.text}
                {isLast && printed < lines.length && <span className="tb-blink ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-fuchsia-300" />}
              </span>
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
}

// end of TerminalCard


/* ==========================================================================
   Card 3: Real Web Vitals & Navigation Timing (small)
   ========================================================================== */

interface VitalMetric {
  label: string;
  display: string;
  pct: number;
}

function readRealVitals(): VitalMetric[] {
  if (typeof performance === "undefined") {
    return [
      { label: "TTFB", display: "—", pct: 0 },
      { label: "FCP", display: "—", pct: 0 },
      { label: "DOM", display: "—", pct: 0 },
      { label: "Cache", display: "—", pct: 0 },
    ];
  }

  const nav = getNavigationTiming();
  const paints = performance.getEntriesByType("paint");
  const fcpEntry = paints.find((p) => p.name === "first-contentful-paint");
  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];

  const ttfbMs = nav ? Math.max(1, Math.round(nav.responseStart - nav.requestStart)) : 0;
  const fcpMs = fcpEntry ? Math.max(1, Math.round(fcpEntry.startTime)) : 0;
  const domMs =
    nav && nav.domContentLoadedEventEnd > 0
      ? Math.max(1, Math.round(nav.domContentLoadedEventEnd - nav.fetchStart))
      : 0;

  const cachedCount = resources.filter((r) => r.transferSize === 0 && r.decodedBodySize > 0).length;
  const cachePct = resources.length > 0 ? Math.round((cachedCount / resources.length) * 100) : 0;

  const fmtMs = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`);

  return [
    {
      label: "TTFB",
      display: ttfbMs > 0 ? fmtMs(ttfbMs) : "—",
      pct: ttfbMs > 0 ? clamp(Math.round(100 - ttfbMs / 6), 18, 100) : 20,
    },
    {
      label: "FCP",
      display: fcpMs > 0 ? fmtMs(fcpMs) : "—",
      pct: fcpMs > 0 ? clamp(Math.round(100 - fcpMs / 25), 18, 100) : 20,
    },
    {
      label: "DOM",
      display: domMs > 0 ? fmtMs(domMs) : "—",
      pct: domMs > 0 ? clamp(Math.round(100 - domMs / 35), 18, 100) : 20,
    },
    {
      label: "Cache",
      display: resources.length > 0 ? `${cachePct}%` : "—",
      pct: resources.length > 0 ? clamp(cachePct, 12, 100) : 15,
    },
  ];
}

function LighthouseCard() {
  const [vitals, setVitals] = useState<VitalMetric[]>(() => readRealVitals());
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const refresh = () => setVitals(readRealVitals());
    const t1 = window.setTimeout(refresh, 400);
    const t2 = window.setTimeout(refresh, 1800);
    window.addEventListener("load", refresh);

    let obs: PerformanceObserver | null = null;
    if (typeof PerformanceObserver !== "undefined") {
      try {
        obs = new PerformanceObserver(refresh);
        obs.observe({ entryTypes: ["paint", "navigation"] });
      } catch {
        obs = null;
      }
    }

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("load", refresh);
      obs?.disconnect();
    };
  }, []);

  return (
    <GlowCard accent="emerald" className="min-h-[155px]">
      <CardTitle
        right={
          <span className="text-[11px] text-muted-foreground">Navigation API</span>
        }
      >
        Web vitals
      </CardTitle>

      <div className="flex flex-1 items-center justify-between gap-1">
        {vitals.map((item) => (
          <div key={item.label} className="group flex flex-col items-center gap-2">
            <div className="relative h-14 w-14">
              <svg viewBox="0 0 50 50" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="25" cy="25" r={radius} fill="none" stroke="var(--border-token)" strokeWidth="4" />
                <circle
                  cx="25"
                  cy="25"
                  r={radius}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  className="tb-ring transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_5px_#34d399)]"
                  style={
                    {
                      "--from": `${circumference}`,
                      "--to": `${circumference * (1 - item.pct / 100)}`,
                    } as CSSProperties
                  }
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-foreground [font-variant-numeric:tabular-nums]">
                {item.display}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </GlowCard>
  );
}

// end of LighthouseCard


/* ==========================================================================
   Card 4: Real Server Requests & Resource Timing (small)
   ========================================================================== */

interface ResourceSnapshot {
  count: number;
  totalKB: number;
  bars: number[];
}

function readResourceSnapshot(): ResourceSnapshot {
  if (typeof performance === "undefined") {
    return { count: 0, totalKB: 0, bars: [10, 10] };
  }
  const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const totalBytes = entries.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  const durations = entries
    .slice(-16)
    .map((r) => Math.max(2, Math.round(r.duration || 2)));

  while (durations.length < 16) {
    durations.unshift(4);
  }

  return {
    count: entries.length,
    totalKB: Math.round(totalBytes / 1024),
    bars: durations,
  };
}

function ThroughputCard() {
  const [snap, setSnap] = useState<ResourceSnapshot>(() => readResourceSnapshot());

  useEffect(() => {
    const sync = () => setSnap(readResourceSnapshot());
    const t = window.setTimeout(sync, 500);

    let obs: PerformanceObserver | null = null;
    if (typeof PerformanceObserver !== "undefined") {
      try {
        obs = new PerformanceObserver(sync);
        obs.observe({ entryTypes: ["resource"] });
      } catch {
        obs = null;
      }
    }

    return () => {
      window.clearTimeout(t);
      obs?.disconnect();
    };
  }, []);

  const animated = useAnimatedNumber(snap.count, 500);
  const max = Math.max(...snap.bars, 1);

  return (
    <GlowCard accent="cyan" className="min-h-[155px]">
      <CardTitle right={<LiveBadge />}>Server requests</CardTitle>

      <div className="flex items-baseline gap-2.5">
        <div className="text-4xl font-semibold leading-none tracking-tight text-foreground [font-variant-numeric:tabular-nums]">
          {Math.round(animated).toLocaleString("en-US")}
        </div>
        <span className="text-xs text-muted-foreground [font-variant-numeric:tabular-nums]">
          {snap.totalKB > 0 ? `${snap.totalKB} KB` : "cached"} · {snap.bars[snap.bars.length - 1]}ms
        </span>
      </div>

      <div className="mt-auto flex h-14 items-end gap-1" aria-hidden="true">
        {snap.bars.map((v, i) => (
          <span
            key={i}
            className={cx(
              "flex-1 rounded-sm transition-all duration-500 ease-out",
              i === snap.bars.length - 1 ? "bg-cyan-500 dark:bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]" : "bg-cyan-500/25 dark:bg-cyan-400/30"
            )}
            style={{ height: `${Math.max((v / max) * 100, 10)}%` }}
          />
        ))}
      </div>
    </GlowCard>
  );
}

// end of ThroughputCard


/* ==========================================================================
   Card 5: Tech stack badges (wide)
   ========================================================================== */

const TECH_EN: Record<
  string,
  { fullDesc: string; highlights: string[] }
> = {
  react: {
    fullDesc:
      "React 19 powers interactive component-driven interfaces that stay structured and maintainable. With concurrent rendering, custom hooks, and smooth state transitions, every UI element responds instantaneously.",
    highlights: [
      "Reusable component architecture with clean composition",
      "Optimized rendering and memoization for 60fps interactions",
      "Seamless integration with Motion and modern UI ecosystems",
      "Predictable state management for complex application flows",
    ],
  },
  next: {
    fullDesc:
      "Next.js 15 powers web applications requiring high performance, strong SEO, and App Router architecture. Supports Server Components, streaming SSR, and automatic asset optimization.",
    highlights: [
      "App Router with nested layouts and automatic loading boundaries",
      "Server-Side Rendering & Static Generation for top SEO",
      "Built-in image, font, and bundle splitting optimization",
      "Integrated API routes & Server Actions in one repository",
    ],
  },
  ts: {
    fullDesc:
      "TypeScript keeps code reliable from the data layer up to UI components. Strict static typing catches bugs at compile time, accelerates refactoring, and keeps module contracts crystal clear.",
    highlights: [
      "End-to-end type safety from API schemas to component props",
      "Accurate autocomplete and self-documenting data contracts",
      "Safe large-scale refactoring without breaking features",
      "Strict mode enabled to eliminate null/undefined runtime surprises",
    ],
  },
  tailwind: {
    fullDesc:
      "Tailwind CSS enables precision interface crafting with rapid iteration. Paired with CSS variables for dark/light themes, consistent spacing tokens, and minimal production CSS bundles.",
    highlights: [
      "Visual consistency through color, radius, and typography tokens",
      "Adaptive dark and light theme support across all components",
      "Precision responsive layouts from mobile to ultra-wide displays",
      "Minimal production CSS footprint via automatic purging",
    ],
  },
  node: {
    fullDesc:
      "Node.js 22 drives backend services, REST/WebSocket APIs, and background workers. Non-blocking I/O architecture handles concurrent requests with consistently low latency.",
    highlights: [
      "Lightweight REST APIs and endpoints with strict schema validation",
      "Background jobs, webhooks, and asynchronous task queues",
      "Shared TypeScript types across backend and frontend",
      "High throughput backed by the mature npm ecosystem",
    ],
  },
  postgres: {
    fullDesc:
      "PostgreSQL 16 serves as the primary relational database for structured data integrity. Uses composite indexes, ACID transactions, and Row-Level Security (RLS) for per-user access control.",
    highlights: [
      "Strong relational schemas with guaranteed ACID transactions",
      "Row-Level Security (RLS) for multi-tenant data protection",
      "Optimized indexing for fast queries and analytics",
      "Flexible JSONB support when semi-structured fields are needed",
    ],
  },
  redis: {
    fullDesc:
      "Redis 7 provides sub-millisecond in-memory caching, API rate limiting, and real-time message queues so the primary database stays fast under traffic spikes.",
    highlights: [
      "Sub-millisecond caching for API responses and heavy queries",
      "Adaptive rate limiting to protect endpoints from abuse",
      "Pub/Sub and task queues for real-time notifications",
      "Fast distributed user session management",
    ],
  },
  docker: {
    fullDesc:
      "Docker 27 ensures local development mirrors production identically. Slim multi-stage builds keep deployments consistent, reproducible, and fast to roll back.",
    highlights: [
      "Consistent runtime from laptop to staging and production",
      "Multi-stage Dockerfiles for small, secure container images",
      "Local service orchestration (app, DB, cache) via Docker Compose",
      "Streamlined CI/CD pipelines before every release",
    ],
  },
};

function StackCard({
  selectedTech,
  onSelectTech,
  lang = "id",
}: {
  selectedTech?: string | null;
  onSelectTech?: (techId: string | null) => void;
  lang?: "id" | "en";
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const activeId = hoverId ?? selectedTech ?? null;
  const active = TECHS.find((t) => t.id === activeId);

  const modalItems: DetailLightboxItem[] = TECHS.map((tech) => {
    const isSynced = tech.id === selectedTech;
    const enCopy = TECH_EN[tech.id];
    return {
      id: tech.id,
      eyebrow: `${tech.category} · v${tech.version}`,
      badge: isSynced
        ? lang === "en"
          ? "Active Filter"
          : "Filter Aktif"
        : "Tech Stack",
      title: tech.name,
      subtitle: lang === "en" ? `Version ${tech.version}` : `Versi ${tech.version}`,
      image: tech.image,
      imageAlt:
        lang === "en"
          ? `Visual illustration for ${tech.name}`
          : `Visual ilustrasi teknologi ${tech.name}`,
      gradientFallback: "from-neutral-900 via-[#1f1216] to-black",
      visualAccentRgb: tech.rgb,
      visualIcon: tech.icon,
      description: lang === "en" && enCopy ? enCopy.fullDesc : tech.fullDesc,
      highlights: lang === "en" && enCopy ? enCopy.highlights : tech.highlights,
      tags: tech.tags,
      primaryAction: onSelectTech
        ? {
            label: isSynced
              ? lang === "en"
                ? `Clear ${tech.name} Filter`
                : `Hapus Filter ${tech.name}`
              : lang === "en"
                ? `Filter Portfolio: ${tech.name}`
                : `Filter Portofolio: ${tech.name}`,
            active: isSynced,
            onClick: () => onSelectTech(isSynced ? null : tech.id),
          }
        : undefined,
    };
  });

  return (
    <GlowCard accent="amber" className="sm:col-span-2 lg:col-span-4" contentClassName="p-3.5 sm:p-5">
      <CardTitle
        right={
          selectedTech ? (
            <button
              type="button"
              onClick={() => onSelectTech?.(null)}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Reset sync ×
            </button>
          ) : (
            <span className="text-[11px] text-muted-foreground">
              {lang === "en" ? "Click a tech for details" : "Klik teknologi untuk detail"}
            </span>
          )
        }
      >
        Tech stack
      </CardTitle>

      <ul className="grid grid-cols-4 gap-2 sm:gap-2.5 lg:grid-cols-8">
        {TECHS.map((tech, idx) => {
          const on = tech.id === activeId;
          const isSelected = tech.id === selectedTech;
          return (
            <li key={tech.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setModalIndex(idx);
                }}
                onMouseEnter={() => setHoverId(tech.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(tech.id)}
                onBlur={() => setHoverId(null)}
                aria-label={`${tech.name} ${tech.version} — ${lang === "en" ? "view details" : "lihat detail"}`}
                className={cx(
                  "flex w-full cursor-pointer flex-col items-center gap-1 rounded-xl border px-1.5 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:gap-1.5 sm:px-2 sm:py-3",
                  on
                    ? "border-accent bg-accent text-white shadow-[0_0_24px_rgba(var(--accent-rgb),0.35)]"
                    : "border-[#D4D4D8] bg-white text-neutral-800 hover:border-accent/60 hover:text-neutral-950 dark:border-[#3A3A44] dark:bg-[#1A1A1F] dark:text-[#C4C4CC] dark:hover:border-accent/70 dark:hover:text-[#FAFAFA]"
                )}
              >
                {tech.icon}
                <span className="text-xs font-medium">
                  {tech.name}
                </span>
                <span
                  className={cx(
                    "text-[10px]",
                    on
                      ? "text-white/80"
                      : "text-muted-foreground"
                  )}
                >
                  v{tech.version}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Description of whichever tool you are pointing at */}
      <p className="mt-4 min-h-[20px] text-sm text-muted-foreground" aria-live="polite">
        {active ? (
          <span key={active.id} className="tb-fade">
            {active.desc}
          </span>
        ) : lang === "en" ? (
          "Hover or click any technology to view its visual showcase & full details."
        ) : (
          "Hover atau klik salah satu teknologi untuk melihat gambar & deskripsi lengkap."
        )}
      </p>

      <DetailLightboxModal
        items={modalItems}
        activeIndex={modalIndex}
        onClose={() => setModalIndex(null)}
        onChangeIndex={setModalIndex}
        lang={lang}
      />
    </GlowCard>
  );
}

// end of StackCard


/* ==========================================================================
   Main component
   ========================================================================== */

export interface TechStackBentoProps {
  selectedTech?: string | null;
  onSelectTech?: (techId: string | null) => void;
  lang?: "id" | "en";
}

export default function TechStackBento({
  selectedTech,
  onSelectTech,
  lang = "id",
}: TechStackBentoProps = {}) {
  return (
    <section className="section section-alt w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-5 max-w-2xl sm:mb-6">
          <p className="mb-2.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <span className="font-semibold text-accent">01</span>
            <span className="h-px w-6 bg-[#9A9AA2]/40" />
            Tech stack
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {lang === "en"
              ? "Modern tools built for speed, reliability, and scale"
              : "Teknologi modern yang cepat, andal, dan terukur"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "en"
              ? "Live telemetry, automated deployment pipelines, and the core stack behind every project."
              : "Performa langsung, alur deployment otomatis, dan stack utama yang menopang setiap proyek."}
          </p>
        </div>

        {/* Grid: 1 column on phones, 2 on tablets, 4 on desktops */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:auto-rows-[minmax(160px,auto)] lg:grid-cols-4">
          <LatencyCard />
          <TerminalCard />
          <LighthouseCard />
          <ThroughputCard />
          <StackCard selectedTech={selectedTech} onSelectTech={onSelectTech} lang={lang} />
        </div>
      </div>
    </section>
  );
}

// end of main component
