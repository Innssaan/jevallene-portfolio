import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Terminal } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { playTabSwitchSound } from "@/lib/sound";

interface CheckItem {
  id: string;
  label: string;
  meta: string;
  detail: string;
}

export default function Bento3() {
  const [selected, setSelected] = useState<string>("ts");
  const [latestSha, setLatestSha] = useState<string>("main");

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.github.com/repos/Innssaan/jevallene-portfolio/commits/main", {
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && typeof data?.sha === "string") {
          setLatestSha(data.sha.slice(0, 7));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const checks: CheckItem[] = [
    {
      id: "ts",
      label: "Strict TypeScript",
      meta: "tsc -b",
      detail: "Pemeriksaan tipe statis penuh sebelum bundling produksi Vite.",
    },
    {
      id: "a11y",
      label: "Code-split Chunks",
      meta: "Vite 7",
      detail: "Lazy loading per seksi agar waktu muat awal tetap ringan dan responsif.",
    },
    {
      id: "deploy",
      label: "Auto Deploy Vercel",
      meta: latestSha,
      detail: `Sinkron otomatis dari branch main GitHub (${latestSha}) ke produksi.`,
    },
  ];

  const activeCheck = checks.find((c) => c.id === selected) ?? checks[0];

  return (
    <GlowCard
      className="h-full min-h-[380px]"
      contentClassName="flex h-full flex-col justify-between p-6"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <Terminal className="size-3.5 text-accent" />
          Standar Kode
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">CI/CD</span>
      </div>

      <div className="my-auto flex flex-col gap-2 py-6">
        {checks.map((item) => {
          const active = selected === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => {
                playTabSwitchSound();
                setSelected(item.id);
              }}
              whileTap={{ scale: 0.985 }}
              className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                active
                  ? "border-accent bg-accent text-white shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
                  : "border-[#D4D4D8] bg-white text-foreground hover:border-accent/60 dark:border-[#3A3A44] dark:bg-[#1A1A1F] dark:hover:border-accent/70"
              }`}
            >
              <span className="inline-flex items-center gap-2.5 text-xs font-medium">
                <Check className="size-3.5" />
                {item.label}
              </span>
              <span
                className={`font-mono text-[11px] ${
                  active
                    ? "text-white/85"
                    : "text-muted-foreground"
                }`}
              >
                {item.meta}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {activeCheck.detail}
      </p>
    </GlowCard>
  );
}
