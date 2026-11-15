import * as React from "react";

interface SpiderClonePortraitProps {
  onOpenFullscreen?: () => void;
}

export function SpiderClonePortrait({ onOpenFullscreen }: SpiderClonePortraitProps) {
  const containerRef = React.useRef<HTMLButtonElement>(null);
  const [hover, setHover] = React.useState(false);
  const [cursor, setCursor] = React.useState({ nx: 0, ny: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCursor({
      nx: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      ny: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={onOpenFullscreen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={handleMouseMove}
      title="Arahkan kursor untuk siluet Spider-Man · Klik untuk fullscreen"
      className="group relative h-52 w-52 sm:h-60 sm:w-60 shrink-0 cursor-zoom-in self-start focus:outline-none select-none"
    >
      {/* Ambient crimson Spider-Verse glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 bottom-2 top-8 rounded-full bg-accent/20 blur-2xl transition-all duration-300"
        style={{
          opacity: hover ? 1 : 0.55,
          transform: hover ? "scale(1.1)" : "scale(1)",
        }}
      />

      {/* Spider-Sense electric arcs above head on hover */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 40"
        className="pointer-events-none absolute -top-3 left-1/2 z-30 h-9 w-28 -translate-x-1/2 transition-all duration-300"
        style={{
          opacity: hover ? 1 : 0,
          transform: hover ? "translateY(0) scale(1)" : "translateY(6px) scale(0.85)",
        }}
      >
        <path
          d="M14 28 L6 18 L18 16 L12 6"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 22 L19 14 L27 12"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M106 28 L114 18 L102 16 L108 6"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M96 22 L101 14 L93 12"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Secondary cyan Spider-Verse chromatic echo clone (right) */}
      <img
        src="/avatar-innssaan-spiderman-nobg.png?v=7"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain object-bottom transition-all duration-300 ease-out"
        style={{
          opacity: hover ? 0.35 : 0,
          filter: "drop-shadow(0 0 14px rgba(34,211,238,0.55)) hue-rotate(180deg) brightness(1.3)",
          transform: hover
            ? `translate(${12 - cursor.nx * 5}px, ${3 - cursor.ny * 3}px) scale(1.02)`
            : "translate(0px, 0px) scale(1)",
        }}
      />

      {/* Primary HD Spider-Man silhouette clone behind real photo (left) */}
      <img
        src="/avatar-innssaan-spiderman-nobg.png?v=7"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain object-bottom transition-all duration-300 ease-out"
        style={{
          opacity: hover ? 0.92 : 0,
          filter: "drop-shadow(0 0 18px rgba(var(--accent-rgb),0.55))",
          transform: hover
            ? `translate(${-16 - cursor.nx * 7}px, ${-3 - cursor.ny * 4}px) scale(1.03)`
            : "translate(0px, 0px) scale(1)",
        }}
      />

      {/* Real HD no-background photo */}
      <img
        src="/avatar-innssaan-nobg.png"
        alt="Foto profil Innssaan"
        draggable={false}
        className="relative z-10 h-full w-full object-contain object-bottom drop-shadow-[0_14px_28px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out"
        style={{
          transform: hover
            ? `translate(${cursor.nx * 3}px, ${cursor.ny * 2}px) scale(1.02)`
            : "translate(0px, 0px) scale(1)",
        }}
      />
    </button>
  );
}
