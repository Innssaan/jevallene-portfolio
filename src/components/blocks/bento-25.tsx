import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Command } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { playTabSwitchSound, playThemeChimeSound } from "@/lib/sound";

const COLOR_THEMES = ["crimson", "ocean", "emerald", "violet", "amber"] as const;

export default function Bento25() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const lastKeyRef = useRef<{ key: string; at: number } | null>(null);

  const flash = useCallback((msg: string) => {
    setFeedback(msg);
    window.setTimeout(() => setFeedback(null), 1600);
  }, []);

  const jumpTo = useCallback(
    (selector: string, msg: string) => {
      const el = document.querySelector(selector);
      if (el) {
        playTabSwitchSound();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        flash(msg);
      }
    },
    [flash]
  );

  const cycleAccentTheme = useCallback(() => {
    const root = document.documentElement;
    const current = root.getAttribute("data-color-theme") ?? "crimson";
    const idx = COLOR_THEMES.indexOf(current as (typeof COLOR_THEMES)[number]);
    const next = COLOR_THEMES[(idx + 1) % COLOR_THEMES.length];
    if (next === "crimson") {
      root.removeAttribute("data-color-theme");
    } else {
      root.setAttribute("data-color-theme", next);
    }
    try {
      window.localStorage.setItem("jevallene-color-theme", next);
    } catch {
      // ignore storage errors
    }
    playThemeChimeSound();
    flash(`Tema aksen: ${next}`);
  }, [flash]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        jumpTo("#kontak", "Menuju Kontak");
        return;
      }

      const key = e.key.toLowerCase();
      const now = Date.now();
      if (key === "p" && lastKeyRef.current?.key === "g" && now - lastKeyRef.current.at < 900) {
        lastKeyRef.current = null;
        jumpTo("#proyek", "Menuju Proyek");
        return;
      }

      if (key === "t" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        cycleAccentTheme();
        return;
      }

      lastKeyRef.current = { key, at: now };
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cycleAccentTheme, jumpTo]);

  const shortcuts = [
    {
      keys: ["⌘", "K"],
      label: "Ke kontak",
      onRun: () => jumpTo("#kontak", "Menuju Kontak"),
    },
    {
      keys: ["G", "P"],
      label: "Buka proyek",
      onRun: () => jumpTo("#proyek", "Menuju Proyek"),
    },
    {
      keys: ["T"],
      label: "Ganti aksen",
      onRun: cycleAccentTheme,
    },
  ];

  return (
    <GlowCard
      className="h-full min-h-[380px]"
      contentClassName="flex h-full flex-col justify-between p-6"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <Command className="size-3.5 text-accent" />
          Aksesibilitas
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {feedback ?? "KBD"}
        </span>
      </div>

      <div className="my-auto flex flex-col gap-3 py-6">
        {shortcuts.map((item) => (
          <motion.button
            key={item.label}
            type="button"
            onClick={item.onRun}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#D4D4D8] bg-white px-3.5 py-2.5 text-left transition-colors hover:border-accent/60 dark:border-[#3A3A44] dark:bg-[#1A1A1F] dark:hover:border-accent/70"
          >
            <span className="text-xs font-medium text-foreground">
              {item.label}
            </span>
            <span className="flex items-center gap-1">
              {item.keys.map((key) => (
                <kbd
                  key={key}
                  className="inline-flex min-w-6 items-center justify-center rounded-md border border-[#D4D4D8] bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground dark:border-[#3A3A44] dark:bg-[#111114]"
                >
                  {key}
                </kbd>
              ))}
            </span>
          </motion.button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Tekan pintasan keyboard di atas atau klik langsung untuk mencoba.
      </p>
    </GlowCard>
  );
}
