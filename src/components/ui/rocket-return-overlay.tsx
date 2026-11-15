import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

interface RocketReturnOverlayProps {
  active: boolean;
  onMidpoint: () => void;
  onComplete: () => void;
}

const SPARKS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  offsetX: ((i % 7) - 3) * 11 + (i % 2 === 0 ? 3 : -3),
  delay: i * 0.025,
  size: 2.5 + (i % 4) * 1.4,
  duration: 0.45 + (i % 3) * 0.12,
}));

const SPEED_LINES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${6 + ((i * 7) % 88)}%`,
  height: 48 + (i % 4) * 34,
  delay: (i % 5) * 0.06,
  duration: 0.48 + (i % 3) * 0.12,
  opacity: 0.25 + (i % 3) * 0.18,
}));

export function RocketReturnOverlay({
  active,
  onMidpoint,
  onComplete,
}: RocketReturnOverlayProps) {
  useEffect(() => {
    if (!active) return;

    const midpointTimer = window.setTimeout(() => {
      onMidpoint();
    }, 520);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 1480);

    return () => {
      window.clearTimeout(midpointTimer);
      window.clearTimeout(completeTimer);
    };
  }, [active, onMidpoint, onComplete]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {active && (
        <motion.div
          key="rocket-return-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[150] overflow-hidden"
        >
          {/* Left curtain half that glides in and splits open smoothly */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "0%", "0%", "-102%"] }}
            transition={{
              duration: 1.44,
              times: [0, 0.26, 0.48, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-accent/75 bg-[#060609]/95 shadow-[12px_0_48px_rgba(var(--accent-rgb),0.35)] backdrop-blur-md will-change-transform"
          >
            <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF7A59] to-transparent opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,rgba(var(--accent-rgb),0.16),transparent_60%)]" />
          </motion.div>

          {/* Right curtain half that glides in and splits open smoothly */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: ["100%", "0%", "0%", "102%"] }}
            transition={{
              duration: 1.44,
              times: [0, 0.26, 0.48, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-y-0 right-0 w-1/2 overflow-hidden border-l border-accent/75 bg-[#060609]/95 shadow-[-12px_0_48px_rgba(var(--accent-rgb),0.35)] backdrop-blur-md will-change-transform"
          >
            <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF7A59] to-transparent opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(var(--accent-rgb),0.16),transparent_60%)]" />
          </motion.div>

          {/* Vertical starlight speed-lines rushing downward */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.35, times: [0, 0.25, 0.65, 1] }}
            className="absolute inset-0"
          >
            {SPEED_LINES.map((line) => (
              <motion.span
                key={line.id}
                initial={{ y: "-25vh", opacity: 0 }}
                animate={{ y: "120vh", opacity: [0, line.opacity, 0] }}
                transition={{
                  duration: line.duration,
                  delay: line.delay,
                  repeat: 2,
                  ease: "linear",
                }}
                style={{
                  left: line.left,
                  height: line.height,
                }}
                className="absolute top-0 w-px rounded-full bg-gradient-to-b from-transparent via-white/80 to-accent/70 will-change-transform"
              />
            ))}
          </motion.div>

          {/* Ignition shockwave ring at launch pad (bottom center) */}
          <motion.div
            initial={{ scale: 0.15, opacity: 0 }}
            animate={{ scale: [0.15, 1.4, 2.5], opacity: [0, 0.85, 0] }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-6 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full border-2 border-[var(--accent-bright)]/80 bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.35),transparent_70%)] shadow-[0_0_40px_rgba(var(--accent-rgb),0.75)] will-change-transform"
          />

          {/* Center plasma split beam */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 0.95, 1, 0], scaleY: [0, 0.45, 1, 1] }}
            transition={{
              duration: 1.2,
              times: [0, 0.22, 0.55, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ originY: 1 }}
            className="absolute inset-y-0 left-1/2 w-[4px] -translate-x-1/2 bg-gradient-to-t from-accent via-[var(--accent-bright)] to-white shadow-[0_0_30px_rgba(var(--accent-rgb),0.95)] will-change-transform"
          />

          {/* Flying Rocket with smooth acceleration & subtle banking */}
          <motion.div
            initial={{ y: "108vh", scale: 0.82, rotate: 0 }}
            animate={{
              y: ["108vh", "62vh", "-28vh"],
              scale: [0.82, 1.12, 1.02],
              rotate: [0, -1.6, 1.2, 0],
            }}
            transition={{
              duration: 1.18,
              times: [0, 0.28, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center will-change-transform"
          >
            {/* Supersonic nose shock-cone glow */}
            <motion.div
              animate={{ opacity: [0.45, 0.85, 0.5], scale: [0.95, 1.08, 0.95] }}
              transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
              className="pointer-events-none absolute -top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.35),transparent_70%)] blur-md"
            />

            {/* Rocket SVG */}
            <svg
              width="72"
              height="108"
              viewBox="0 0 64 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 drop-shadow-[0_0_28px_rgba(var(--accent-rgb),0.85)]"
            >
              {/* Left & right fins */}
              <path d="M20 54L7 73L20 68V54Z" fill="var(--accent)" />
              <path d="M44 54L57 73L44 68V54Z" fill="var(--accent)" />
              {/* Center fin */}
              <path d="M32 58L29 74H35L32 58Z" fill="var(--accent-dark)" />
              {/* Main fuselage */}
              <path
                d="M32 6C23 18 20 34 20 56V68H44V56C44 34 41 18 32 6Z"
                fill="#F4F4F6"
              />
              {/* Subtle fuselage shading */}
              <path
                d="M32 6C36.8 18 39 34 39 56V68H44V56C44 34 41 18 32 6Z"
                fill="#D4D4D8"
                fillOpacity="0.45"
              />
              {/* Nose cone accent */}
              <path
                d="M32 6C27.2 12.4 24.3 19.6 22.7 27H41.3C39.7 19.6 36.8 12.4 32 6Z"
                fill="var(--accent)"
              />
              {/* Cockpit window */}
              <circle cx="32" cy="39" r="6.5" fill="#18181B" stroke="var(--accent)" strokeWidth="2.2" />
              <circle cx="30" cy="37" r="2" fill="#FFFFFF" fillOpacity="0.8" />
              {/* Thruster nozzle */}
              <path d="M24 68H40L37 74H27L24 68Z" fill="#52525B" />
              {/* Outer plasma flame */}
              <motion.path
                animate={{
                  scaleY: [0.92, 1.45, 1.05, 1.38],
                  scaleX: [0.95, 1.08, 0.96, 1.05],
                  opacity: [0.9, 1, 0.92, 1],
                }}
                transition={{ repeat: Infinity, duration: 0.16, ease: "easeInOut" }}
                style={{ originX: "32px", originY: "74px" }}
                d="M26 74L32 96L38 74H26Z"
                fill="var(--accent-hover)"
              />
              {/* Inner core flame */}
              <motion.path
                animate={{ scaleY: [0.88, 1.32, 0.95] }}
                transition={{ repeat: Infinity, duration: 0.12, ease: "easeInOut" }}
                style={{ originX: "32px", originY: "74px" }}
                d="M29.2 74L32 88L34.8 74H29.2Z"
                fill="#FFFFFF"
                fillOpacity="0.9"
              />
            </svg>

            {/* Exhaust sparks & glowing embers */}
            <div className="relative h-36 w-28">
              {SPARKS.map((spark) => (
                <motion.span
                  key={spark.id}
                  initial={{ opacity: 0.95, y: 0, x: 0, scale: 1 }}
                  animate={{
                    opacity: 0,
                    y: 120,
                    x: spark.offsetX,
                    scale: 0.15,
                  }}
                  transition={{
                    duration: spark.duration,
                    delay: spark.delay,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  style={{
                    width: spark.size,
                    height: spark.size,
                    left: "50%",
                  }}
                  className="absolute top-0 -translate-x-1/2 rounded-full bg-gradient-to-b from-white via-[var(--accent-bright)] to-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.9)] will-change-transform"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
