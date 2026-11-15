import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export interface WelcomeLoaderProps {
  onComplete: () => void;
}

export function WelcomeLoader({ onComplete }: WelcomeLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(100);
      setLeaving(true);
      const t = window.setTimeout(onComplete, 120);
      return () => window.clearTimeout(t);
    }

    let frame = 0;
    const start = performance.now();
    const duration = 950;

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / duration);
      // Ease out cubic for snappy initial climb and smooth finish
      const eased = 1 - Math.pow(1 - ratio, 3);
      const next = Math.round(eased * 100);
      setProgress(next);

      if (ratio < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          setLeaving(true);
          window.setTimeout(onComplete, 420);
        }, 140);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [onComplete, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="welcome-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#08080A] text-[#FAFAFA]"
          aria-live="polite"
          aria-label={`Memuat portofolio ${progress}%`}
        >
          <div className="flex w-full max-w-xs flex-col items-center gap-4 px-6">
            <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#C4C4CC]">
              JEVALLENE · PORTFOLIO
            </span>
            <div className="flex items-baseline gap-1 font-mono text-5xl font-bold tracking-tight tabular-nums">
              <span>{progress}</span>
              <span className="text-2xl text-accent">%</span>
            </div>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#1A1A1F] border border-[#3A3A44]">
              <div
                className="h-full origin-left bg-gradient-to-r from-accent to-[var(--accent-bright)] transition-transform duration-75"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
