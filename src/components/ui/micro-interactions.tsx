import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

export interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/**
 * 21st.dev-style subtle magnetic pull on pointer hover with spring return.
 */
export function Magnetic({
  children,
  strength = 0.22,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 20, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 280, damping: 20, mass: 0.35 });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
        x.set(dx);
        y.set(dy);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  durationMs?: number;
}

/**
 * 21st.dev-style count-up number triggered when scrolled into view.
 */
export function AnimatedNumber({
  value,
  suffix = "",
  durationMs = 900,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [durationMs, inView, prefersReducedMotion, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

/**
 * 21st.dev-style subtle text shimmer sweep.
 */
export function TextShimmer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }
  return <span className={`text-shimmer-21 ${className}`}>{children}</span>;
}
