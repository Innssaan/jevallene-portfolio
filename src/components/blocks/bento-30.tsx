import { useState } from "react";
import { motion } from "motion/react";
import { Palette } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";

const SWATCHES = [
  { name: "Canvas", hex: "#08080A" },
  { name: "Surface", hex: "#1A1A1F" },
  { name: "Crimson", hex: "var(--accent)" },
  { name: "Success", hex: "#35C46A" },
];

export default function Bento30() {
  const [active, setActive] = useState(SWATCHES[2]);

  return (
    <GlowCard
      className="h-full min-h-[380px]"
      contentClassName="flex h-full flex-col justify-between p-6"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <Palette className="size-3.5 text-accent" />
          Token Warna
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {active.hex}
        </span>
      </div>

      <div className="my-auto flex flex-col items-center justify-center py-6">
        <motion.div
          key={active.hex}
          initial={{ scale: 0.92, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="h-24 w-24 rounded-2xl border border-[#D4D4D8] shadow-sm dark:border-[#3A3A44]"
          style={{ backgroundColor: active.hex }}
        />
        <p className="mt-4 text-sm font-medium text-foreground">
          {active.name}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SWATCHES.map((swatch) => {
          const isCurrent = swatch.hex === active.hex;
          return (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => setActive(swatch)}
              aria-label={swatch.name}
              className={`h-8 cursor-pointer rounded-lg border transition-transform ${
                isCurrent
                  ? "scale-105 border-neutral-950 ring-1 ring-accent dark:border-white"
                  : "border-[#D4D4D8] opacity-80 hover:opacity-100 dark:border-[#3A3A44]"
              }`}
              style={{ backgroundColor: swatch.hex }}
            />
          );
        })}
      </div>
    </GlowCard>
  );
}
