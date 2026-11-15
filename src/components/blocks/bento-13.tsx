import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Gauge } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";

interface VitalItem {
  label: string;
  value: string;
  pct: number;
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export default function Bento13() {
  const [lcpMs, setLcpMs] = useState<number | null>(null);
  const [inpMs, setInpMs] = useState<number | null>(null);
  const [clsVal, setClsVal] = useState<number>(0);

  useEffect(() => {
    if (typeof performance === "undefined") return;

    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav && nav.domContentLoadedEventEnd > 0) {
      setLcpMs(Math.round(nav.domContentLoadedEventEnd - nav.fetchStart));
    }

    const observers: PerformanceObserver[] = [];

    if (typeof PerformanceObserver !== "undefined") {
      try {
        const lcpObs = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) setLcpMs(Math.round(last.startTime));
        });
        lcpObs.observe({ type: "largest-contentful-paint", buffered: true });
        observers.push(lcpObs);
      } catch {
        // unsupported
      }

      try {
        let clsTotal = 0;
        const clsObs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as Array<PerformanceEntry & { value?: number; hadRecentInput?: boolean }>) {
            if (!entry.hadRecentInput && typeof entry.value === "number") {
              clsTotal += entry.value;
            }
          }
          setClsVal(clsTotal);
        });
        clsObs.observe({ type: "layout-shift", buffered: true });
        observers.push(clsObs);
      } catch {
        // unsupported
      }

      try {
        let maxEvent = 0;
        const eventObs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > maxEvent) {
              maxEvent = Math.round(entry.duration);
              setInpMs(maxEvent);
            }
          }
        });
        eventObs.observe({ type: "event", buffered: true });
        observers.push(eventObs);
      } catch {
        // unsupported
      }
    }

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const nav = typeof performance !== "undefined"
    ? (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)
    : undefined;
  const ttfbMs = nav ? Math.max(1, Math.round(nav.responseStart - nav.requestStart)) : null;

  const lcpPct = lcpMs !== null ? clamp(Math.round(100 - lcpMs / 40), 20, 100) : 90;
  const secondMs = inpMs ?? ttfbMs;
  const secondLabel = inpMs !== null ? "INP" : "TTFB";
  const secondPct = secondMs !== null ? clamp(Math.round(100 - secondMs / 5), 25, 100) : 92;
  const clsPct = clamp(Math.round(100 - clsVal * 400), 25, 100);
  const overallScore = Math.round((lcpPct + secondPct + clsPct) / 3);

  const vitals: VitalItem[] = [
    {
      label: "LCP",
      value: lcpMs !== null ? (lcpMs >= 1000 ? `${(lcpMs / 1000).toFixed(2)}s` : `${lcpMs}ms`) : "—",
      pct: lcpPct,
    },
    {
      label: secondLabel,
      value: secondMs !== null ? `${secondMs}ms` : "—",
      pct: secondPct,
    },
    {
      label: "CLS",
      value: clsVal.toFixed(3),
      pct: clsPct,
    },
  ];

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
          {overallScore}/100
        </span>
      </div>

      <div className="my-auto flex flex-col gap-4 py-6">
        {vitals.map((vital, idx) => (
          <div key={vital.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                {vital.label}
              </span>
              <span className="font-mono text-muted-foreground [font-variant-numeric:tabular-nums]">
                {vital.value}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D4D4D8] dark:bg-[#26262B]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${vital.pct}%` }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: "easeOut" }}
                className="h-full rounded-full bg-accent"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Diukur langsung dari browser menggunakan PerformanceObserver API.
      </p>
    </GlowCard>
  );
}
