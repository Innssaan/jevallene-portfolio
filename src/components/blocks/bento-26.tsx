import { motion } from "motion/react";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";

const TOPICS = [
  {
    title: "Motion & 3D Web",
    meta: "Three.js Physics & Micro-interactions",
    href: "https://motion.dev",
  },
  {
    title: "React 19 Patterns",
    meta: "Actions & Concurrent UI",
    href: "https://react.dev",
  },
  {
    title: "Web Performance",
    meta: "Core Web Vitals & Zero-CLS",
    href: "https://web.dev/explore/metrics",
  },
];

export default function Bento26() {
  const year = new Date().getFullYear();

  return (
    <GlowCard
      className="h-full min-h-[380px]"
      contentClassName="flex h-full flex-col justify-between p-6"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <BookOpen className="size-3.5 text-accent" />
          Sedang Dieksplorasi
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">{year}</span>
      </div>

      <div className="my-auto flex flex-col divide-y divide-border py-4">
        {TOPICS.map((topic) => (
          <motion.a
            key={topic.title}
            href={topic.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="group/row flex items-center justify-between py-3.5"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {topic.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {topic.meta}
              </p>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-accent" />
          </motion.a>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Riset teknis &amp; eksplorasi rekayasa antarmuka terkini.
      </p>
    </GlowCard>
  );
}
