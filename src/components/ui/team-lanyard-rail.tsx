"use client";

import * as React from "react";
import { playLanyardGrabSound, playLanyardSwingSound } from "@/lib/sound";

export interface LanyardLink {
  label: string;
  href: string;
}

export interface LanyardMember {
  id: string;
  /** Accessible name, printed on both faces of the badge. */
  name: string;
  role: string;
  /** Company or team line printed under the role, e.g. "Acme · Design". */
  team?: string;
  /** Portrait, cropped to a circle. A square image works best. */
  image: string;
  /** One or two sentences printed on the back. */
  bio?: string;
  /** Short chips on the back such as "Design systems" or "Since 2021". */
  tags?: string[];
  /** Contact links on the back. */
  links?: LanyardLink[];
  /** Team colour: chart token 1–5 for the ribbon and the badge band. */
  tone?: 1 | 2 | 3 | 4 | 5;
  /** Extra lanyard length in pixels at a 124 px badge; it scales with the badge. */
  drop?: number;
}

export interface TeamLanyardRailLabels {
  /** Hint under the name while a badge faces the front. */
  flip: string;
  /** Hint under the name while a badge shows its back. */
  back: string;
  /** Prefix of the carousel dots on narrow screens. */
  show: string;
}

export interface TeamLanyardRailProps extends React.ComponentProps<"section"> {
  items: LanyardMember[];
  eyebrow?: string;
  heading?: string;
  /** Shown under the rail while nobody is selected. */
  caption?: string;
  /** Call to action rendered under the caption. */
  action?: React.ReactNode;
  /** Turns the badges to the front and flips them one by one until the visitor interacts. */
  autoplay?: boolean;
  /** Milliseconds a badge shows its back during autoplay. */
  interval?: number;
  /** Badge facing the front (controlled). */
  active?: number | null;
  onActiveChange?: (index: number | null) => void;
  /** Badge turned to its back (controlled). */
  flipped?: number | null;
  onFlippedChange?: (index: number | null) => void;
  labels?: TeamLanyardRailLabels;
  /** Hides the card backdrop, dot grid, and floating rail so the lanyard hangs seamlessly from a navbar or container edge. */
  seamless?: boolean;
}

const RATIO = 96 / 62;
const MAX_W = 142;
const MIN_RAIL_W = 100;
const EM = 11.2;
const RAIL_PITCH_MIN = 1.16;
const RAIL_PITCH_MAX = 1.62;
const CAROUSEL_PITCH = 1.2;
const GAP = 0.07;
const PERSPECTIVE = 900;
const MAX_STRETCH = 210;
const FIRST_DELAY = 1100;
const FLIP_DELAY = 700;
const SWING_K = 18;
const SWING_DAMP = 1.15;
const LAG = 0.14;
const REEL_K = 46;
const REEL_ZETA = 0.19;
const REST_Y = [9, -10, 7, -8, 10, -7, 8, -9];
const REST_Z = [-1.6, 1.2, -2, 1.5, -1, 1.8, -1.3, 2];
const DROPS = [6, 20, 0, 13, 22, 4, 16, 9];
const TONES = ["text-chart-1", "text-chart-2", "text-chart-3", "text-chart-4", "text-chart-5"] as const;
const DEFAULT_LABELS: TeamLanyardRailLabels = {
  flip: "Click or press Enter to flip the badge",
  back: "Click again or press Esc to turn it back",
  show: "Show",
};
const METAL =
  "linear-gradient(90deg, #3f3f46 0%, #d4d4d8 22%, #fafafa 38%, #71717a 56%, #e4e4e7 78%, #27272a 100%)";
const PLASTIC =
  "linear-gradient(180deg, #3f3f46 0%, #18181b 55%, #09090b 100%)";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function random(seed: number) {
  let a = seed || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function qrPath(seed: number) {
  const size = 21;
  const next = random(seed);
  const corners = [[0, 0], [size - 7, 0], [0, size - 7]];
  let d = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const corner = corners.find(([cx = 0, cy = 0]) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7);
      const quiet = (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8);
      let on: boolean;
      if (corner) on = Math.max(Math.abs(x - (corner[0] ?? 0) - 3), Math.abs(y - (corner[1] ?? 0) - 3)) !== 2;
      else if (quiet) on = false;
      else if (x === 6 || y === 6) on = (x + y) % 2 === 0;
      else on = next() > 0.52;
      if (on) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
}

function soft(distance: number, max: number) {
  const knee = max * 0.75;
  if (distance <= knee) return distance;
  return knee + (max - knee) * (1 - Math.exp(-(distance - knee) / (max - knee)));
}

function geometry(W: number, items: LanyardMember[], seamless = false) {
  const u = W / MAX_W;
  const H = W * RATIO;
  const railR = Math.max(3, 4.2 * u);
  const railY = seamless ? 0 : 14 + railR;
  const ring = 9 * u;
  const pivotY = railY + ring * 0.8;
  const strapW = Math.max(8, 11 * u);
  const crimp = 6 * u;
  const clipH = 13 * u;
  const clipW = 30 * u;
  const base = (seamless ? 96 : 56) * u;
  const straps = items.map((item, i) => base + Math.max(0, item.drop ?? DROPS[i % DROPS.length] ?? 0) * u);
  const clipTops = straps.map((len) => pivotY + len + crimp * 0.35);
  const cardTops = clipTops.map((top) => top + clipH * 0.62);
  const pendulum = cardTops.map((top) => top + H / 2 - pivotY);
  const restLength = pivotY + base + crimp * 0.35 + clipH * 0.62 + H / 2 - pivotY;
  const bottom = Math.max(0, ...cardTops.map((top) => top + H));
  return {
    W, H, u, railR, railY, ring, pivotY, strapW, crimp, clipH, clipW, straps, clipTops, cardTops, pendulum,
    swingK: pendulum.map((len) => (SWING_K * restLength) / len),
    couple: pendulum.map((len) => (0.25 * 57.3) / len),
    maxStretch: Math.round(MAX_STRETCH * Math.min(1, W / 118)),
    height: Math.ceil(bottom + 16 * u + 8),
  };
}

function layoutTargets(width: number, W: number, carousel: boolean, center: number | null, count: number) {
  if (!carousel) {
    const pitch = clamp((width - 40 - W * 0.6) / Math.max(1, count), W * RAIL_PITCH_MIN, W * RAIL_PITCH_MAX);
    const start = width / 2 - (pitch * (count - 1)) / 2;
    return { xs: Array.from({ length: count }, (_, i) => start + i * pitch), total: 0 };
  }
  const pitch = W * CAROUSEL_PITCH;
  const total = pitch * count;
  const cyclic = count > 2 && total >= width + W * 2;
  const c = center ?? 0;
  const xs = Array.from({ length: count }, (_, i) => {
    let k = i - c;
    if (cyclic) {
      k = ((k % count) + count) % count;
      if (k >= count / 2) k -= count;
    }
    return width / 2 + k * pitch;
  });
  return { xs, total: cyclic ? total : 0 };
}

type Sim = {
  x: number[]; vx: number[]; px: number[]; tx: number[];
  ox: number[]; vox: number[]; oy: number[]; voy: number[];
  sw: number[]; vsw: number[]; beta: number[];
  ry: number[]; vry: number[]; tr: number[];
  rx: number[]; vrx: number[]; trx: number[];
  tiltY: number[]; vtiltY: number[]; ttiltY: number[];
  rz: number[]; vrz: number[]; tz: number[];
  lift: number[]; vlift: number[]; tl: number[];
  pop: number[]; vpop: number[]; tp: number[];
  st: number[]; vst: number[];
  drag: number; grab: number; pull: number; free: number; last: number; raf: number; carousel: boolean | null;
};

function emptySim(): Sim {
  return {
    x: [], vx: [], px: [], tx: [], ox: [], vox: [], oy: [], voy: [], sw: [], vsw: [], beta: [],
    ry: [], vry: [], tr: [], rx: [], vrx: [], trx: [], tiltY: [], vtiltY: [], ttiltY: [],
    rz: [], vrz: [], tz: [],
    lift: [], vlift: [], tl: [], pop: [], vpop: [], tp: [], st: [], vst: [],
    drag: -1, grab: 0, pull: -1, free: 0, last: 0, raf: 0, carousel: null,
  };
}

function spring(value: number[], velocity: number[], target: number, i: number, k: number, zeta: number, h: number) {
  const v = velocity[i] ?? 0;
  const x = value[i] ?? 0;
  const next = v + (-k * (x - target) - 2 * zeta * Math.sqrt(k) * v) * h;
  velocity[i] = next;
  value[i] = x + next * h;
}

function badgeWidth(s: Sim, W: number, i: number) {
  return W * (1 + 0.08 * (s.pop[i] ?? 0));
}

function minGap(s: Sim, W: number, a: number, b: number) {
  return (badgeWidth(s, W, a) + badgeWidth(s, W, b)) / 2 + W * GAP;
}

function stops(s: Sim, W: number, width: number, count: number) {
  return [W * 0.32 + badgeWidth(s, W, 0) / 2, width - W * 0.32 - badgeWidth(s, W, count - 1) / 2] as const;
}

type EdgeGeometry = { W: number; H: number; pivotY: number; clipTops: number[]; cardTops: number[] };

function cardEdge(s: Sim, g: EdgeGeometry, i: number, side: 1 | -1) {
  const theta = ((s.sw[i] ?? 0) * Math.PI) / 180;
  const psi = (((s.beta[i] ?? 0) + (s.rz[i] ?? 0)) * Math.PI) / 180;
  const scale = 1 + 0.08 * (s.pop[i] ?? 0);
  const clipDepth = (g.clipTops[i] ?? 0) + (s.st[i] ?? 0) - 4 * (s.lift[i] ?? 0) - g.pivotY;
  const offset = (g.cardTops[i] ?? 0) - (g.clipTops[i] ?? 0);
  const cx = (s.x[i] ?? 0) - clipDepth * Math.sin(theta);
  const half = (g.W / 2) * scale * Math.cos(psi) * side;
  return [
    cx + half - offset * scale * Math.sin(psi),
    cx + half - (offset + g.H) * scale * Math.sin(psi),
    clipDepth + offset * scale,
    clipDepth + (offset + g.H) * scale,
  ] as const;
}

function Hole() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-[0.72em] block h-[0.56em] w-[2.7em] -translate-x-1/2 rounded-full bg-background"
      style={{ boxShadow: "inset 0 0.09em 0.2em color-mix(in oklab, black 55%, transparent), 0 0.05em 0 color-mix(in oklab, white 30%, transparent)" }}
    />
  );
}

function Finish() {
  return (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 block w-[200%] opacity-70 dark:opacity-35" style={{ background: "linear-gradient(100deg, transparent 40%, color-mix(in oklab, white 26%, transparent) 48%, color-mix(in oklab, white 8%, transparent) 52%, transparent 58%)", transform: "translateX(var(--gx, 0%))" }} />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 block bg-black" style={{ opacity: "var(--shade, 0)" }} />
    </>
  );
}

function Silhouette() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className="size-full text-muted-foreground/60">
      <circle cx="20" cy="15" r="7" fill="currentColor" />
      <path d="M6 38c1.5-8 7-12 14-12s12.5 4 14 12z" fill="currentColor" />
    </svg>
  );
}

const BadgeFaces = React.memo(function BadgeFaces({ item, index = 0 }: { item: LanyardMember; tone: string; index?: number }) {
  const seed = React.useMemo(() => hash(`${item.id}:${item.name}`), [item.id, item.name]);
  const qr = React.useMemo(() => qrPath(seed), [seed]);
  const [failed, setFailed] = React.useState(false);
  const serialBadge = `JV-${String(index + 1).padStart(3, "0")}`;
  return (
    <>
      {/* FRONT: Ultra-Clean Minimalist Editorial ID Pass */}
      <span
        data-face="front"
        className="absolute inset-0 flex flex-col overflow-hidden rounded-[0.95em] border border-[#D4D4D8] bg-white px-[0.82em] pb-[0.72em] pt-[1.55em] text-neutral-950 shadow-2xl [backface-visibility:hidden] [transform-style:preserve-3d] dark:border-[#3A3A44] dark:bg-[#111114] dark:text-[#FAFAFA]"
        style={{
          transform: "translateZ(2px)",
        }}
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[0.28em] bg-gradient-to-r from-[var(--accent-dark)] via-accent to-[var(--accent-bright)]" />
        <Hole />

        {/* Header Row */}
        <span className="flex w-full items-center justify-between gap-1 pt-[0.2em]" style={{ transform: "translateZ(5px)" }}>
          <span className="inline-flex items-center gap-[0.3em] font-mono text-[0.5em] font-bold uppercase tracking-[0.22em] text-neutral-700 dark:text-[#C4C4CC]">
            <span className="inline-block size-[0.7em] rotate-45 border border-accent bg-accent/25" />
            JEVALLENE
          </span>
          <span className="inline-flex items-center gap-[0.28em] rounded-full border border-[#35C46A]/40 bg-[#35C46A]/10 px-[0.48em] py-[0.12em] font-mono text-[0.44em] font-semibold uppercase tracking-[0.16em] text-[#35C46A]">
            <span className="size-[0.6em] rounded-full bg-[#35C46A]" />
            ACTIVE
          </span>
        </span>

        {/* Framed Editorial Portrait */}
        <span
          className="relative mt-[0.55em] block h-[5.65em] w-full shrink-0 overflow-hidden rounded-[0.65em] border border-neutral-300 bg-neutral-100 dark:border-[#3A3A44] dark:bg-[#16161C]"
          style={{
            transform: "translateZ(8px)",
            boxShadow: "0 0.35em 1em rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <Silhouette />
          {!failed && (
            <img
              src={item.image}
              alt=""
              draggable={false}
              decoding="async"
              onError={() => setFailed(true)}
              className="pointer-events-none absolute inset-0 block size-full select-none object-cover object-[50%_20%]"
            />
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(180deg, transparent 55%, rgba(8,8,10,0.72) 100%)",
            }}
          />
          <span className="absolute bottom-[0.42em] left-[0.55em] font-mono text-[0.46em] font-semibold uppercase tracking-[0.18em] text-white/90">
            {serialBadge}
          </span>
        </span>

        {/* Identity Block */}
        <span className="mt-[0.55em] block w-full" style={{ transform: "translateZ(6px)" }}>
          <span className="block truncate text-[1.05em] font-bold leading-tight tracking-tight">
            {item.name}
          </span>
          <span className="mt-[0.15em] block truncate text-[0.68em] font-medium text-neutral-600 dark:text-[#C4C4CC]">
            {item.role}
          </span>
        </span>

        {/* Structured Metadata Grid */}
        <span
          className="mt-auto grid w-full grid-cols-2 border-t border-neutral-200 pt-[0.45em] dark:border-[#27272E]"
          style={{ transform: "translateZ(4px)" }}
        >
          <span className="block pr-[0.35em]">
            <span className="block font-mono text-[0.42em] uppercase tracking-[0.18em] text-neutral-500 dark:text-[#9A9AA2]">
              BASE
            </span>
            <span className="block truncate font-mono text-[0.54em] font-semibold">
              BANDUNG · ID
            </span>
          </span>
          <span className="block border-l border-neutral-200 pl-[0.45em] dark:border-[#27272E]">
            <span className="block font-mono text-[0.42em] uppercase tracking-[0.18em] text-neutral-500 dark:text-[#9A9AA2]">
              FOCUS
            </span>
            <span className="block truncate font-mono text-[0.54em] font-semibold text-accent">
              UI · MOTION
            </span>
          </span>
        </span>

        <Finish />
      </span>

      {/* BACK: Ultra-Clean Studio Dossier */}
      <span
        data-face="back"
        className="absolute inset-0 flex flex-col overflow-hidden rounded-[0.95em] border border-[#D4D4D8] bg-white px-[0.82em] pb-[0.75em] pt-[1.55em] text-neutral-950 shadow-2xl [backface-visibility:hidden] [transform-style:preserve-3d] dark:border-[#3A3A44] dark:bg-[#111114] dark:text-[#FAFAFA]"
        style={{
          transform: "rotateY(180deg) translateZ(2px)",
        }}
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[0.28em] bg-gradient-to-r from-[var(--accent-bright)] via-accent to-[var(--accent-dark)]" />
        <Hole />

        <span className="flex items-center justify-between pt-[0.2em]">
          <span className="font-mono text-[0.48em] font-bold uppercase tracking-[0.2em] text-accent">
            SCAN HERE
          </span>
          <span className="font-mono text-[0.46em] text-neutral-500 dark:text-[#9A9AA2]">
            {serialBadge}
          </span>
        </span>

        <span className="my-auto flex flex-col items-center justify-center gap-[0.38em]">
          <span className="font-mono text-[0.44em] font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-[#9A9AA2]">
            CONNECT · JEVALLENE
          </span>
          <span className="rounded-[0.65em] border border-neutral-200 bg-white p-[0.45em] shadow-sm dark:border-[#3A3A44] dark:bg-[#16161C]">
            <svg aria-hidden="true" viewBox="-1 -1 23 23" className="block size-[5.8em] text-neutral-900 dark:text-[#FAFAFA]">
              <path d={qr} fill="currentColor" />
            </svg>
          </span>
        </span>

        <span className="mt-auto block border-t border-neutral-200 pt-[0.42em] text-center dark:border-[#27272E]">
          <span className="block truncate text-[0.88em] font-bold leading-tight">{item.name}</span>
          <span className="mt-[0.12em] block truncate text-[0.56em] text-neutral-600 dark:text-[#9A9AA2]">{item.role}</span>
        </span>

        <Finish />
      </span>

      {/* Machined 3D Card Edges */}
      {[0, 1].map((side) => (
        <span key={`lr-${side}`} aria-hidden="true" className="absolute inset-y-[0.9em] block w-[4px]" style={{ [side ? "right" : "left"]: 0, transform: `translateX(${side ? 2 : -2}px) rotateY(90deg)`, background: "linear-gradient(180deg, var(--accent) 0%, #3F3F46 30%, #18181B 100%)" }} />
      ))}
      {[0, 1].map((side) => (
        <span key={`tb-${side}`} aria-hidden="true" className="absolute inset-x-[0.9em] block h-[4px]" style={{ [side ? "bottom" : "top"]: 0, transform: `translateY(${side ? 2 : -2}px) rotateX(90deg)`, background: side ? "#18181B" : "var(--accent)" }} />
      ))}
    </>
  );
});

export function TeamLanyardRail({
  items,
  eyebrow,
  heading,
  caption,
  action,
  autoplay = false,
  interval = 2800,
  active: activeProp,
  onActiveChange,
  flipped: flippedProp,
  onFlippedChange,
  labels = DEFAULT_LABELS,
  seamless = false,
  className,
  ...rest
}: TeamLanyardRailProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const count = items.length;
  const stageRef = React.useRef(null as HTMLDivElement | null);
  const slots = React.useRef([] as (HTMLDivElement | null)[]);
  const swings = React.useRef([] as (HTMLSpanElement | null)[]);
  const straps = React.useRef([] as (HTMLSpanElement | null)[]);
  const twistSegs = React.useRef([] as (SVGPolygonElement | null)[]);
  const strapShadows = React.useRef([] as (SVGPathElement | null)[]);
  const strapEdges = React.useRef([] as (SVGPathElement | null)[]);
  const strapSheens = React.useRef([] as (SVGPathElement | null)[]);
  const swivels = React.useRef([] as (SVGSVGElement | null)[]);
  const hangs = React.useRef([] as (HTMLSpanElement | null)[]);
  const buttons = React.useRef([] as (HTMLButtonElement | null)[]);
  const flips = React.useRef([] as (HTMLSpanElement | null)[]);
  const shadows = React.useRef([] as (HTMLSpanElement | null)[]);
  const linkLayers = React.useRef([] as (HTMLDivElement | null)[]);
  const sim = React.useRef(emptySim());
  const [size, setSize] = React.useState({ width: 0, W: MAX_W, carousel: false });
  const [innerActive, setInnerActive] = React.useState(null as number | null);
  const [innerFlipped, setInnerFlipped] = React.useState(null as number | null);
  const [focusIndex, setFocusIndex] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);
  const [playing, setPlaying] = React.useState(autoplay);
  const pendingOpen = React.useRef(-1);
  const pointer = React.useRef({ id: -1, index: -1, x: 0, y: 0, startOx: 0, startOy: 0, mode: "", kind: "", lastX: 0, lastY: 0, lastT: 0, v: 0, vy: 0, swipe: 0, angle: 0, hoverX: 0, hoverT: 0, hoverHit: -1 });
  const valid = (value: number | null | undefined) => (value === null || value === undefined || value < 0 || value >= count ? null : value);
  const active = valid(activeProp !== undefined ? activeProp : innerActive);
  const flipped = valid(flippedProp !== undefined ? flippedProp : innerFlipped);
  const geo = React.useMemo(() => geometry(size.W, items, seamless), [size.W, items, seamless]);
  const live = React.useRef({ active, flipped, size, geo, reduced, count, carouselIndex: 0, cyclic: false, activeControlled: false, flippedControlled: false });
  live.current = { ...live.current, active, flipped, size, geo, reduced, count, activeControlled: activeProp !== undefined, flippedControlled: flippedProp !== undefined };
  const callbacks = React.useRef({ onActiveChange, onFlippedChange });
  callbacks.current = { onActiveChange, onFlippedChange };

  const setActive = React.useCallback((index: number | null) => {
    const L = live.current;
    if (L.active === index) return;
    L.active = index;
    if (index !== null) L.carouselIndex = index;
    if (!L.activeControlled) setInnerActive(index);
    callbacks.current.onActiveChange?.(index);
  }, []);

  const setFlipped = React.useCallback((index: number | null) => {
    const L = live.current;
    if (L.flipped === index) return;
    const old = L.flipped;
    // the contact links unmount with the back face: keep keyboard focus on the badge instead of dropping it to <body>
    if (old !== null && linkLayers.current[old]?.contains(document.activeElement)) buttons.current[old]?.focus({ preventScroll: true });
    L.flipped = index;
    if (!L.flippedControlled) setInnerFlipped(index);
    callbacks.current.onFlippedChange?.(index);
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => { setPlaying(autoplay); }, [autoplay]);

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = (width: number) => {
      const n = Math.max(1, live.current.count);
      const railW = Math.min(MAX_W, (width - 40) / (n * RAIL_PITCH_MIN + 0.4));
      const carousel = railW < MIN_RAIL_W;
      const W = Math.round((carousel ? clamp(width * 0.3, 96, 118) : railW) * 4) / 4;
      setSize((old) => (Math.abs(old.width - width) < 0.5 && old.carousel === carousel && old.W === W ? old : { width, W, carousel }));
    };
    measure(stage.clientWidth);
    const observer = new ResizeObserver((entries) => { const box = entries[0]; if (box) measure(box.contentRect.width); });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [count]);

  const paint = React.useCallback((i: number) => {
    const s = sim.current;
    const g = live.current.geo;
    const slot = slots.current[i];
    if (!slot) return;
    slot.style.transform = `translate3d(${((s.x[i] ?? 0) - g.W / 2).toFixed(2)}px,0,0)`;
    const sw = s.sw[i] ?? 0;
    const lift = s.lift[i] ?? 0;
    const pop = s.pop[i] ?? 0;
    const strapBase = Math.max(1, g.straps[i] ?? 96);
    const swayX = s.drag === i ? 0 : -Math.sin((sw * Math.PI) / 180) * strapBase * 0.35;
    const clipX = (s.ox[i] ?? 0) + swayX;
    const clipY = (s.oy[i] ?? 0) - 4 * lift;
    const st = clipY;

    const ry = s.ry[i] ?? 0;
    const rx = s.rx[i] ?? 0;
    const tiltY = s.tiltY[i] ?? 0;
    const totalY = ry + tiltY;

    // Cubic Bezier control points for realistic gravity sag & fold when card moves up-left/up-right
    const ax = g.W / 2;
    const ay = g.pivotY;
    const bx = ax + clipX;
    const by = ay + strapBase + clipY;
    const dx = bx - ax;
    const dy = by - ay;
    const dist = Math.hypot(dx, dy);
    const slack = Math.max(0, strapBase - dist);
    const sag = slack > 0.5 ? Math.sqrt(Math.max(0, strapBase * strapBase - dist * dist)) * 0.58 : 0;
    const sideSign = Math.abs(dx) > 2 ? Math.sign(dx) : (i % 2 === 0 ? 1 : -1);
    const inertiaBow = clamp(-(s.vox[i] ?? 0) * 0.014, -22, 22);

    const c1x = ax + dx * 0.14 + inertiaBow * 0.45;
    const c1y = ay + Math.max(strapBase * 0.28, dy * 0.34 + sag * 0.9);
    const c2x = bx - dx * 0.16 + sideSign * sag * 0.32 + inertiaBow;
    const c2y = by + sag * 0.78 - Math.min(0, dy) * 0.12;

    const pinch = st >= 0 ? 1 - clamp(st / 680, 0, 0.18) : 1 + clamp(-st / 180, 0, 0.08);
    const halfBase = (g.strapW / 2) * pinch;

    const SEG_COUNT = 16;
    const ptsL: { x: number; y: number }[] = [];
    const ptsR: { x: number; y: number }[] = [];
    const ptsC: { x: number; y: number }[] = [];
    const widths: number[] = [];
    const shades: number[] = [];

    for (let k = 0; k <= SEG_COUNT; k++) {
      const t = k / SEG_COUNT;
      const mt = 1 - t;
      const mt2 = mt * mt;
      const t2 = t * t;
      const px = mt2 * mt * ax + 3 * mt2 * t * c1x + 3 * mt * t2 * c2x + t2 * t * bx;
      const py = mt2 * mt * ay + 3 * mt2 * t * c1y + 3 * mt * t2 * c2y + t2 * t * by;

      const dxdt = 3 * mt2 * (c1x - ax) + 6 * mt * t * (c2x - c1x) + 3 * t2 * (bx - c2x);
      const dydt = 3 * mt2 * (c1y - ay) + 6 * mt * t * (c2y - c1y) + 3 * t2 * (by - c2y);
      const tLen = Math.hypot(dxdt, dydt);
      const nx = tLen > 0.001 ? -dydt / tLen : -1;
      const ny = tLen > 0.001 ? dxdt / tLen : 0;

      const segRad = ((totalY * t) * Math.PI) / 180;
      const cosA = Math.abs(Math.cos(segRad));
      const wScale = Math.max(0.18, cosA);
      const hw = halfBase * wScale;

      ptsC.push({ x: px, y: py });
      ptsL.push({ x: px - nx * hw, y: py - ny * hw });
      ptsR.push({ x: px + nx * hw, y: py + ny * hw });
      widths.push(hw);
      shades.push(0.58 + 0.46 * cosA);
    }

    for (let k = 0; k < SEG_COUNT; k++) {
      const seg = twistSegs.current[i * SEG_COUNT + k];
      if (!seg) continue;
      const l0 = ptsL[k]!;
      const r0 = ptsR[k]!;
      const r1 = ptsR[k + 1]!;
      const l1 = ptsL[k + 1]!;
      seg.setAttribute(
        "points",
        `${l0.x.toFixed(1)},${l0.y.toFixed(1)} ${r0.x.toFixed(1)},${r0.y.toFixed(1)} ${r1.x.toFixed(1)},${r1.y.toFixed(1)} ${l1.x.toFixed(1)},${l1.y.toFixed(1)}`
      );
      seg.style.filter = `brightness(${((shades[k]! + shades[k + 1]!) * 0.5).toFixed(2)})`;
    }

    const shadowPath = strapShadows.current[i];
    if (shadowPath) {
      shadowPath.setAttribute(
        "d",
        `M ${(ax + 3 * g.u).toFixed(1)} ${(ay + 4).toFixed(1)} C ${(c1x + 3 * g.u).toFixed(1)} ${(c1y + 4).toFixed(1)}, ${(c2x + 3 * g.u).toFixed(1)} ${(c2y + 4).toFixed(1)}, ${(bx + 3 * g.u).toFixed(1)} ${(by + 4).toFixed(1)}`
      );
    }

    const edgePath = strapEdges.current[i];
    if (edgePath) {
      const leftStr = ptsL.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
      const rightStr = ptsR.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
      edgePath.setAttribute("d", `${leftStr} ${rightStr}`);
    }

    const sheenPath = strapSheens.current[i];
    if (sheenPath) {
      sheenPath.setAttribute(
        "d",
        `M ${ax.toFixed(1)} ${ay.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${bx.toFixed(1)} ${by.toFixed(1)}`
      );
    }

    const swivel = swivels.current[i];
    if (swivel) {
      const startAngle = (Math.atan2(c1x - ax, Math.max(8, c1y - ay)) * -180) / Math.PI;
      swivel.style.transform = `rotate(${clamp(startAngle * 0.55, -28, 28).toFixed(2)}deg)`;
    }

    const endTangentAngle = (Math.atan2(bx - c2x, Math.max(8, by - c2y)) * -180) / Math.PI;
    const tautBlend = clamp(1 - slack / 24, 0, 1);
    const cardAngle = endTangentAngle * 0.35 * tautBlend + ((s.beta[i] ?? 0) - sw) * 0.6 + (s.rz[i] ?? 0);

    const hang = hangs.current[i];
    if (hang) {
      hang.style.transform = `translate3d(${clipX.toFixed(2)}px,${clipY.toFixed(2)}px,0) rotate(${cardAngle.toFixed(3)}deg) scale(${(1 + 0.08 * pop).toFixed(4)})`;
    }
    const flip = flips.current[i];
    const facing = Math.abs(Math.cos((totalY * Math.PI) / 180));
    if (flip) {
      flip.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rx.toFixed(2)}deg) rotateY(${totalY.toFixed(2)}deg)`;
      flip.style.setProperty("--shade", ((1 - facing) * 0.45 + Math.abs(rx) * 0.008).toFixed(3));
      const phi = ((((totalY + 90) % 180) + 180) % 180) - 90;
      flip.style.setProperty("--gx", `${(phi * 0.9 + rx * 0.7).toFixed(1)}%`);
    }
    const shadow = shadows.current[i];
    if (shadow) {
      const pullRatio = clamp(st / 180, 0, 1);
      shadow.style.transform = `translate3d(${(g.W * 0.045 + lift * 3 * g.u - tiltY * 0.6).toFixed(2)}px,${(g.H * 0.03 + lift * 7 * g.u + rx * 0.5 + pullRatio * 8).toFixed(2)}px,0) scale(${(Math.max(0.12, facing) * (1 + 0.03 * lift + 0.05 * pop + pullRatio * 0.06)).toFixed(3)},${(1 + 0.03 * lift + 0.05 * pop + pullRatio * 0.06).toFixed(3)})`;
      shadow.style.opacity = (0.72 + 0.22 * lift + 0.1 * pullRatio).toFixed(3);
    }
  }, []);

  const step = React.useCallback((now: number) => {
    const s = sim.current;
    const L = live.current;
    const n = L.count;
    const g = L.geo;
    const { width, carousel } = L.size;
    const dt = s.last ? Math.min(0.1, (now - s.last) / 1000) : 1 / 60;
    s.last = now;
    // sub-steps of at most ~6 ms keep the springs accurate when frames arrive slowly (60 fps → 3)
    const sub = Math.max(3, Math.ceil(dt / 0.006));
    const h = dt / sub;
    let busy = false;
    for (let k = 0; k < sub; k++) {
      for (let i = 0; i < n; i++) {
        const before = s.vx[i] ?? 0;
        if (i !== s.drag) {
          const restoring = now > s.free;
          const ax = restoring ? -65 * ((s.x[i] ?? 0) - (s.tx[i] ?? 0)) - 2 * Math.sqrt(65) * 0.62 * before : -1.45 * before;
          s.vx[i] = before + ax * h;
          s.x[i] = (s.x[i] ?? 0) + (s.vx[i] ?? 0) * h;
        }
      }
      if (!carousel && n > 0) {
        const [left, right] = stops(s, g.W, width, n);
        if (s.drag >= 0) {
          const d = s.drag;
          for (let j = d - 1; j >= 0; j--) {
            const limit = (s.x[j + 1] ?? 0) - minGap(s, g.W, j, j + 1);
            if ((s.x[j] ?? 0) > limit) { s.x[j] = limit; s.vx[j] = Math.min(s.vx[j] ?? 0, s.vx[j + 1] ?? 0); }
          }
          for (let j = d + 1; j < n; j++) {
            const limit = (s.x[j - 1] ?? 0) + minGap(s, g.W, j - 1, j);
            if ((s.x[j] ?? 0) < limit) { s.x[j] = limit; s.vx[j] = Math.max(s.vx[j] ?? 0, s.vx[j - 1] ?? 0); }
          }
        } else {
          for (let pass = 0; pass < 3; pass++) {
            for (let j = 0; j < n - 1; j++) {
              const a = s.x[j] ?? 0;
              const b = s.x[j + 1] ?? 0;
              const overlap = minGap(s, g.W, j, j + 1) - (b - a);
              if (overlap <= 0) continue;
              s.x[j] = a - overlap / 2;
              s.x[j + 1] = b + overlap / 2;
              const va = s.vx[j] ?? 0;
              const vb = s.vx[j + 1] ?? 0;
              if (va > vb) { const shared = (va + vb) / 2; s.vx[j] = shared; s.vx[j + 1] = shared; }
            }
          }
          if ((s.x[0] ?? 0) < left) { s.x[0] = left; s.vx[0] = Math.abs(s.vx[0] ?? 0) * 0.3; }
          for (let j = 1; j < n; j++) s.x[j] = Math.max(s.x[j] ?? 0, (s.x[j - 1] ?? 0) + minGap(s, g.W, j - 1, j));
          if ((s.x[n - 1] ?? 0) > right) { s.x[n - 1] = right; s.vx[n - 1] = -Math.abs(s.vx[n - 1] ?? 0) * 0.3; }
          for (let j = n - 2; j >= 0; j--) s.x[j] = Math.min(s.x[j] ?? 0, (s.x[j + 1] ?? 0) - minGap(s, g.W, j, j + 1));
        }
      }
      for (let i = 0; i < n; i++) {
        const dv = (s.vx[i] ?? 0) - (s.px[i] ?? 0);
        s.px[i] = s.vx[i] ?? 0;
        if (i !== s.pull) {
          const sw = s.sw[i] ?? 0;
          const tSec = now * 0.001;
          const idleAngle = live.current.reduced
            ? 0
            : Math.sin(tSec * 0.85 + i * 1.3) * 1.45 +
              Math.sin(tSec * 1.37 + i * 0.7) * 0.75;
          const vsw = clamp((s.vsw[i] ?? 0) + (g.couple[i] ?? 0.09) * clamp(dv, -1100, 1100), -180, 180);
          const next = vsw + (-(g.swingK[i] ?? SWING_K) * (sw - idleAngle) - SWING_DAMP * vsw) * h;
          s.vsw[i] = next;
          s.sw[i] = clamp(sw + next * h, -42, 42);
        }
        s.beta[i] = (s.beta[i] ?? 0) + ((s.sw[i] ?? 0) - (s.beta[i] ?? 0)) * Math.min(1, h / LAG);
        spring(s.ry, s.vry, s.tr[i] ?? 0, i, 170, 0.62, h);
        spring(s.rx, s.vrx, s.trx[i] ?? 0, i, 90, 0.42, h);
        spring(s.tiltY, s.vtiltY, s.ttiltY[i] ?? 0, i, 18, 0.3, h);
        spring(s.rz, s.vrz, s.tz[i] ?? 0, i, 120, 0.8, h);
        spring(s.lift, s.vlift, s.tl[i] ?? 0, i, 200, 0.75, h);
        spring(s.pop, s.vpop, s.tp[i] ?? 0, i, 160, 0.55, h);
        if (i !== s.drag && i !== s.pull) {
          spring(s.ox, s.vox, 0, i, 34, 0.24, h);
          const slack = (s.oy[i] ?? 0) < 0;
          spring(s.oy, s.voy, 0, i, slack ? 24 : REEL_K, slack ? 0.25 : REEL_ZETA, h);
          const topStop = -(g.straps[i] ?? 96) - 18;
          if ((s.oy[i] ?? 0) < topStop) {
            s.oy[i] = topStop;
            s.voy[i] = Math.abs(s.voy[i] ?? 0) * 0.45;
          }
          s.st[i] = s.oy[i] ?? 0;
        }
        if (i !== s.pull) {
          const slack = (s.st[i] ?? 0) < 0;
          spring(s.st, s.vst, 0, i, slack ? 20 : REEL_K, slack ? 0.25 : REEL_ZETA, h);
          const topStop = -48 * g.u;
          if ((s.st[i] ?? 0) < topStop) {
            s.st[i] = topStop;
            if ((s.vst[i] ?? 0) < -35) {
              s.vst[i] = Math.abs(s.vst[i] ?? 0) * 0.65;
            } else {
              s.vst[i] = 0;
            }
          }
        }
      }
      for (let a = 0; a < n - 1; a++) {
        const b = a + 1;
        if ((s.x[b] ?? 0) <= (s.x[a] ?? 0)) continue;
        const [aTop, aBottom, aArmTop, aArmBottom] = cardEdge(s, g, a, 1);
        const [bTop, bBottom, bArmTop, bArmBottom] = cardEdge(s, g, b, -1);
        const topExcess = aTop - bTop + 2;
        const bottomExcess = aBottom - bBottom + 2;
        const excess = Math.max(topExcess, bottomExcess);
        if (excess <= 0) continue;
        const arm = Math.max(40, topExcess > bottomExcess ? (aArmTop + bArmTop) / 2 : (aArmBottom + bArmBottom) / 2);
        const push = (Math.asin(clamp(excess / arm, 0, 1)) * 180) / Math.PI;
        const share = a === s.pull ? 0 : b === s.pull ? 1 : 0.5;
        s.sw[a] = clamp((s.sw[a] ?? 0) + push * share, -18, 18);
        s.beta[a] = (s.beta[a] ?? 0) + push * share;
        s.sw[b] = clamp((s.sw[b] ?? 0) - push * (1 - share), -18, 18);
        s.beta[b] = (s.beta[b] ?? 0) - push * (1 - share);
        const va = s.vsw[a] ?? 0;
        const vb = s.vsw[b] ?? 0;
        if (vb - va > 0) {
          const mean = (va + vb) / 2;
          if (a !== s.pull) s.vsw[a] = mean + (vb - va) * 0.15;
          if (b !== s.pull) s.vsw[b] = mean - (vb - va) * 0.15;
        }
      }
    }
    for (let i = 0; i < n; i++) {
      paint(i);
      if (
        Math.abs(s.vx[i] ?? 0) > 0.4 || (now > s.free && Math.abs((s.x[i] ?? 0) - (s.tx[i] ?? 0)) > 0.25) ||
        Math.abs((s.ry[i] ?? 0) - (s.tr[i] ?? 0)) > 0.05 || Math.abs(s.vry[i] ?? 0) > 0.05 ||
        Math.abs((s.rx[i] ?? 0) - (s.trx[i] ?? 0)) > 0.05 || Math.abs(s.vrx[i] ?? 0) > 0.05 ||
        Math.abs((s.tiltY[i] ?? 0) - (s.ttiltY[i] ?? 0)) > 0.05 || Math.abs(s.vtiltY[i] ?? 0) > 0.05 ||
        Math.abs((s.rz[i] ?? 0) - (s.tz[i] ?? 0)) > 0.02 || Math.abs(s.vrz[i] ?? 0) > 0.05 ||
        Math.abs((s.lift[i] ?? 0) - (s.tl[i] ?? 0)) > 0.002 || Math.abs(s.vlift[i] ?? 0) > 0.01 ||
        Math.abs((s.pop[i] ?? 0) - (s.tp[i] ?? 0)) > 0.002 || Math.abs(s.vpop[i] ?? 0) > 0.01 ||
        Math.abs(s.sw[i] ?? 0) > 0.02 || Math.abs(s.vsw[i] ?? 0) > 0.05 || Math.abs((s.beta[i] ?? 0) - (s.sw[i] ?? 0)) > 0.01 ||
        Math.abs(s.ox[i] ?? 0) > 0.1 || Math.abs(s.vox[i] ?? 0) > 0.2 ||
        Math.abs(s.oy[i] ?? 0) > 0.1 || Math.abs(s.voy[i] ?? 0) > 0.2 ||
        Math.abs(s.st[i] ?? 0) > 0.05 || Math.abs(s.vst[i] ?? 0) > 0.1
      ) busy = true;
    }
    if (s.drag >= 0 || s.pull >= 0 || now < s.free || !live.current.reduced) busy = true;
    if (busy) s.raf = requestAnimationFrame(step);
    else {
      s.raf = 0;
      s.last = 0;
      for (let i = 0; i < n; i++) {
        if (now > s.free) { s.x[i] = s.tx[i] ?? 0; s.vx[i] = 0; s.px[i] = 0; }
        s.ox[i] = 0; s.vox[i] = 0; s.oy[i] = 0; s.voy[i] = 0;
        s.sw[i] = 0; s.vsw[i] = 0; s.beta[i] = 0; s.st[i] = 0; s.vst[i] = 0;
        s.ry[i] = s.tr[i] ?? 0; s.vry[i] = 0;
        s.rx[i] = s.trx[i] ?? 0; s.vrx[i] = 0;
        s.tiltY[i] = s.ttiltY[i] ?? 0; s.vtiltY[i] = 0;
        s.rz[i] = s.tz[i] ?? 0; s.vrz[i] = 0;
        s.lift[i] = s.tl[i] ?? 0; s.vlift[i] = 0; s.pop[i] = s.tp[i] ?? 0; s.vpop[i] = 0;
        paint(i);
      }
    }
  }, [paint]);

  const snap = React.useCallback(() => {
    const s = sim.current;
    for (let i = 0; i < live.current.count; i++) {
      s.x[i] = s.tx[i] ?? 0; s.vx[i] = 0; s.px[i] = 0;
      s.sw[i] = 0; s.vsw[i] = 0; s.beta[i] = 0;
      if (i !== s.pull) { s.st[i] = 0; s.vst[i] = 0; }
      s.ry[i] = s.tr[i] ?? 0; s.vry[i] = 0; s.rz[i] = s.tz[i] ?? 0; s.vrz[i] = 0;
      s.lift[i] = s.tl[i] ?? 0; s.vlift[i] = 0; s.pop[i] = s.tp[i] ?? 0; s.vpop[i] = 0;
      paint(i);
    }
  }, [paint]);

  const kick = React.useCallback(() => {
    const s = sim.current;
    if (live.current.reduced) { cancelAnimationFrame(s.raf); s.raf = 0; snap(); return; }
    if (!s.raf) { s.last = 0; s.raf = requestAnimationFrame(step); }
  }, [snap, step]);

  const impulse = React.useCallback((i: number, amount: number) => {
    const s = sim.current;
    if (live.current.reduced || i < 0 || i >= live.current.count) return;
    s.vsw[i] = (s.vsw[i] ?? 0) + amount;
    kick();
  }, [kick]);

  const tug = React.useCallback((i: number, amount: number) => {
    const s = sim.current;
    if (live.current.reduced || i < 0 || i >= live.current.count) return;
    s.vst[i] = (s.vst[i] ?? 0) + amount;
    kick();
  }, [kick]);

  React.useLayoutEffect(() => {
    if (!size.width) return;
    const s = sim.current;
    const L = live.current;
    const center = size.carousel ? (active ?? L.carouselIndex) : null;
    const { xs, total } = layoutTargets(size.width, size.W, size.carousel, center, count);
    L.cyclic = total > 0;
    const fresh = s.x.length !== count || s.carousel !== size.carousel;
    s.carousel = size.carousel;
    for (let i = 0; i < count; i++) {
      const tx = (xs[i] ?? 0) + (size.carousel ? pointer.current.swipe : 0);
      if (!fresh && total > 0) {
        const shift = Math.round((tx - (s.tx[i] ?? tx)) / total) * total;
        if (shift) s.x[i] = (s.x[i] ?? 0) + shift;
      }
      s.tx[i] = tx;
      const front = flipped === i || active === i;
      s.tr[i] = flipped === i ? 180 : active === i ? 0 : REST_Y[i % REST_Y.length] ?? 0;
      s.tz[i] = front ? 0 : REST_Z[i % REST_Z.length] ?? 0;
      s.tl[i] = front ? 1 : 0;
      s.tp[i] = flipped === i ? 1 : 0;
      if (fresh) {
        s.x[i] = tx; s.vx[i] = 0; s.px[i] = 0; s.ox[i] = 0; s.vox[i] = 0; s.oy[i] = 0; s.voy[i] = 0; s.sw[i] = 0; s.vsw[i] = 0; s.beta[i] = 0; s.st[i] = 0; s.vst[i] = 0;
        s.ry[i] = s.tr[i] ?? 0; s.vry[i] = 0;
        s.rx[i] = s.trx[i] ?? 0; s.vrx[i] = 0;
        s.tiltY[i] = s.ttiltY[i] ?? 0; s.vtiltY[i] = 0;
        s.rz[i] = s.tz[i] ?? 0; s.vrz[i] = 0;
        s.lift[i] = s.tl[i] ?? 0; s.vlift[i] = 0; s.pop[i] = s.tp[i] ?? 0; s.vpop[i] = 0;
      }
    }
    for (const key of ["x", "vx", "px", "tx", "ox", "vox", "oy", "voy", "sw", "vsw", "beta", "ry", "vry", "tr", "rz", "vrz", "tz", "lift", "vlift", "tl", "pop", "vpop", "tp", "st", "vst"] as const) s[key].length = count;
    if (fresh) for (let i = 0; i < count; i++) paint(i);
    kick();
  }, [size, active, flipped, count, paint, kick]);

  React.useEffect(() => { if (reduced) kick(); }, [reduced, kick]);

  React.useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    let lastT = performance.now();
    const onScroll = () => {
      const L = live.current;
      if (L.reduced) return;
      const now = performance.now();
      const y = window.scrollY;
      const dy = y - lastY;
      const dt = Math.max(8, now - lastT);
      lastY = y;
      lastT = now;
      if (Math.abs(dy) < 1.5) return;

      const vy = clamp(dy / dt, -3.2, 3.2);
      const s = sim.current;
      for (let i = 0; i < L.count; i++) {
        if (i === s.pull || i === s.drag) continue;
        const dir = i % 2 === 0 ? 1 : -1;
        s.vsw[i] = clamp(
          (s.vsw[i] ?? 0) + vy * 18 * dir + (Math.random() - 0.5) * 4,
          -150,
          150
        );
        s.vst[i] = clamp((s.vst[i] ?? 0) - vy * 22, -160, 160);
        s.vrx[i] = clamp((s.vrx[i] ?? 0) + vy * 26, -130, 130);
        s.vtiltY[i] = clamp((s.vtiltY[i] ?? 0) + vy * 14 * dir, -110, 110);
      }
      kick();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [kick]);

  const swayed = React.useRef(false);
  const ready = size.width > 0;
  React.useEffect(() => {
    if (!ready || reduced || swayed.current) return;
    const timers = Array.from({ length: count }, (_, i) => window.setTimeout(() => impulse(i, (i % 2 ? -1 : 1) * (30 - (i % 4) * 3)), 60 + i * 70));
    const done = window.setTimeout(() => { swayed.current = true; }, 80 + count * 70);
    return () => { timers.forEach((t) => window.clearTimeout(t)); window.clearTimeout(done); };
  }, [ready, reduced, count, impulse]);

  React.useEffect(() => () => { cancelAnimationFrame(sim.current.raf); sim.current.raf = 0; }, []);

  const previous = React.useRef({ active: null as number | null, flipped: null as number | null });
  React.useEffect(() => {
    const old = previous.current;
    const wrap = (i: number) => (live.current.cyclic ? ((i % count) + count) % count : i);
    if (old.active !== active) {
      if (active !== null) { impulse(wrap(active - 1), 16); impulse(wrap(active + 1), -16); }
      if (old.active !== null) { impulse(wrap(old.active - 1), -6); impulse(wrap(old.active + 1), 6); }
    }
    if (old.flipped !== flipped) {
      if (flipped !== null) { impulse(flipped, flipped % 2 ? 9 : -9); tug(flipped, 70); }
      if (old.flipped !== null) tug(old.flipped, 40);
    }
    previous.current = { active, flipped };
  }, [active, flipped, count, impulse, tug]);

  const stop = React.useCallback(() => setPlaying(false), []);

  React.useEffect(() => {
    if (!playing || reduced || count === 0 || !ready) return;
    let timer = 0;
    function front(index: number) {
      setActive(index);
      timer = window.setTimeout(() => flip(index), FLIP_DELAY);
    }
    function flip(index: number) {
      setFlipped(index);
      timer = window.setTimeout(() => { setFlipped(null); front((index + 1) % Math.max(1, live.current.count)); }, interval);
    }
    const current = live.current.active;
    timer = current === null ? window.setTimeout(() => front(0), FIRST_DELAY) : window.setTimeout(() => flip(current), FLIP_DELAY);
    return () => window.clearTimeout(timer);
  }, [playing, reduced, count, ready, interval, setActive, setFlipped]);

  React.useEffect(() => {
    if (flipped === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const stage = stageRef.current;
      if (stage && event.target instanceof Node && stage.contains(event.target)) return;
      setFlipped(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [flipped, setFlipped]);

  const toggle = React.useCallback((index: number) => {
    stop();
    const next = live.current.flipped === index ? null : index;
    if (next !== null) setActive(index);
    setFlipped(next);
  }, [stop, setActive, setFlipped]);

  const retarget = () => {
    const s = sim.current;
    const L = live.current;
    const { xs } = layoutTargets(L.size.width, L.size.W, L.size.carousel, L.size.carousel ? (L.active ?? L.carouselIndex) : null, L.count);
    for (let i = 0; i < L.count; i++) s.tx[i] = (xs[i] ?? 0) + (L.size.carousel ? pointer.current.swipe : 0);
    if (L.reduced) snap();
    else kick();
  };

  const feasible = (d: number) => {
    const s = sim.current;
    const L = live.current;
    const W = L.geo.W;
    const n = L.count;
    let [lo, hi] = stops(s, W, L.size.width, n);
    for (let k = 0; k < d; k++) lo += minGap(s, W, k, k + 1);
    for (let k = n - 1; k > d; k--) hi -= minGap(s, W, k - 1, k);
    return [lo, Math.max(lo, hi)] as const;
  };

  const nearest = (clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return null;
    const box = stage.getBoundingClientRect();
    const x = clientX - box.left;
    const y = clientY - box.top;
    const g = live.current.geo;
    const s = sim.current;
    let best = null as number | null;
    let distance = Infinity;
    for (let i = 0; i < live.current.count; i++) {
      const cardTop = (g.cardTops[i] ?? 0) + (s.oy[i] ?? 0);
      if (y < cardTop - 28 || y > cardTop + g.H + 16) continue;
      const d = Math.abs(x - ((s.x[i] ?? 0) + (s.ox[i] ?? 0)));
      if (d < g.W / 2 + 12 && d < distance) { best = i; distance = d; }
    }
    return best;
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const p = pointer.current;
    const s = sim.current;
    const L = live.current;
    const stage = stageRef.current;
    const now = performance.now();
    if (p.id === event.pointerId && stage) {
      const dx = event.clientX - p.x;
      const dy = event.clientY - p.y;
      if (!p.mode && Math.hypot(dx, dy) > 6) {
        if (L.size.carousel) {
          p.mode = Math.abs(dy) > Math.abs(dx) ? (dy > 0 && p.index >= 0 ? "pull" : "none") : "swipe";
        } else {
          p.mode = p.index >= 0 && !L.reduced ? "free" : p.index >= 0 && dy > 0 ? "pull" : "none";
        }
        if (p.mode !== "none") {
          stop();
          if (stage.isConnected) stage.setPointerCapture(event.pointerId);
        }
        if (p.mode === "pull") {
          s.pull = p.index;
          playLanyardGrabSound();
        }
        if (p.mode === "free") {
          s.pull = p.index;
          s.drag = p.index;
          s.grab = event.clientX - stage.getBoundingClientRect().left - (s.x[p.index] ?? 0);
          playLanyardGrabSound();
        }
      }
      const elapsed = Math.max(1, now - p.lastT);
      p.v = p.v * 0.55 + ((event.clientX - p.lastX) / elapsed) * 0.45;
      p.vy = p.vy * 0.55 + ((event.clientY - p.lastY) / elapsed) * 0.45;
      p.lastX = event.clientX;
      p.lastY = event.clientY;
      p.lastT = now;
      if (p.mode === "free" && s.drag >= 0) {
        const i = s.drag;
        const rawOx = p.startOx + dx;
        const rawOy = p.startOy + dy;
        const strapLen = L.geo.straps[i] ?? 96;
        const maxUp = -strapLen - 18;
        const clampedOx = clamp(rawOx, -170, 170);
        const clampedOy = rawOy >= 0 ? soft(rawOy, L.geo.maxStretch) : clamp(rawOy, maxUp, 0);
        s.ox[i] = clampedOx;
        s.oy[i] = clampedOy;
        s.st[i] = clampedOy;
        s.vox[i] = p.v * 1000;
        s.voy[i] = p.vy * 1000;
        s.vst[i] = 0;
        if (!seamless) {
          const [lo, hi] = feasible(i);
          s.x[i] = clamp(event.clientX - stage.getBoundingClientRect().left - s.grab, lo, hi);
          s.vx[i] = p.v * 1000;
        }
        const angle = clamp((-Math.atan2(clampedOx, Math.max(40, strapLen + clampedOy)) * 180) / Math.PI, -38, 38);
        s.vsw[i] = ((angle - (s.sw[i] ?? 0)) / elapsed) * 1000 * 0.45;
        s.sw[i] = angle;
        s.trx[i] = clamp(dy * 0.14, -22, 22);
        const pullRatio = clamp(Math.max(0, clampedOy) / Math.max(1, L.geo.maxStretch), 0, 1);
        const twistBias = (i % 2 === 0 ? 1 : -1) * pullRatio * 28;
        s.ttiltY[i] = clamp(-p.v * 30 + twistBias, -48, 48);
        s.free = now + 1850;
        const speed = Math.hypot(p.v, p.vy);
        if (speed > 0.35) {
          playLanyardSwingSound(clamp(speed, 0.35, 1.4));
        }
        kick();
      } else if (p.mode === "pull") {
        const i = p.index;
        s.st[i] = soft(Math.max(0, dy), L.geo.maxStretch);
        s.vst[i] = 0;
        s.trx[i] = clamp(dy * 0.14, -22, 22);
        const pullRatio = clamp((s.st[i] ?? 0) / Math.max(1, L.geo.maxStretch), 0, 1);
        s.ttiltY[i] = (i % 2 === 0 ? 1 : -1) * pullRatio * 24;
        const angle = clamp((-Math.atan2(dx, (L.geo.pendulum[i] ?? 200) + (s.st[i] ?? 0)) * 180) / Math.PI, -36, 36);
        s.vsw[i] = ((angle - (s.sw[i] ?? 0)) / elapsed) * 1000 * 0.5;
        s.sw[i] = angle;
        const speed = Math.hypot(p.v, p.vy);
        if (speed > 0.35) {
          playLanyardSwingSound(clamp(speed, 0.35, 1.4));
        }
        if (L.reduced) paint(i);
        else kick();
      } else if (p.mode === "swipe") {
        p.swipe = dx;
        retarget();
      }
      return;
    }
    if (event.pointerType !== "mouse" || p.id >= 0) return;
    const hit = nearest(event.clientX, event.clientY);
    const hoverV = (event.clientX - p.hoverX) / Math.max(1, now - p.hoverT);
    p.hoverX = event.clientX;
    p.hoverT = now;
    if (L.size.carousel) {
      const center = L.active ?? L.carouselIndex;
      if (hit !== null && hit === center && L.active !== hit) { stop(); setActive(hit); }
      return;
    }
    if (hit !== null && hit !== p.hoverHit) {
      impulse(hit, clamp(-hoverV * 22, -24, 24));
      if (Math.abs(hoverV) > 0.45) {
        playLanyardSwingSound(0.35);
      }
    }
    p.hoverHit = hit ?? -1;
    if (hit !== null && stage && !L.reduced) {
      const box = stage.getBoundingClientRect();
      const cardCenterX = s.x[hit] ?? box.width / 2;
      const cardCenterY = (L.geo.cardTops[hit] ?? 0) + L.geo.H / 2 + (s.st[hit] ?? 0);
      const nx = clamp((event.clientX - box.left - cardCenterX) / (L.geo.W / 2), -1, 1);
      const ny = clamp((event.clientY - box.top - cardCenterY) / (L.geo.H / 2), -1, 1);
      s.trx[hit] = -ny * 14;
      s.ttiltY[hit] = nx * 28;
      kick();
    } else if (hit === null) {
      for (let k = 0; k < L.count; k++) {
        if ((s.trx[k] ?? 0) !== 0 || (s.ttiltY[k] ?? 0) !== 0) {
          s.trx[k] = 0;
          s.ttiltY[k] = 0;
          kick();
        }
      }
    }
    if (hit !== null && hit !== L.active) { stop(); setActive(hit); }
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return;
    const hit = nearest(event.clientX, event.clientY);
    const now = performance.now();
    pendingOpen.current = -1;
    const s = sim.current;
    pointer.current = {
      ...pointer.current,
      id: event.pointerId,
      index: hit ?? -1,
      x: event.clientX,
      y: event.clientY,
      startOx: hit !== null ? (s.ox[hit] ?? 0) : 0,
      startOy: hit !== null ? (s.oy[hit] ?? 0) : 0,
      mode: "",
      kind: event.pointerType,
      lastX: event.clientX,
      lastY: event.clientY,
      lastT: now,
      v: 0,
      vy: 0,
      swipe: 0,
    };
  };

  const finishPointer = (event: React.PointerEvent, cancelled: boolean) => {
    const p = pointer.current;
    if (p.id !== event.pointerId) return;
    const s = sim.current;
    const L = live.current;
    const stage = stageRef.current;
    if (stage?.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    pointer.current = { ...p, id: -1 };
    if (p.mode === "free") {
      const i = s.pull >= 0 ? s.pull : s.drag;
      if (i >= 0) {
        const pulled = Math.max(0, s.oy[i] ?? 0);
        const pullRatio = clamp(pulled / Math.max(1, L.geo.maxStretch), 0, 1);
        const dir = Math.abs(p.v) > 0.04 ? Math.sign(p.v) : (i % 2 === 0 ? 1 : -1);
        const twistKick = pulled > 28 ? dir * (360 + pullRatio * 960) : 0;
        s.vox[i] = clamp(p.v * 1150, -1400, 1400);
        s.voy[i] = clamp(p.vy * 950 - pullRatio * 140, -900, 1100);
        s.vx[i] = seamless ? 0 : clamp(p.v * 1150, -1400, 1400);
        s.vst[i] = clamp(p.vy * 950 - pullRatio * 140, -900, 1100);
        const swayBoost = Math.abs(p.v) < 0.08 ? dir * pullRatio * 22 : 0;
        s.vsw[i] = (s.vsw[i] ?? 0) + clamp(-p.v * 135, -180, 180) + swayBoost;
        s.vtiltY[i] = (s.vtiltY[i] ?? 0) + clamp(p.v * 280, -320, 320) + twistKick;
        s.vrx[i] = (s.vrx[i] ?? 0) + clamp(-p.vy * 180, -180, 180) + pullRatio * 85;
        s.trx[i] = 0;
        s.ttiltY[i] = 0;
      }
      s.pull = -1;
      s.drag = -1;
      s.free = performance.now() + 1850;
      playLanyardSwingSound(Math.max(0.55, Math.hypot(p.v, p.vy)));
      kick();
      return;
    }
    if (p.mode === "pull") {
      const i = s.pull;
      s.pull = -1;
      if (L.reduced) { s.st[i] = 0; s.vst[i] = 0; s.sw[i] = 0; s.vsw[i] = 0; s.beta[i] = 0; paint(i); }
      else {
        if (i >= 0) {
          const pulled = s.st[i] ?? 0;
          const pullRatio = clamp(pulled / Math.max(1, L.geo.maxStretch), 0, 1);
          const dir = Math.abs(p.v) > 0.04 ? Math.sign(p.v) : (i % 2 === 0 ? 1 : -1);
          const twistKick = pulled > 28 ? dir * (360 + pullRatio * 960) : 0;
          s.vst[i] = clamp(p.vy * 950 - pullRatio * 140, -900, 1100);
          s.vsw[i] = (s.vsw[i] ?? 0) + clamp(-p.v * 135, -180, 180) + dir * pullRatio * 22;
          s.vtiltY[i] = (s.vtiltY[i] ?? 0) + clamp(p.v * 280, -320, 320) + twistKick;
          s.vrx[i] = (s.vrx[i] ?? 0) + clamp(-p.vy * 180, -180, 180) + pullRatio * 85;
          s.trx[i] = 0;
          s.ttiltY[i] = 0;
        }
        playLanyardSwingSound(Math.max(0.5, Math.hypot(p.v, p.vy)));
        kick();
      }
      return;
    }
    if (p.mode === "drag") {
      s.drag = -1;
      s.free = performance.now() + 700;
      kick();
      return;
    }
    if (p.mode === "swipe") {
      const dx = event.clientX - p.x;
      const n = L.count;
      const current = L.active ?? L.carouselIndex;
      const by = Math.abs(dx) > 40 || Math.abs(p.v) > 0.45 ? (dx < 0 ? 1 : -1) : 0;
      pointer.current.swipe = 0;
      const next = L.cyclic ? (((current + by) % n) + n) % n : clamp(current + by, 0, n - 1);
      if (next === L.active) retarget();
      else setActive(next);
      return;
    }
    if (cancelled || p.mode || p.index < 0) return;
    stop();
    if ((p.kind !== "mouse" || L.size.carousel) && L.active !== p.index) setActive(p.index);
    else pendingOpen.current = p.index;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const L = live.current;
    if (event.key === "Escape") {
      if (L.flipped !== null) { event.preventDefault(); setFlipped(null); }
      return;
    }
    const target = event.target instanceof HTMLElement ? event.target : null;
    const badge = target?.dataset.badge;
    if (event.key === "ArrowDown") {
      if (badge === undefined) return;
      event.preventDefault();
      stop();
      tug(Number(badge), 300);
      return;
    }
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    stop();
    const from = L.active ?? focusIndex;
    const next = event.key === "Home" ? 0 : event.key === "End" ? L.count - 1 : clamp(from + (event.key === "ArrowRight" ? 1 : -1), 0, L.count - 1);
    setFocusIndex(next);
    setActive(next);
    buttons.current[next]?.focus({ preventScroll: true });
  };

  const g = geo;
  const W = g.W;
  const base = W / EM;
  const current = active ?? flipped;
  const person = current === null ? null : items[current] ?? null;
  const showingBack = current !== null && current === flipped;
  const centerIndex = size.carousel ? (active ?? live.current.carouselIndex) : null;
  const line1 = person ? `${person.name} — ${person.role}` : caption;
  const line2 = person ? (showingBack ? labels.back : labels.flip) : "";

  return (
    <section
      {...rest}
      data-slot="team-lanyard-rail"
      data-mode={size.carousel ? "carousel" : "rail"}
      data-active={active ?? ""}
      data-flipped={flipped ?? ""}
      className={`relative isolate w-full text-foreground ${seamless ? "overflow-visible bg-transparent" : "overflow-hidden bg-background"} ${className ?? ""}`}
    >
      {!seamless && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(closest-side at 50% 46%, color-mix(in oklab, var(--color-foreground) 7%, transparent), transparent)" }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(color-mix(in oklab, var(--color-foreground) 8%, transparent) 1px, transparent 1.3px) 0 0 / 18px 18px", maskImage: "radial-gradient(closest-side at 50% 50%, black 55%, transparent)", WebkitMaskImage: "radial-gradient(closest-side at 50% 50%, black 55%, transparent)" }} />
        </>
      )}
      {(eyebrow || heading) && (
        <header className="relative z-10 flex flex-col items-center gap-2 px-6 pt-7 text-center">
          {eyebrow && <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p>}
          {heading && <h2 className="text-balance text-2xl font-medium tracking-tight md:text-3xl">{heading}</h2>}
        </header>
      )}

      <div
        ref={stageRef}
        data-stage
        role="group"
        aria-label={heading ?? "Team"}
        aria-roledescription="lanyard rail"
        className={`relative w-full touch-none select-none ${seamless ? "" : "mt-4"}`}
        style={{ height: g.height, overflow: seamless ? "visible" : undefined, overflowX: seamless ? undefined : "clip" }}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={(event) => finishPointer(event, false)}
        onPointerCancel={(event) => finishPointer(event, true)}
        onPointerLeave={(event) => {
          pointer.current.hoverHit = -1;
          for (let k = 0; k < live.current.count; k++) {
            sim.current.trx[k] = 0;
            sim.current.ttiltY[k] = 0;
          }
          kick();
          if (event.pointerType === "mouse" && pointer.current.id < 0 && !size.carousel && !document.activeElement?.matches("[data-badge]:focus-visible")) setActive(null);
        }}
        onKeyDown={onKeyDown}
      >
        {!seamless && (
          <div aria-hidden="true" data-rail className="pointer-events-none absolute inset-x-0 z-0" style={{ top: g.railY - g.railR, height: g.railR * 2 }}>
            <div className="absolute inset-x-0 h-3 rounded-full bg-foreground/10 blur-[5px]" style={{ top: g.railR * 2 + 2 }} />
            <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(to bottom, color-mix(in oklab, var(--color-muted-foreground) 35%, white) 0%, white 20%, color-mix(in oklab, var(--color-muted-foreground) 70%, white) 40%, var(--color-muted-foreground) 64%, color-mix(in oklab, var(--color-muted-foreground) 55%, black) 100%)", boxShadow: "0 1px 0 color-mix(in oklab, var(--color-foreground) 18%, transparent)" }} />
            <div className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay" style={{ background: "repeating-linear-gradient(90deg, transparent 0 2px, color-mix(in oklab, white 40%, transparent) 2px 3px, transparent 3px 7px)" }} />
            {!size.carousel && [0, 1].map((side) => (
              <div key={side} className="absolute top-1/2 h-7 w-4 -translate-y-1/2 rounded-[3px]" style={{ [side ? "right" : "left"]: 6, background: "linear-gradient(to right, color-mix(in oklab, var(--color-muted-foreground) 60%, white), var(--color-muted-foreground) 55%, color-mix(in oklab, var(--color-muted-foreground) 60%, black))", boxShadow: "0 3px 6px color-mix(in oklab, var(--color-foreground) 18%, transparent)" }}>
                <span className="absolute left-1/2 top-1 size-1 -translate-x-1/2 rounded-full bg-foreground/35" />
                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-foreground/35" />
              </div>
            ))}
          </div>
        )}

        {items.map((item, i) => {
          const tone = TONES[((item.tone ?? (i % 5) + 1) - 1) % TONES.length] ?? TONES[0];
          const isActive = active === i;
          const isFlipped = flipped === i;
          const strap = g.straps[i] ?? 0;
          const clipTop = g.clipTops[i] ?? 0;
          const cardOffset = (g.cardTops[i] ?? 0) - clipTop;
          return (
            <div
              key={item.id}
              ref={(node) => { slots.current[i] = node; }}
              data-lanyard={i}
              className={`pointer-events-none absolute left-0 top-0 ${tone}`}
              style={{ width: W, height: g.height, zIndex: isFlipped ? 40 : isActive ? 30 : 10 + i, transform: `translate3d(${((sim.current.x[i] ?? 0) - W / 2).toFixed(2)}px,0,0)` }}
            >
              {/* HD Brushed Titanium Top Ring */}
              <span
                aria-hidden="true"
                className="absolute block rounded-full"
                style={{
                  left: W / 2 - 4.5 * g.u,
                  top: g.railY - g.ring,
                  width: 9 * g.u,
                  height: g.ring * 2,
                  border: `${Math.max(1.8, 2.4 * g.u).toFixed(2)}px solid #d4d4d8`,
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.85), inset 0 -1px 1px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.4)",
                }}
              />
              <span ref={(node) => { swings.current[i] = node; }} data-swing className="absolute inset-0 block">
                <span ref={(node) => { straps.current[i] = node; }} data-strap aria-hidden="true" className="absolute inset-0 block">
                  {/* Dynamic Bending 3D Satin Ribbon Strap */}
                  <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
                    <defs>
                      <linearGradient id={`${uid}-ribbon-${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#09090b" />
                        <stop offset="18%" stopColor="#27272a" />
                        <stop offset="38%" stopColor="var(--accent-dark)" />
                        <stop offset="50%" stopColor="var(--accent-bright)" />
                        <stop offset="62%" stopColor="var(--accent-mid)" />
                        <stop offset="82%" stopColor="#27272a" />
                        <stop offset="100%" stopColor="#09090b" />
                      </linearGradient>
                    </defs>
                    <path
                      ref={(node) => { strapShadows.current[i] = node; }}
                      fill="none"
                      stroke="rgba(0,0,0,0.38)"
                      strokeWidth={g.strapW}
                      strokeLinecap="round"
                      style={{ filter: "blur(2.5px)" }}
                      d={`M ${(W / 2 + 3 * g.u).toFixed(1)} ${(g.pivotY + 4).toFixed(1)} L ${(W / 2 + 3 * g.u).toFixed(1)} ${(g.pivotY + strap + 4).toFixed(1)}`}
                    />
                    {Array.from({ length: 16 }, (_, k) => {
                      const y0 = g.pivotY + (strap * k) / 16;
                      const y1 = g.pivotY + (strap * (k + 1)) / 16;
                      const hw = g.strapW / 2;
                      return (
                        <polygon
                          key={k}
                          ref={(node) => { twistSegs.current[i * 16 + k] = node; }}
                          fill={`url(#${uid}-ribbon-${i})`}
                          points={`${(W / 2 - hw).toFixed(1)},${y0.toFixed(1)} ${(W / 2 + hw).toFixed(1)},${y0.toFixed(1)} ${(W / 2 + hw).toFixed(1)},${y1.toFixed(1)} ${(W / 2 - hw).toFixed(1)},${y1.toFixed(1)}`}
                        />
                      );
                    })}
                    <path
                      ref={(node) => { strapEdges.current[i] = node; }}
                      fill="none"
                      stroke="rgba(0,0,0,0.52)"
                      strokeWidth="1"
                      strokeLinejoin="round"
                      d={`M ${(W / 2 - g.strapW / 2).toFixed(1)} ${g.pivotY.toFixed(1)} L ${(W / 2 - g.strapW / 2).toFixed(1)} ${(g.pivotY + strap).toFixed(1)} M ${(W / 2 + g.strapW / 2).toFixed(1)} ${g.pivotY.toFixed(1)} L ${(W / 2 + g.strapW / 2).toFixed(1)} ${(g.pivotY + strap).toFixed(1)}`}
                    />
                    <path
                      ref={(node) => { strapSheens.current[i] = node; }}
                      fill="none"
                      stroke="rgba(255,255,255,0.22)"
                      strokeWidth={Math.max(1.2, g.strapW * 0.22)}
                      strokeLinecap="round"
                      d={`M ${(W / 2).toFixed(1)} ${g.pivotY.toFixed(1)} L ${(W / 2).toFixed(1)} ${(g.pivotY + strap).toFixed(1)}`}
                    />
                  </svg>
                  {/* HD Brushed Steel Swivel Loop */}
                  <svg
                    ref={(node) => { swivels.current[i] = node; }}
                    aria-hidden="true"
                    className="absolute overflow-visible drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
                    style={{ left: W / 2 - g.strapW * 0.78, top: g.pivotY - 4 * g.u, width: g.strapW * 1.56, height: 8.5 * g.u, transformOrigin: "50% 50%" }}
                    viewBox="0 0 32 16"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id={`${uid}-chrome`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#52525b" />
                        <stop offset="30%" stopColor="#f4f4f5" />
                        <stop offset="60%" stopColor="#71717a" />
                        <stop offset="85%" stopColor="#e4e4e7" />
                        <stop offset="100%" stopColor="#27272a" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="3" width="28" height="10" rx="5" fill="none" stroke={`url(#${uid}-chrome)`} strokeWidth="3.2" />
                    <path d="M7 4.5 H25" stroke="white" strokeOpacity="0.7" strokeWidth="0.9" />
                  </svg>
                </span>
                <span ref={(node) => { hangs.current[i] = node; }} data-hang className="absolute left-0 block" style={{ top: clipTop, width: W, height: cardOffset + g.H, transformOrigin: `${W / 2}px 0px` }}>
                  <span aria-hidden="true" className="absolute left-0 block" style={{ top: cardOffset, width: W, height: g.H, filter: `blur(${Math.max(4, 8 * g.u).toFixed(1)}px)` }}>
                    <span ref={(node) => { shadows.current[i] = node; }} data-shadow className="absolute inset-0 block rounded-[10px] bg-black/25 dark:bg-black/70" />
                  </span>
                  <button
                    ref={(node) => { buttons.current[i] = node; }}
                    type="button"
                    data-badge={i}
                    data-flipped={isFlipped ? "true" : "false"}
                    data-active={isActive || undefined}
                    tabIndex={i === (active ?? focusIndex) ? 0 : -1}
                    aria-label={`${item.name}, ${item.role}`}
                    aria-describedby={`${uid}-caption`}
                    aria-pressed={isFlipped}
                    className="pointer-events-auto absolute left-0 cursor-pointer rounded-[0.85em] p-0 text-left outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    style={{ top: cardOffset, width: W, height: g.H, fontSize: base }}
                    onFocus={() => { setFocusIndex(i); if (pointer.current.id < 0) { stop(); setActive(i); } }}
                    onClick={(event) => { const pending = pendingOpen.current; pendingOpen.current = -1; if (event.detail === 0 || pending === i) toggle(i); }}
                  >
                    <span ref={(node) => { flips.current[i] = node; }} data-flip className="absolute inset-0 block [transform-style:preserve-3d]" style={{ transformOrigin: "50% 0%", transform: `perspective(${PERSPECTIVE}px) rotateY(${REST_Y[i % REST_Y.length] ?? 0}deg)` }}>
                      <BadgeFaces item={item} tone={tone} index={i} />
                    </span>
                  </button>
                  {/* Machined Steel Crimp Ferrule directly joining strap to card clip */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute flex items-center justify-around rounded-[2px] px-[1.5px]"
                    style={{
                      left: W / 2 - g.strapW / 2 - 1.5,
                      top: -g.crimp * 0.55,
                      width: g.strapW + 3,
                      height: g.crimp,
                      background: METAL,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65), 0 2px 4px rgba(0,0,0,0.45)",
                    }}
                  >
                    <span className="size-[2px] rounded-full bg-zinc-700/80" />
                    <span className="size-[2px] rounded-full bg-zinc-700/80" />
                  </span>
                  <span aria-hidden="true" className="pointer-events-none absolute block" style={{ left: W / 2 - g.clipW / 2, top: 0, width: g.clipW, height: g.clipH + 10 * g.u }}>
                    <span className="absolute left-1/2 block -translate-x-1/2 rounded-b-[2px]" style={{ top: g.clipH * 0.7, width: g.clipW * 0.42, height: cardOffset - g.clipH * 0.7 + 0.72 * base + 0.3 * base, background: PLASTIC }} />
                    <span className="absolute inset-x-0 top-0 block" style={{ height: g.clipH, clipPath: "polygon(24% 0, 76% 0, 100% 72%, 94% 100%, 6% 100%, 0 72%)", background: PLASTIC }} />
                    <span className="absolute block bg-white/50" style={{ left: "30%", right: "30%", top: 1, height: 1 }} />
                    <span className="absolute left-1/2 block -translate-x-1/2 rounded-full bg-background" style={{ top: g.clipH * 0.14, width: g.clipH * 0.34, height: g.clipH * 0.34, boxShadow: "inset 0 1px 1px color-mix(in oklab, black 45%, transparent)" }} />
                  </span>
                </span>
              </span>
            </div>
          );
        })}

        {size.carousel && (
          <>
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-50 w-12 bg-gradient-to-r from-background from-25% to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-50 w-12 bg-gradient-to-l from-background from-25% to-transparent" />
          </>
        )}
      </div>

      {size.carousel && count > 1 && (
        <div className="relative z-10 mt-1 flex justify-center gap-1.5" role="group" aria-label={labels.show}>
          {items.map((item, i) => (
            <button key={item.id} type="button" aria-label={`${labels.show} ${item.name}`} aria-current={centerIndex === i} onClick={() => { stop(); setActive(i); }} className={`h-1.5 rounded-full outline-none transition-[width,background-color] duration-300 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${centerIndex === i ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25 hover:bg-foreground/45"}`} />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 pb-7 pt-3 text-center">
        <div id={`${uid}-caption`} aria-live="polite" className="min-h-[2.6rem]">
          <p className="text-sm font-medium">{line1}</p>
          <p className="mt-0.5 text-[13px] text-muted-foreground">{line2}</p>
          {showingBack && person?.bio && <span className="sr-only">{person.bio}</span>}
        </div>
        {action}
      </div>
    </section>
  );
}

export default TeamLanyardRail;
