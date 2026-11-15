import { useEffect, useState } from "react";
import { Globe, MapPin } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";

export default function Bento1() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const formatted = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(time);

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(time);

  const quarterLabel = `Q${Math.floor(time.getMonth() / 3) + 1} ${time.getFullYear()}`;

  return (
    <GlowCard
      className="h-full min-h-[380px]"
      contentClassName="flex h-full flex-col justify-between p-6"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <MapPin className="size-3.5 text-accent" />
          Semarang, ID
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#35C46A]/40 bg-[#35C46A]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#35C46A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#35C46A] animate-pulse" />
          Tersedia
        </span>
      </div>

      <div className="my-auto py-8">
        <p className="font-mono text-4xl font-semibold tracking-tight text-foreground [font-variant-numeric:tabular-nums] sm:text-5xl">
          {formatted}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {dateLabel} · WIB (UTC+07:00)
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Globe className="size-3.5" />
          Remote &amp; Onsite
        </span>
        <span className="font-medium text-foreground">
          {quarterLabel}
        </span>
      </div>
    </GlowCard>
  );
}
