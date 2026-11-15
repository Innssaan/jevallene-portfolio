import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, Palette } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { playCopySuccessSound, playTabSwitchSound } from "@/lib/sound";

const SWATCHES = [
  { name: "Canvas", hex: "#08080A" },
  { name: "Surface", hex: "#1A1A1F" },
  { name: "Accent", hex: "var(--accent)" },
  { name: "Success", hex: "#35C46A" },
];

function readAccentHex(): string {
  if (typeof window === "undefined") return "#E11D48";
  const val = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  return val || "#E11D48";
}

export default function Bento30() {
  const [active, setActive] = useState(SWATCHES[2]);
  const [accentHex, setAccentHex] = useState<string>(() => readAccentHex());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sync = () => setAccentHex(readAccentHex());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color-theme", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const displayValue = active.hex === "var(--accent)" ? accentHex : active.hex;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayValue);
      playCopySuccessSound();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

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
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex cursor-pointer items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          title="Salin nilai warna"
        >
          {copied ? <Check className="size-3 text-[#35C46A]" /> : <Copy className="size-3" />}
          {copied ? "Tersalin" : displayValue}
        </button>
      </div>

      <div className="my-auto flex flex-col items-center justify-center py-6">
        <motion.button
          type="button"
          onClick={handleCopy}
          key={active.hex}
          initial={{ scale: 0.92, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          aria-label={`Salin warna ${active.name} (${displayValue})`}
          className="h-24 w-24 cursor-pointer rounded-2xl border border-[#D4D4D8] shadow-sm dark:border-[#3A3A44]"
          style={{ backgroundColor: active.hex }}
        />
        <p className="mt-4 text-sm font-medium text-foreground">
          {active.name}
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
          {active.hex === "var(--accent)" ? `var(--accent) · ${accentHex}` : active.hex}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SWATCHES.map((swatch) => {
          const isCurrent = swatch.hex === active.hex;
          return (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => {
                playTabSwitchSound();
                setActive(swatch);
              }}
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
