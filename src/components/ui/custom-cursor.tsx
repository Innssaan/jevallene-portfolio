import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export type CursorStyle = "system" | "ring" | "spotlight" | "crosshair";
type CursorInteraction = "default" | "pointer" | "text" | "hidden";

export interface CustomCursorProps {
  variant?: CursorStyle;
}

export function CustomCursor({ variant = "system" }: CustomCursorProps) {
  const [finePointer, setFinePointer] = useState(false);
  const [interaction, setInteraction] = useState<CursorInteraction>("hidden");
  const [pressed, setPressed] = useState(false);

  const isActive = finePointer && variant !== "system";

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Instant-feel spring for precision dot / reticle core
  const dotX = useSpring(mouseX, { stiffness: 1400, damping: 48, mass: 0.18 });
  const dotY = useSpring(mouseY, { stiffness: 1400, damping: 48, mass: 0.18 });

  // Fluid trailing spring for outer halo / spotlight / brackets
  const trailX = useSpring(mouseX, { stiffness: 320, damping: 28, mass: 0.45 });
  const trailY = useSpring(mouseY, { stiffness: 320, damping: 28, mass: 0.45 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setFinePointer(pointerQuery.matches && !reducedQuery.matches);
    };

    update();
    pointerQuery.addEventListener("change", update);
    reducedQuery.addEventListener("change", update);

    return () => {
      pointerQuery.removeEventListener("change", update);
      reducedQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("custom-cursor-active", isActive);
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      setInteraction("hidden");
      return;
    }

    const resolveInteraction = (target: EventTarget | null): CursorInteraction => {
      const el = target as HTMLElement | null;
      if (!el) return "default";
      if (el.closest("iframe")) return "hidden";
      if (el.closest("input, textarea, select, [contenteditable='true']")) {
        return "text";
      }
      if (
        el.closest(
          "a, button, [role='button'], [role='tab'], label, .cursor-pointer"
        )
      ) {
        return "pointer";
      }
      return "default";
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setInteraction(resolveInteraction(e.target));
    };

    const onMouseDown = () => setPressed(true);
    const onMouseUp = () => setPressed(false);
    const onMouseLeave = () => setInteraction("hidden");
    const onWindowBlur = () => setInteraction("hidden");

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [isActive, mouseX, mouseY]);

  if (!isActive) return null;

  const isVisible = interaction !== "hidden";
  const isPointer = interaction === "pointer";
  const isText = interaction === "text";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden"
    >
      {/* Variant 1: Halo Ring */}
      {variant === "ring" && (
        <>
          <motion.div
            style={{
              x: trailX,
              y: trailY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              opacity: isVisible ? 1 : 0,
              width: isText ? 2 : isPointer ? 46 : 30,
              height: isText ? 20 : isPointer ? 46 : 30,
              borderRadius: isText ? 2 : 9999,
              scale: pressed ? 0.82 : 1,
              backgroundColor: isText
                ? "var(--accent)"
                : isPointer
                  ? "rgba(var(--accent-rgb), 0.16)"
                  : "rgba(var(--accent-rgb), 0.03)",
              borderColor: isText
                ? "transparent"
                : isPointer
                  ? "var(--accent)"
                  : "rgba(255, 255, 255, 0.5)",
            }}
            transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.4 }}
            className="fixed left-0 top-0 border-[1.5px] shadow-[0_0_18px_rgba(var(--accent-rgb),0.24)] backdrop-blur-[1px]"
          />
          <motion.div
            style={{
              x: dotX,
              y: dotY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              opacity: isVisible && !isText ? 1 : 0,
              scale: pressed ? 1.4 : isPointer ? 0.65 : 1,
              backgroundColor: isPointer ? "var(--accent-bright)" : "var(--accent)",
            }}
            transition={{ type: "spring", stiffness: 520, damping: 30 }}
            className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.9)]"
          />
        </>
      )}

      {/* Variant 2: Aura Spotlight */}
      {variant === "spotlight" && (
        <>
          <motion.div
            style={{
              x: trailX,
              y: trailY,
              translateX: "-50%",
              translateY: "-50%",
              background:
                "radial-gradient(circle, rgba(var(--accent-rgb), 0.28) 0%, rgba(var(--accent-rgb), 0.08) 42%, transparent 72%)",
            }}
            animate={{
              opacity: isVisible ? (isPointer ? 1 : 0.78) : 0,
              width: isPointer ? 130 : 96,
              height: isPointer ? 130 : 96,
              scale: pressed ? 0.85 : 1,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed left-0 top-0 rounded-full blur-md"
          />
          <motion.div
            style={{
              x: dotX,
              y: dotY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              opacity: isVisible ? 1 : 0,
              width: isText ? 2 : isPointer ? 14 : 8,
              height: isText ? 20 : isPointer ? 14 : 8,
              borderRadius: isText ? 2 : 9999,
              scale: pressed ? 0.78 : 1,
              backgroundColor: isPointer ? "var(--accent-bright)" : "#FAFAFA",
            }}
            transition={{ type: "spring", stiffness: 520, damping: 28 }}
            className="fixed left-0 top-0 shadow-[0_0_14px_rgba(var(--accent-rgb),0.95)]"
          />
        </>
      )}

      {/* Variant 3: Studio Reticle (Crosshair) */}
      {variant === "crosshair" && (
        <>
          <motion.div
            style={{
              x: trailX,
              y: trailY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              opacity: isVisible && !isText ? 1 : 0,
              width: isPointer ? 38 : 28,
              height: isPointer ? 38 : 28,
              rotate: isPointer ? 45 : 0,
              scale: pressed ? 0.8 : 1,
            }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="fixed left-0 top-0"
          >
            {/* Four precision corner brackets */}
            <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-accent" />
            <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r-2 border-t-2 border-accent" />
            <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 border-accent" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-accent" />
          </motion.div>
          <motion.div
            style={{
              x: dotX,
              y: dotY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              opacity: isVisible ? 1 : 0,
              width: isText ? 2 : 5,
              height: isText ? 20 : 5,
              borderRadius: isText ? 2 : 9999,
              scale: pressed ? 1.4 : 1,
              backgroundColor: isPointer ? "var(--accent-bright)" : "#FAFAFA",
            }}
            transition={{ type: "spring", stiffness: 560, damping: 30 }}
            className="fixed left-0 top-0 shadow-[0_0_10px_rgba(var(--accent-rgb),0.85)]"
          />
        </>
      )}
    </div>
  );
}
