import { motion } from "motion/react";
import { Gauge } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";

const VITALS = [
  { label: "LCP", value: "0.8s", pct: 92 },
  { label: "INP", value: "38ms", pct: 96 },
  { label: "CLS", value: "0.00", pct: 100 },
];

export default function Bento13() {
  return (
    <GlowCard
      className="h-full min-h-[380px]"
      contentClassName="flex h-full flex-col justify-between p-6"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <Gauge className="size-3.5 text-accent" />
          Core Web Vitals
        </span>
        <span className="font-mono text-[11px] font-semibold text-[#35C46A]">
          99/100
        </span>
      </div>

      <div className="my-auto flex flex-col gap-4 py-6">
        {VITALS.map((vital, idx) => (
          <div key={vital.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                {vital.label}
              </span>
              <span className="font-mono text-muted-foreground">
                {vital.value}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D4D4D8] dark:bg-[#26262B]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${vital.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: "easeOut" }}
                className="h-full rounded-full bg-accent"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Dioptimalkan untuk waktu muat instan di desktop maupun perangkat mobile.
      </p>
    </GlowCard>
  );
}
