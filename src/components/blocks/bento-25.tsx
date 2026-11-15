import { motion } from "motion/react";
import { Command } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";

const SHORTCUTS = [
  { keys: ["⌘", "K"], label: "Navigasi cepat" },
  { keys: ["G", "P"], label: "Buka proyek" },
  { keys: ["T"], label: "Ganti tema" },
];

export default function Bento25() {
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
        <span className="font-mono text-[11px] text-muted-foreground">KBD</span>
      </div>

      <div className="my-auto flex flex-col gap-3 py-6">
        {SHORTCUTS.map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="flex items-center justify-between rounded-xl border border-[#D4D4D8] bg-white px-3.5 py-2.5 dark:border-[#3A3A44] dark:bg-[#1A1A1F]"
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
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Mendukung navigasi keyboard penuh &amp; preferensi reduced motion.
      </p>
    </GlowCard>
  );
}
