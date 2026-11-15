import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, Mail } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { playCopySuccessSound } from "@/lib/sound";

const EMAIL = "rifkitv21@gmail.com";

export default function Bento11() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      playCopySuccessSound();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
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
          <Mail className="size-3.5 text-accent" />
          Kontak Cepat
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">24h</span>
      </div>

      <div className="my-auto py-6">
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          Diskusi Proyek Baru?
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Salin alamat email untuk menjadwalkan konsultasi desain antarmuka, pengembangan web, atau produksi visual.
        </p>
      </div>

      <motion.button
        type="button"
        onClick={handleCopy}
        whileTap={{ scale: 0.98 }}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#D4D4D8] bg-white px-4 py-3 text-xs font-medium text-foreground transition-colors hover:border-accent dark:border-[#3A3A44] dark:bg-[#1A1A1F] dark:hover:border-accent"
      >
        <span className="font-mono">{EMAIL}</span>
        {copied ? (
          <span className="inline-flex items-center gap-1 text-[#35C46A]">
            <Check className="size-3.5" />
            Tersalin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Copy className="size-3.5" />
            Salin
          </span>
        )}
      </motion.button>
    </GlowCard>
  );
}
