import { useRef, useState, type MouseEvent, type ReactNode } from "react";

export type GlowAccent = "indigo" | "cyan" | "emerald" | "fuchsia" | "amber";

export interface GlowCardProps {
  accent?: GlowAccent;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export function GlowCard({
  className,
  contentClassName = "p-4 sm:p-5",
  children,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpot((prev) => ({ ...prev, active: false }))}
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/65 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/70 dark:border-white/[0.12] dark:bg-[#121218]/55 dark:shadow-[0_16px_42px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] dark:hover:border-accent/75",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Glossy diagonal glass sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(125deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.08)_32%,transparent_55%)] dark:bg-[linear-gradient(125deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.025)_32%,transparent_56%)]"
      />

      {/* 21st.dev-style pointer-tracking radial spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(320px circle at ${spot.x}px ${spot.y}px, rgba(var(--accent-rgb),0.12), transparent 65%)`,
        }}
      />

      {/* Bottom hover indicator bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2.5px] origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
      />

      <div
        className={[
          "relative z-10 flex h-full flex-col",
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
