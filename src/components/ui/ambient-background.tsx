import { type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

const METEORS = [
  { top: "6%", left: "78%", duration: "6.2s", delay: "0s" },
  { top: "18%", left: "92%", duration: "7.8s", delay: "2.1s" },
  { top: "36%", left: "86%", duration: "8.4s", delay: "4.2s" },
  { top: "12%", left: "56%", duration: "7.0s", delay: "5.4s" },
  { top: "62%", left: "88%", duration: "8.1s", delay: "3.1s" },
];

// Deterministic outer-space starfield covering the full viewport from top to bottom
const STARFIELD = Array.from({ length: 68 }, (_, i) => {
  const top = ((i * 37 + 11) % 97) + 1;
  const left = ((i * 61 + 17) % 97) + 1;
  const size = i % 9 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.1;
  const color =
    i % 7 === 0 ? "#E4E4E7" : i % 11 === 0 ? "#FDE68A" : "#FFFFFF";
  const duration = 3.2 + (i % 6) * 0.75;
  const delay = (i % 10) * 0.45;
  const minOpacity = i % 4 === 0 ? 0.25 : 0.12;
  const maxOpacity = i % 9 === 0 ? 0.95 : 0.68;
  const glow = i % 9 === 0;
  return {
    top: `${top}%`,
    left: `${left}%`,
    size,
    color,
    duration,
    delay,
    minOpacity,
    maxOpacity,
    glow,
  };
});

export type BackgroundVariant = "meteors" | "planets" | "minimalist" | "waves";

export function AmbientBackground({ variant = "meteors" }: { variant?: BackgroundVariant }) {
  const prefersReducedMotion = useReducedMotion();
  const showStars = variant === "meteors" || variant === "planets";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% 0%, #101014 0%, #070709 52%, #030304 100%)",
      }}
    >
      {/* Faint diagonal cosmic dust band (animated subtle shimmer) */}
      <motion.div
        className="absolute inset-0 opacity-85"
        animate={
          prefersReducedMotion
            ? undefined
            : { opacity: [0.65, 0.95, 0.65], scale: [1, 1.03, 1] }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(125deg, transparent 18%, rgba(255,255,255,0.025) 42%, rgba(var(--accent-rgb),0.036) 54%, rgba(255,255,255,0.018) 66%, transparent 84%)",
        }}
      />

      {/* Static or twinkling starfield */}
      {showStars &&
        STARFIELD.map((star, idx) =>
          prefersReducedMotion ? (
            <span
              key={idx}
              className="absolute rounded-full"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
                opacity: star.maxOpacity * 0.7,
              }}
            />
          ) : (
            <motion.span
              key={idx}
              className="absolute rounded-full"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
                boxShadow: star.glow
                  ? `0 0 6px 1px ${star.color === "#FFFFFF" ? "rgba(255,255,255,0.45)" : star.color}`
                  : undefined,
              }}
              animate={{
                opacity: [star.minOpacity, star.maxOpacity, star.minOpacity],
                scale: star.glow ? [0.9, 1.25, 0.9] : [1, 1.12, 1],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: star.delay,
              }}
            />
          )
        )}

      {/* Diagonal shooting stars */}
      {variant === "meteors" && !prefersReducedMotion && (
        <div>
          {METEORS.map((m, idx) => (
            <span
              key={idx}
              className="meteor-streak"
              style={
                {
                  top: m.top,
                  left: m.left,
                  "--meteor-duration": m.duration,
                  "--meteor-delay": m.delay,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Planets & Orbital Rings */}
      {variant === "planets" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Deep cosmic nebula haze behind planet */}
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.45, 0.75, 0.45], scale: [0.96, 1.06, 0.96] }
            }
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-[10%] -top-[10%] h-[520px] w-[520px] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(var(--accent-rgb),0.22) 0%, rgba(255,255,255,0.03) 50%, transparent 74%)",
            }}
          />

          {/* Rotating primary orbital ring with glowing satellite & trail (top-right) */}
          <motion.div
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
            className="absolute -right-44 -top-36 h-[560px] w-[560px] rounded-full border border-white/[0.06]"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(var(--accent-rgb),0.22) 0deg, transparent 55deg, transparent 360deg)",
              maskImage:
                "radial-gradient(circle, transparent 98.8%, black 99.2%, black 100%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 98.8%, black 99.2%, black 100%)",
            }}
          />
          <motion.div
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
            className="absolute -right-44 -top-36 h-[560px] w-[560px] rounded-full border border-dashed border-white/[0.06]"
          >
            <span
              className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
              style={{
                boxShadow:
                  "0 0 14px 3px rgba(var(--accent-rgb),0.85), 0 0 28px rgba(255,255,255,0.45)",
              }}
            />
          </motion.div>

          {/* Counter-rotating outer orbital ring with accent moonlet (bottom-left) */}
          <motion.div
            animate={prefersReducedMotion ? undefined : { rotate: -360 }}
            transition={{ duration: 58, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-56 -left-48 h-[640px] w-[640px] rounded-full border border-white/[0.045]"
          >
            <span
              className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full"
              style={{
                backgroundColor: "var(--accent-bright)",
                boxShadow: "0 0 14px 3px rgba(var(--accent-rgb),0.75)",
              }}
            />
          </motion.div>

          {/* Realistic Spinning Saturn synchronized with active color theme (top-right) */}
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, -12, 0], x: [0, 6, 0], rotate: [-1.5, 1.5, -1.5] }
            }
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[4%] top-[8%] h-52 w-52 sm:h-72 sm:w-72"
          >
            {/* Soft theme-synced atmospheric glow */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : { scale: [0.95, 1.09, 0.95], opacity: [0.38, 0.68, 0.38] }
              }
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-6 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(var(--accent-rgb), 0.28) 0%, transparent 72%)",
              }}
            />

            <svg
              viewBox="0 0 400 400"
              className="relative h-full w-full overflow-visible"
            >
              <defs>
                {/* Theme-synchronized Saturn sphere lighting */}
                <radialGradient id="saturn-sphere" cx="34%" cy="30%" r="72%">
                  <stop offset="0%" stopColor="var(--accent-bright)" />
                  <stop offset="28%" stopColor="var(--accent)" />
                  <stop offset="58%" stopColor="var(--accent-dark)" />
                  <stop offset="84%" stopColor="#141218" />
                  <stop offset="100%" stopColor="#070609" />
                </radialGradient>
                <clipPath id="saturn-clip">
                  <circle cx="200" cy="200" r="74" />
                </clipPath>
              </defs>

              {/* Back half of Saturn's rings (upper arc behind sphere) */}
              <g transform="translate(200 200) rotate(-19) scale(1 0.27)" opacity="0.6">
                <path d="M -104 0 A 104 104 0 0 1 104 0" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="11" />
                <path d="M -124 0 A 124 124 0 0 1 124 0" fill="none" stroke="rgba(var(--accent-rgb),0.4)" strokeWidth="20" />
                <path d="M -121 0 A 121 121 0 0 1 121 0" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
                <path d="M -154 0 A 154 154 0 0 1 154 0" fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="18" />
                <path d="M -165 0 A 165 165 0 0 1 165 0" fill="none" stroke="rgba(var(--accent-rgb),0.26)" strokeWidth="2.5" />
              </g>

              {/* Saturn sphere */}
              <circle cx="200" cy="200" r="74" fill="url(#saturn-sphere)" />

              {/* Spinning atmospheric cloud bands & storms clipped to Saturn */}
              <g clipPath="url(#saturn-clip)" opacity="0.36">
                <g transform="rotate(-19 200 200)">
                  <motion.g
                    animate={prefersReducedMotion ? undefined : { x: [0, -90] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  >
                    <rect x="80" y="138" width="320" height="8" fill="rgba(255,255,255,0.55)" />
                    <rect x="80" y="152" width="320" height="11" fill="var(--accent-mid)" />
                    <rect x="80" y="170" width="320" height="9" fill="rgba(255,255,255,0.45)" />
                    <rect x="80" y="186" width="320" height="14" fill="var(--accent-dark)" />
                    <rect x="80" y="206" width="320" height="8" fill="var(--accent-bright)" />
                    <rect x="80" y="222" width="320" height="12" fill="rgba(0,0,0,0.32)" />
                    <rect x="80" y="242" width="320" height="10" fill="rgba(0,0,0,0.45)" />
                    {/* Repeating atmospheric storm ovals so axial spin is clearly visible */}
                    {[150, 240, 330].map((cx) => (
                      <ellipse
                        key={`storm-a-${cx}`}
                        cx={cx}
                        cy="174"
                        rx="14"
                        ry="4.5"
                        fill="rgba(255,255,255,0.45)"
                      />
                    ))}
                    {[175, 265, 355].map((cx) => (
                      <ellipse
                        key={`storm-b-${cx}`}
                        cx={cx}
                        cy="210"
                        rx="18"
                        ry="5"
                        fill="var(--accent-bright)"
                        opacity="0.65"
                      />
                    ))}
                  </motion.g>
                </g>
              </g>

              {/* Soft terminator curvature overlay (keeps night-side shading stationary while clouds spin) */}
              <circle
                cx="200"
                cy="200"
                r="74"
                fill="url(#saturn-sphere)"
                opacity="0.45"
              />
              <circle
                cx="200"
                cy="200"
                r="74"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />

              {/* Front half of Saturn's rings (lower arc wrapping in front of sphere) */}
              <g transform="translate(200 200) rotate(-19) scale(1 0.27)" opacity="0.94">
                <path d="M -104 0 A 104 104 0 0 0 104 0" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="11" />
                <path d="M -124 0 A 124 124 0 0 0 124 0" fill="none" stroke="rgba(var(--accent-rgb),0.52)" strokeWidth="20" />
                <path d="M -119 0 A 119 119 0 0 0 119 0" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="5" />
                <path d="M -129 0 A 129 129 0 0 0 129 0" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="3" />
                <path d="M -154 0 A 154 154 0 0 0 154 0" fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="18" />
                <path d="M -150 0 A 150 150 0 0 0 150 0" fill="none" stroke="rgba(var(--accent-rgb),0.36)" strokeWidth="3.5" />
                <path d="M -165 0 A 165 165 0 0 0 165 0" fill="none" stroke="rgba(var(--accent-rgb),0.32)" strokeWidth="2.5" />
              </g>
            </svg>
          </motion.div>

          {/* Distant textured moon + micro-satellite (bottom-left) */}
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, 14, 0], x: [0, 8, 0], scale: [1, 1.04, 1] }
            }
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[14%] left-[7%] h-16 w-16 sm:h-24 sm:w-24"
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 32% 28%, #f4f4f5 0%, #a1a1aa 32%, #3f3f46 65%, #121216 92%)",
                boxShadow:
                  "inset -10px -10px 20px rgba(0,0,0,0.85), 0 0 28px rgba(var(--accent-rgb),0.16)",
                opacity: 0.82,
              }}
            >
              {/* Subtle lunar craters */}
              <span className="absolute left-[26%] top-[30%] h-3 w-3 rounded-full bg-black/20 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]" />
              <span className="absolute left-[54%] top-[52%] h-4 w-4 rounded-full bg-black/25 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]" />
              <span className="absolute left-[38%] top-[64%] h-2 w-2 rounded-full bg-black/20" />
            </div>
            {/* Tiny orbiting probe around moon */}
            <motion.div
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 rounded-full border border-white/[0.08]"
            >
              <span
                className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                style={{ boxShadow: "0 0 8px 1px rgba(var(--accent-rgb),0.9)" }}
              />
            </motion.div>
          </motion.div>

          {/* Subtle occasional shooting star in planet mode */}
          {!prefersReducedMotion && (
            <div className="hidden md:block">
              {METEORS.slice(0, 2).map((m, idx) => (
                <span
                  key={idx}
                  className="meteor-streak"
                  style={
                    {
                      top: m.top,
                      left: m.left,
                      "--meteor-duration": m.duration,
                      "--meteor-delay": m.delay,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Minimalist (clean animated studio dot-grid + breathing spotlight + gliding light beam) */}
      {variant === "minimalist" && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              maskImage:
                "radial-gradient(ellipse 75% 65% at 50% 42%, black 25%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 65% at 50% 42%, black 25%, transparent 80%)",
            }}
          />
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.4, 0.78, 0.4], scale: [0.95, 1.07, 0.95] }
            }
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-[18%] h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, rgba(var(--accent-rgb),0.14) 0%, transparent 72%)",
            }}
          />
          {!prefersReducedMotion && (
            <motion.div
              animate={{ x: ["-40%", "140%"] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              className="absolute inset-y-0 left-0 w-48 -skew-x-12 opacity-40 blur-2xl"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.12), rgba(255,255,255,0.05), transparent)",
              }}
            />
          )}
        </div>
      )}

      {/* Waves (smooth undulating layered ribbons) */}
      {variant === "waves" && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.35, 0.65, 0.35], scale: [0.96, 1.06, 0.96] }
            }
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-[35%] h-[440px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, rgba(var(--accent-rgb),0.16) 0%, transparent 72%)",
            }}
          />
          <svg
            viewBox="0 0 1440 720"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {[
              { y: 260, amp: 55, dur: 11, stroke: "rgba(var(--accent-rgb),0.26)", width: 1.6 },
              { y: 340, amp: 70, dur: 14, stroke: "rgba(255,255,255,0.14)", width: 1.2 },
              { y: 420, amp: 60, dur: 16, stroke: "rgba(var(--accent-rgb),0.22)", width: 1.5 },
              { y: 500, amp: 50, dur: 13, stroke: "rgba(255,255,255,0.1)", width: 1.1 },
              { y: 580, amp: 65, dur: 18, stroke: "rgba(var(--accent-rgb),0.16)", width: 1.4 },
            ].map((w, idx) => {
              const d1 = `M -80 ${w.y} Q 320 ${w.y - w.amp} 720 ${w.y} T 1520 ${w.y}`;
              const d2 = `M -80 ${w.y} Q 320 ${w.y + w.amp} 720 ${w.y} T 1520 ${w.y}`;
              return (
                <motion.path
                  key={idx}
                  d={d1}
                  fill="none"
                  stroke={w.stroke}
                  strokeWidth={w.width}
                  animate={prefersReducedMotion ? undefined : { d: [d1, d2, d1] }}
                  transition={{
                    duration: w.dur,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.6,
                  }}
                />
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}
