import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-accent shadow-[0_0_12px_rgba(var(--accent-rgb),0.7)]"
      style={{ scaleX }}
    />
  );
}

export type ParallaxVariant = "up" | "left" | "right" | "zoom" | "tilt";

export interface ParallaxProps {
  children: ReactNode;
  offset?: number;
  className?: string;
  /** Set true for above-the-fold Hero content so it renders immediately without waiting for scroll */
  immediate?: boolean;
  /** Optional stagger delay (seconds) for scroll-triggered reveal */
  delay?: number;
  /** Subtle entry & depth style for visual variety across sections */
  variant?: ParallaxVariant;
}

const REVEAL_INITIAL: Record<ParallaxVariant, Record<string, number | string>> = {
  up: { opacity: 0, y: 24, filter: "blur(4px)" },
  left: { opacity: 0, x: -22, y: 10, filter: "blur(4px)" },
  right: { opacity: 0, x: 22, y: 10, filter: "blur(4px)" },
  zoom: { opacity: 0, scale: 0.96, y: 16, filter: "blur(4px)" },
  tilt: { opacity: 0, y: 20, rotateX: 3.5, filter: "blur(4px)" },
};

const REVEAL_TARGET: Record<ParallaxVariant, Record<string, number | string>> = {
  up: { opacity: 1, y: 0, filter: "blur(0px)" },
  left: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
  right: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
  zoom: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  tilt: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" },
};

export function Parallax({
  children,
  offset = 18,
  className,
  immediate = false,
  delay = 0,
  variant = "up",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const y = useSpring(rawY, { stiffness: 150, damping: 28, mass: 0.45 });

  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    variant === "zoom" ? [0.985, 1, 0.99] : [1, 1, 1]
  );
  const scale = useSpring(rawScale, { stiffness: 160, damping: 30, mass: 0.4 });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={variant === "tilt" && isDesktop ? { perspective: 1000 } : undefined}
    >
      <motion.div
        style={
          isDesktop
            ? {
                y,
                scale: variant === "zoom" ? scale : undefined,
                willChange: "transform",
              }
            : undefined
        }
      >
        {immediate ? (
          children
        ) : (
          <motion.div
            initial={REVEAL_INITIAL[variant]}
            whileInView={REVEAL_TARGET[variant]}
            viewport={{ once: true, amount: 0.08 }}
            transition={{
              duration: 0.7,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
