import { useState } from "react";
import { motion } from "motion/react";
import { Layers } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";

const LAYERS = [
  { title: "01 · Struktur", detail: "Hierarki visual yang jelas sebelum warna" },
  { title: "02 · Ritme", detail: "Spasi konsisten berbasis kelipatan 4px" },
  { title: "03 · Gerak", detail: "Transisi fisik yang terasa alami, bukan hiasan" },
];

export default function Bento2() {
  const [hovered, setHovered] = useState(false);

  return (
    <GlowCard
      className="h-full min-h-[380px]"
      contentClassName="flex h-full flex-col justify-between p-6"
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex h-full flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <Layers className="size-3.5 text-accent" />
            Prinsip Desain
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">03</span>
        </div>

        <div className="my-auto flex flex-col gap-2.5 py-6">
          {LAYERS.map((layer, idx) => (
            <motion.div
              key={layer.title}
              animate={{
                x: hovered ? idx * 6 : 0,
                opacity: 1,
              }}
              transition={{ type: "spring", stiffness: 280, damping: 24, delay: idx * 0.03 }}
              className="rounded-xl border border-[#D4D4D8] bg-white px-4 py-3 dark:border-[#3A3A44] dark:bg-[#1A1A1F]"
            >
              <p className="text-xs font-semibold text-foreground">
                {layer.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {layer.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Setiap antarmuka dimulai dari kejelasan informasi.
        </p>
      </div>
    </GlowCard>
  );
}
