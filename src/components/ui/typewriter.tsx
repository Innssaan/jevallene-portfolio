import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
}

export function Typewriter({
  phrases,
  typingSpeed = 62,
  deletingSpeed = 34,
  pauseMs = 1800,
  className,
}: TypewriterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState(prefersReducedMotion ? phrases[0] ?? "" : "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || phrases.length === 0) {
      setText(phrases[0] ?? "");
      return;
    }

    const current = phrases[phraseIndex % phrases.length];
    let timeout: number;

    if (!deleting && text === current) {
      timeout = window.setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && text === "") {
      setDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    } else {
      const nextText = deleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1);
      timeout = window.setTimeout(
        () => setText(nextText),
        deleting ? deletingSpeed : typingSpeed
      );
    }

    return () => window.clearTimeout(timeout);
  }, [
    deleting,
    deletingSpeed,
    pauseMs,
    phraseIndex,
    phrases,
    prefersReducedMotion,
    text,
    typingSpeed,
  ]);

  return (
    <span className={className}>
      <span>{text}</span>
      <span className="hero-typewriter-cursor" aria-hidden="true" />
    </span>
  );
}
