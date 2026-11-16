import * as React from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowDownRight, ArrowRight, CircleDot, Crosshair, FileDown, Globe, LayoutGrid, Mail, MousePointer2, Orbit, Palette, Rocket, Settings, Sparkles, SunMedium, Type, Volume2, VolumeX, Waves, X } from "lucide-react";
import { isSoundMuted, playClickSound, playRocketLaunchSound, setSoundMuted } from "@/lib/sound";
import { AnimatedNumber, Magnetic, TextShimmer } from "@/components/ui/micro-interactions";
import {
  DiscordIcon,
  GitHubIcon,
  InstagramIcon,
  SpotifyIcon,
  TikTokIcon,
} from "@/components/ui/social-icons";
import TeamLanyardRail, { type LanyardMember } from "@/components/ui/team-lanyard-rail";
import { type ProjectCategory } from "@/components/ui/projects-bento";
import { GlowCard } from "@/components/ui/glow-card";
import { Parallax, ScrollProgressBar } from "@/components/ui/parallax";
import { AmbientBackground, type BackgroundVariant } from "@/components/ui/ambient-background";
import { Typewriter } from "@/components/ui/typewriter";
import { WelcomeLoader } from "@/components/ui/welcome-loader";
import { RocketReturnOverlay } from "@/components/ui/rocket-return-overlay";
import { CustomCursor, type CursorStyle } from "@/components/ui/custom-cursor";
import PageSkeleton from "@/components/ui/page-skeleton";

const TechStackBento = React.lazy(
  () => import("@/components/ui/interactive-tech-stack-bento-grid-with-hover-effects")
);
const ProjectsBento = React.lazy(() => import("@/components/ui/projects-bento"));
const JourneyBento = React.lazy(() => import("@/components/ui/journey-bento"));
const BentoGrid = React.lazy(() => import("@/components/blocks/bento-grid"));
const ContactSection = React.lazy(() => import("@/components/blocks/contact-section"));
const SpotifySection = React.lazy(() =>
  import("@/components/blocks/spotify-section").then((m) => ({
    default: m.SpotifySection,
  }))
);
const GuestbookPanel = React.lazy(() =>
  import("@/components/blocks/guestbook-panel").then((m) => ({
    default: m.GuestbookPanel,
  }))
);
import { SpiderClonePortrait } from "@/components/ui/spider-clone-portrait";

const PROFILE_LANYARD: LanyardMember[] = [
  {
    id: "profile-main",
    name: "Innssaan",
    role: "Founder Jevallene - Web",
    team: "UI/UX & Visuals",
    tone: 1,
    drop: 4,
    image: "/avatar-innssaan.jpg?v=5",
    bio: "Founder Jevallene di Bandung — Web, UI/UX & Visuals, Videographer, dan Photographer.",
    tags: ["Web", "UI/UX & Visuals", "Videographer", "Photographer"],
    links: [
      { label: "WhatsApp", href: "https://wa.me/628562010605" },
      { label: "Discord", href: "https://discord.gg/yQnaVA475" },
      { label: "GitHub", href: "https://github.com/Innssaan" },
      { label: "TikTok", href: "https://www.tiktok.com/@sannveerse" },
    ],
  },
];

const SKILLS = [
  { label: "HTML5 & CSS3", techId: null },
  { label: "JavaScript (ES6+)", techId: null },
  { label: "TypeScript", techId: "ts" },
  { label: "React / Next.js", techId: "react" },
  { label: "Node.js", techId: "node" },
  { label: "Lua (.lua / Game Dev)", techId: null },
  { label: "C / C++ (Arduino & ESP32)", techId: null },
  { label: "MicroPython & IoT", techId: null },
  { label: "Tailwind CSS", techId: "tailwind" },
  { label: "Figma", techId: null },
  { label: "Photography", techId: null },
  { label: "Videography", techId: null },
  { label: "Git & GitHub", techId: null },
] as const;

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [soundMuted, setSoundMutedState] = React.useState<boolean>(() => isSoundMuted());
  const [lang, setLang] = React.useState<"id" | "en">(() => {
    if (typeof window === "undefined") return "id";
    try {
      return window.localStorage.getItem("jevallene-lang") === "en" ? "en" : "id";
    } catch {
      return "id";
    }
  });
  const [jakartaTime, setJakartaTime] = React.useState<string>("");

  React.useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        setJakartaTime(formatted);
      } catch {
        setJakartaTime("");
      }
    };
    updateClock();
    const timer = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === "id" ? "en" : "id";
      try {
        window.localStorage.setItem("jevallene-lang", next);
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };
  const [introDone, setIntroDone] = React.useState<boolean>(() => {
    try {
      return window.sessionStorage.getItem("jevallene-intro-finished") === "true";
    } catch {
      return false;
    }
  });
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const settingsRef = React.useRef<HTMLDivElement | null>(null);
  const [colorTheme, setColorTheme] = React.useState<"crimson" | "ocean" | "emerald" | "violet" | "amber">(() => {
    if (typeof window === "undefined") return "crimson";
    try {
      const saved = window.localStorage.getItem("jevallene-color-theme");
      return saved === "ocean" || saved === "emerald" || saved === "violet" || saved === "amber" ? saved : "crimson";
    } catch {
      return "crimson";
    }
  });
  const [bgStyle, setBgStyle] = React.useState<BackgroundVariant>(() => {
    if (typeof window === "undefined") return "meteors";
    try {
      const saved = window.localStorage.getItem("jevallene-bg-style");
      return saved === "planets" || saved === "minimalist" || saved === "waves" ? saved : "meteors";
    } catch {
      return "meteors";
    }
  });
  const [cursorStyle, setCursorStyle] = React.useState<CursorStyle>(() => {
    if (typeof window === "undefined") return "system";
    try {
      const saved = window.localStorage.getItem("jevallene-cursor-style");
      return saved === "ring" || saved === "spotlight" || saved === "crosshair" ? saved : "system";
    } catch {
      return "system";
    }
  });
  const [textSize, setTextSize] = React.useState<"sm" | "md" | "lg">(() => {
    if (typeof window === "undefined") return "md";
    try {
      const saved = window.localStorage.getItem("jevallene-text-size");
      return saved === "sm" || saved === "lg" ? saved : "md";
    } catch {
      return "md";
    }
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (colorTheme === "crimson") {
      root.removeAttribute("data-color-theme");
    } else {
      root.setAttribute("data-color-theme", colorTheme);
    }
    try {
      window.localStorage.setItem("jevallene-color-theme", colorTheme);
    } catch {
      // Ignore storage errors
    }
  }, [colorTheme]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem("jevallene-bg-style", bgStyle);
    } catch {
      // Ignore storage errors
    }
  }, [bgStyle]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem("jevallene-cursor-style", cursorStyle);
    } catch {
      // Ignore storage errors
    }
  }, [cursorStyle]);

  React.useEffect(() => {
    const sizeMap = { sm: "14px", md: "16px", lg: "18px" } as const;
    document.documentElement.style.fontSize = sizeMap[textSize];
    try {
      window.localStorage.setItem("jevallene-text-size", textSize);
    } catch {
      // Ignore storage errors
    }
  }, [textSize]);

  React.useEffect(() => {
    if (!settingsOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSettingsOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [settingsOpen]);
  const [activeSection, setActiveSection] = React.useState<string>("");
  const [filter, setFilter] = React.useState<ProjectCategory>("all");
  const [selectedTech, setSelectedTech] = React.useState<string | null>(null);
  const [photoLightboxOpen, setPhotoLightboxOpen] = React.useState(false);
  const [rocketLaunching, setRocketLaunching] = React.useState(false);
  const [showFloatingRocket, setShowFloatingRocket] = React.useState(false);

  React.useEffect(() => {
    const onScrollRocket = () => {
      setShowFloatingRocket(window.scrollY > 420);
    };
    onScrollRocket();
    window.addEventListener("scroll", onScrollRocket, { passive: true });
    return () => window.removeEventListener("scroll", onScrollRocket);
  }, []);

  const handleRocketBackToTop = React.useCallback(() => {
    if (rocketLaunching) return;
    playRocketLaunchSound();
    setRocketLaunching(true);
  }, [rocketLaunching]);

  const handleRocketMidpoint = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    setActiveSection("");
  }, []);

  const handleRocketComplete = React.useCallback(() => {
    setRocketLaunching(false);
  }, []);

  React.useEffect(() => {
    if (!photoLightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhotoLightboxOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [photoLightboxOpen]);
  const [formStatus, setFormStatus] = React.useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "dark");
    root.classList.add("dark");
    try {
      localStorage.removeItem("theme");
    } catch {
      // Ignore storage errors
    }
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 550);
    return () => window.clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'button, a, [role="button"], [role="tab"]'
      ) as HTMLElement | null;
      if (!interactive || interactive.id === "soundToggle") return;
      playClickSound();
    };
    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, []);

  const navClickLockUntil = React.useRef(0);

  React.useEffect(() => {
    if (isLoading) return;
    const ids = ["tentang", "proyek", "pengalaman", "kontak"];
    const onScroll = () => {
      if (Date.now() < navClickLockUntil.current) return;
      if (window.scrollY < 120) {
        setActiveSection("");
        return;
      }
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 40
      ) {
        setActiveSection("kontak");
        return;
      }
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 180) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLoading]);

  React.useEffect(() => {
    if (isLoading) return;
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filter, isLoading]);

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topics = String(data.get("topics") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setFormStatus({
        message: "Mohon lengkapi semua kolom terlebih dahulu.",
        type: "error",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormStatus({
        message: "Format email tidak valid.",
        type: "error",
      });
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();
    if (!accessKey) {
      setFormStatus({
        message: `Terima kasih, ${name}! Pesan diterima (mode preview — tambahkan VITE_WEB3FORMS_ACCESS_KEY untuk kirim email nyata).`,
        type: "success",
      });
      form.reset();
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ message: "", type: "" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Pesan Baru dari Jevallene (${topics || "Umum"}) — ${name}`,
          from_name: "JEVALLENE Website",
          name,
          email,
          topics: topics || "-",
          message,
        }),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };
      if (response.ok && result.success) {
        setFormStatus({
          message: `Terima kasih, ${name}! Pesan Anda sudah terkirim dan akan segera dibalas.`,
          type: "success",
        });
        form.reset();
      } else {
        setFormStatus({
          message: result.message || "Gagal mengirim pesan. Silakan coba lagi atau hubungi via WhatsApp.",
          type: "error",
        });
      }
    } catch {
      setFormStatus({
        message: "Terjadi gangguan koneksi saat mengirim pesan. Silakan coba lagi.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <>
      {!introDone && (
        <WelcomeLoader
          onComplete={() => {
            try {
              window.sessionStorage.setItem("jevallene-intro-finished", "true");
            } catch {
              // ignore storage errors
            }
            setIntroDone(true);
          }}
        />
      )}
      <AmbientBackground variant={bgStyle} />
      <CustomCursor variant={cursorStyle} />
      <ScrollProgressBar />

      {/* Announcement Strip */}
      <div className="relative z-40 border-b border-white/5 bg-[#0b0b0e]">
        <div className="container flex flex-wrap items-center justify-center gap-2.5 py-2 text-[10px] tracking-[0.2em] text-[#9A9AA2]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span>JEVALLENE · CREATIVE DIGITAL STUDIO</span>
          {jakartaTime && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] tracking-[0.14em] text-[#D4D4D8]">
              {jakartaTime} WIB (UTC+7)
            </span>
          )}
          <a
            href="#kontak"
            className="inline-flex items-center gap-1 font-medium text-[#F5F5F7] transition-colors hover:text-accent-hover"
          >
            {lang === "en" ? "Start a Discussion" : "Mulai Berdiskusi"}
            <ArrowRight className="size-3" />
          </a>
        </div>
      </div>

      <header className="pointer-events-none sticky top-2.5 sm:top-3.5 z-50 px-2 sm:px-4 pt-2 sm:pt-3 pb-1" id="header">
        <div ref={settingsRef} className="pointer-events-auto relative mx-auto w-fit max-w-full">
          <div className="relative flex w-fit max-w-full items-center justify-center gap-1 sm:gap-2.5 md:gap-3 rounded-full border border-black/10 bg-white/65 px-2 sm:px-2.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl dark:border-white/[0.12] dark:bg-[#121218]/60 dark:shadow-[0_14px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14)]">
            <a href="#hero" aria-label="Jevallene Home" className="logo group flex shrink-0 items-center pl-0.5 sm:pl-1 pr-0.5 sm:pr-1">
              <span className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105">
                <svg
                  viewBox="0 0 28 28"
                  className="h-full w-full overflow-visible"
                  aria-hidden="true"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="12.5"
                    fill="none"
                    stroke="var(--accent, var(--accent))"
                    strokeWidth="1.5"
                  />
                  {/* Continuous smooth morph: . -> - -> I -> J -> I -> - -> . */}
                  <motion.path
                    fill="none"
                    stroke="var(--accent, var(--accent))"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{
                      d: [
                        "M 14 14 L 14 14 C 14 14 14 14 14 14",
                        "M 9.5 14 L 14 14 C 16 14 17.5 14 18.5 14",
                        "M 14 8.5 L 14 15.5 C 14 17.5 14 18.8 14 19.6",
                        "M 16.5 8.5 L 16.5 15.8 C 16.5 19.5 11.2 20.5 9.6 17.2",
                        "M 16.5 8.5 L 16.5 15.8 C 16.5 19.5 11.2 20.5 9.6 17.2",
                        "M 14 8.5 L 14 15.5 C 14 17.5 14 18.8 14 19.6",
                        "M 9.5 14 L 14 14 C 16 14 17.5 14 18.5 14",
                        "M 14 14 L 14 14 C 14 14 14 14 14 14",
                      ],
                    }}
                    transition={{
                      duration: 4.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.14, 0.28, 0.44, 0.62, 0.76, 0.88, 1],
                    }}
                  />
                </svg>
              </span>
            </a>

            <LayoutGroup id="navbar-tabs">
              <nav
                className="flex min-w-0 items-center"
                id="nav"
                aria-label="Navigasi utama"
              >
                <ul className="flex items-center gap-0.5 sm:gap-1">
                  {[
                    { id: "tentang", label: lang === "en" ? "About" : "Tentang" },
                    { id: "proyek", label: lang === "en" ? "Projects" : "Proyek" },
                    { id: "pengalaman", label: lang === "en" ? "Experience" : "Pengalaman" },
                    { id: "kontak", label: lang === "en" ? "Contact" : "Kontak" },
                  ].map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          aria-current={isActive ? "page" : undefined}
                          className={`relative inline-flex items-center whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-medium transition-colors duration-200 sm:px-3 sm:py-1.5 sm:text-xs lg:px-3.5 lg:text-[13px] ${
                            isActive
                              ? "text-neutral-950 dark:text-[#FAFAFA]"
                              : "text-neutral-600 hover:text-neutral-950 dark:text-[#9A9AA2] dark:hover:text-[#FAFAFA]"
                          }`}
                          onClick={() => {
                            navClickLockUntil.current = Date.now() + 850;
                            setActiveSection(item.id);
                          }}
                        >
                          {isActive && (
                            <motion.span
                              layout
                              layoutId="nav-active-pill"
                              transition={{
                                type: "spring",
                                stiffness: 420,
                                damping: 34,
                                mass: 0.75,
                              }}
                              className="absolute inset-0 rounded-full border border-accent/25 bg-accent/10 dark:border-accent/30 dark:bg-accent/15"
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1.5">
                            <span>{item.label}</span>
                            <span
                              aria-hidden="true"
                              className={`hidden h-1.5 w-1.5 rounded-full bg-accent transition-all duration-200 sm:inline-block ${
                                isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                              }`}
                            />
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </LayoutGroup>

            <div className="flex shrink-0 items-center">
              <motion.button
                type="button"
                id="settingsToggle"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.93 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                aria-label={lang === "en" ? "Website settings" : "Pengaturan web"}
                aria-expanded={settingsOpen}
                aria-haspopup="menu"
                title={lang === "en" ? "Settings" : "Pengaturan"}
                onClick={() => {
                  playClickSound();
                  setSettingsOpen((prev) => !prev);
                }}
                className={`flex h-7 w-7 items-center justify-center rounded-full border backdrop-blur-md transition-colors ${
                  settingsOpen
                    ? "border-white/35 bg-white/[0.12] text-[#FAFAFA]"
                    : "border-white/15 bg-white/[0.04] text-[#9A9AA2] hover:border-white/30 hover:bg-white/[0.09] hover:text-[#FAFAFA]"
                }`}
              >
                <Settings
                  size={14}
                  className={`transition-transform duration-300 ${settingsOpen ? "rotate-90" : ""}`}
                />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                role="menu"
                aria-label={lang === "en" ? "Preferences" : "Preferensi"}
                className="absolute left-1/2 top-[calc(100%+10px)] z-50 w-[min(304px,calc(100vw-1.5rem))] -translate-x-1/2 rounded-2xl border border-white/[0.12] bg-[#111116]/95 p-3.5 shadow-[0_18px_48px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:left-auto sm:right-0 sm:w-64 sm:translate-x-0"
              >
                  <div className="mb-2.5 flex items-center justify-between border-b border-white/[0.07] pb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9A9AA2]">
                      {lang === "en" ? "Settings" : "Pengaturan"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Bahasa */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-xs text-[#D4D4D8]">
                        <Globe size={13} className="text-[#9A9AA2]" />
                        {lang === "en" ? "Language" : "Bahasa"}
                      </span>
                      <div className="flex items-center rounded-full border border-white/10 bg-white/[0.04] p-0.5">
                        {(["id", "en"] as const).map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => {
                              if (lang !== code) toggleLanguage();
                              playClickSound();
                            }}
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                              lang === code
                                ? "bg-white/15 text-[#FAFAFA]"
                                : "text-[#9A9AA2] hover:text-[#FAFAFA]"
                            }`}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mute / Unmute */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-xs text-[#D4D4D8]">
                        {soundMuted ? (
                          <VolumeX size={13} className="text-[#9A9AA2]" />
                        ) : (
                          <Volume2 size={13} className="text-[#9A9AA2]" />
                        )}
                        {lang === "en" ? "Sound" : "Suara"}
                      </span>
                      <button
                        type="button"
                        id="soundToggle"
                        onClick={() => {
                          const nextMuted = !soundMuted;
                          setSoundMuted(nextMuted);
                          setSoundMutedState(nextMuted);
                          if (!nextMuted) playClickSound(true);
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                          soundMuted
                            ? "border-white/10 bg-white/[0.04] text-[#9A9AA2] hover:text-[#FAFAFA]"
                            : "border-white/25 bg-white/[0.12] text-[#FAFAFA]"
                        }`}
                      >
                        {soundMuted
                          ? lang === "en"
                            ? "Muted"
                            : "Mati"
                          : lang === "en"
                            ? "Active"
                            : "Aktif"}
                      </button>
                    </div>

                    {/* Tema Warna Web */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-xs text-[#D4D4D8]">
                        <Palette size={13} className="text-[#9A9AA2]" />
                        {lang === "en" ? "Theme" : "Tema Warna"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {(
                          [
                            { id: "crimson", color: "#E5142A", label: "Crimson" },
                            { id: "amber", color: "#F59E0B", label: "Amber" },
                            { id: "ocean", color: "#3B82F6", label: "Ocean" },
                            { id: "emerald", color: "#10B981", label: "Emerald" },
                            { id: "violet", color: "#8B5CF6", label: "Violet" },
                          ] as const
                        ).map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            aria-label={t.label}
                            title={t.label}
                            onClick={() => {
                              setColorTheme(t.id);
                              playClickSound();
                            }}
                            className={`h-4 w-4 rounded-full transition-transform ${
                              colorTheme === t.id
                                ? "scale-110 ring-2 ring-white/80 ring-offset-2 ring-offset-[#111116]"
                                : "opacity-75 hover:scale-105 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: t.color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Background (icon-only options) */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-xs text-[#D4D4D8]">
                        <Sparkles size={13} className="text-[#9A9AA2]" />
                        {lang === "en" ? "Background" : "Latar"}
                      </span>
                      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-0.5">
                        {(
                          [
                            { id: "meteors", label: lang === "en" ? "Stars" : "Bintang", Icon: Sparkles },
                            { id: "planets", label: "Planet", Icon: Orbit },
                            { id: "minimalist", label: lang === "en" ? "Minimal" : "Minimalis", Icon: LayoutGrid },
                            { id: "waves", label: lang === "en" ? "Waves" : "Ombak", Icon: Waves },
                          ] as const
                        ).map(({ id, label, Icon }) => (
                          <button
                            key={id}
                            type="button"
                            aria-label={label}
                            title={label}
                            onClick={() => {
                              setBgStyle(id);
                              playClickSound();
                            }}
                            className={`flex h-5 w-6 items-center justify-center rounded-full transition-colors ${
                              bgStyle === id
                                ? "bg-white/15 text-[#FAFAFA]"
                                : "text-[#9A9AA2] hover:text-[#FAFAFA]"
                            }`}
                          >
                            <Icon size={12} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Kursor (hanya tampil di desktop / layar md+) */}
                    <div className="hidden md:flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-xs text-[#D4D4D8]">
                        <MousePointer2 size={13} className="text-[#9A9AA2]" />
                        {lang === "en" ? "Cursor" : "Kursor"}
                      </span>
                      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-0.5">
                        {(
                          [
                            { id: "system", label: lang === "en" ? "Device Default" : "Bawaan Device", Icon: MousePointer2 },
                            { id: "ring", label: "Halo Ring", Icon: CircleDot },
                            { id: "spotlight", label: "Spotlight", Icon: SunMedium },
                            { id: "crosshair", label: "Studio Reticle", Icon: Crosshair },
                          ] as const
                        ).map(({ id, label, Icon }) => (
                          <button
                            key={id}
                            type="button"
                            aria-label={label}
                            title={label}
                            onClick={() => {
                              setCursorStyle(id);
                              playClickSound();
                            }}
                            className={`flex h-5 w-6 items-center justify-center rounded-full transition-colors ${
                              cursorStyle === id
                                ? "bg-white/15 text-[#FAFAFA]"
                                : "text-[#9A9AA2] hover:text-[#FAFAFA]"
                            }`}
                          >
                            <Icon size={12} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ukuran Teks */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-xs text-[#D4D4D8]">
                        <Type size={13} className="text-[#9A9AA2]" />
                        {lang === "en" ? "Text Size" : "Ukuran Teks"}
                      </span>
                      <div className="flex items-center rounded-full border border-white/10 bg-white/[0.04] p-0.5">
                        {(
                          [
                            { id: "sm", label: "S" },
                            { id: "md", label: "M" },
                            { id: "lg", label: "L" },
                          ] as const
                        ).map((sz) => (
                          <button
                            key={sz.id}
                            type="button"
                            onClick={() => {
                              setTextSize(sz.id);
                              playClickSound();
                            }}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                              textSize === sz.id
                                ? "bg-white/15 text-[#FAFAFA]"
                                : "text-[#9A9AA2] hover:text-[#FAFAFA]"
                            }`}
                          >
                            {sz.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </header>

      <motion.main
        animate={
          rocketLaunching
            ? { opacity: 0.72, scale: 0.975 }
            : { opacity: 1, scale: 1 }
        }
        transition={{
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 origin-top will-change-transform"
        style={{ "--rb-section-min-h": "0px" } as React.CSSProperties}
      >
        <section className="hero relative overflow-x-clip !pt-0" id="hero">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/3 h-[480px] w-[480px] rounded-full bg-accent/15 blur-[130px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/2 h-[380px] w-[380px] rounded-full bg-accent/10 blur-[110px]"
          />

          <div className="container relative">
            <div className="hero-grid grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
              <Parallax offset={16} immediate className="hero-content reveal pt-6 lg:pt-10">
                <div className="mb-5 flex flex-wrap items-center gap-3 text-[10px] tracking-[0.24em] text-neutral-500 dark:text-[#9A9AA2]">
                  <span className="font-semibold text-accent">00</span>
                  <span className="h-px w-10 bg-neutral-300 dark:bg-[#9A9AA2]/40" />
                  <TextShimmer>CREATIVE STUDIO · JEVALLENE</TextShimmer>
                  <span className="hidden sm:inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#35C46A]" />
                    BANDUNG
                  </span>
                </div>

                <h1 className="text-[clamp(2.35rem,5.4vw,4.35rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                  <span className="block text-[#F5F5F7]">
                    {lang === "en" ? "I'm Innssaan," : "Saya Innssaan,"}
                  </span>
                  <span className="block text-[#C4C4CC]">
                    {lang === "en" ? "Precision in Code," : "Presisi dalam Kode,"}
                  </span>
                  <span className="block text-[#F5F5F7]">
                    {lang === "en" ? "Character in Visuals." : "Karakter dalam Visual."}
                  </span>
                </h1>

                <p className="mt-4 min-h-[3.25rem] sm:min-h-[1.75rem] text-base sm:text-lg font-semibold text-accent">
                  <Typewriter
                    phrases={[
                      "Founder Jevallene - Web",
                      "UI/UX & Visuals",
                      "Videographer & Photographer",
                      "Interactive 3D & React Specialist",
                    ]}
                  />
                </p>

                <p className="hero-subtitle mt-4">
                  {lang === "en"
                    ? "Through Jevallene in Bandung, I unite modern web engineering, UI/UX design, photography, and videography under one creative roof. From interactive interfaces to visual production, every detail is crafted to feel fast, refined, and unforgettable."
                    : "Melalui Jevallene di Bandung, saya memadukan rekayasa web modern, desain UI/UX, serta fotografi dan videografi dalam satu atap kreatif. Mulai dari antarmuka interaktif hingga produksi visual, setiap detail dibangun agar terasa cepat, matang, dan berkesan."}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Magnetic strength={0.18}>
                    <a
                      href="#proyek"
                      className="btn-21-shine group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-accent to-[var(--accent-dark)] py-2 pl-6 pr-2 text-sm font-semibold text-white shadow-[0_0_55px_rgba(var(--accent-rgb),0.35)] transition-all duration-300 hover:from-accent-hover hover:to-accent hover:shadow-[0_0_80px_rgba(var(--accent-rgb),0.55)] active:scale-[0.98]"
                    >
                      <span>{lang === "en" ? "View Work" : "Lihat Karya"}</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-all group-hover:bg-white/25 group-hover:rotate-12">
                        <ArrowDownRight className="size-4 text-white" />
                      </span>
                    </a>
                  </Magnetic>
                  <Magnetic strength={0.18}>
                    <a
                      href="https://wa.me/628562010605"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-21-shine group inline-flex items-center gap-2 rounded-full border border-[#D4D4D8] px-5 py-3 text-xs font-semibold text-neutral-900 transition-all hover:border-accent hover:text-accent dark:border-[#3A3A44] dark:text-[#FAFAFA] dark:hover:bg-white/5 dark:hover:border-accent"
                    >
                      <Mail className="size-3.5 text-accent transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6" />
                      <span>{lang === "en" ? "Let's Talk" : "Hubungi Saya"}</span>
                    </a>
                  </Magnetic>
                  <Magnetic strength={0.16}>
                    <a
                      href="/Jevallene-Profile-CV.pdf"
                      download="Jevallene-Profile-CV.pdf"
                      onClick={() => playClickSound()}
                      className="btn-21-shine group inline-flex items-center gap-2 rounded-full border border-[#D4D4D8] px-4 py-3 text-xs font-semibold text-neutral-900 transition-all hover:border-accent hover:text-accent dark:border-[#3A3A44] dark:text-[#FAFAFA] dark:hover:bg-white/5 dark:hover:border-accent"
                    >
                      <FileDown className="size-3.5 text-accent transition-transform duration-200 group-hover:translate-y-0.5" />
                      <span>{lang === "en" ? "Resume PDF" : "Unduh CV"}</span>
                    </a>
                  </Magnetic>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <a
                    href="https://github.com/Innssaan"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="group relative inline-flex items-center gap-1.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-[#9A9AA2] dark:hover:text-[#FAFAFA]"
                  >
                    <GitHubIcon className="size-3.5 text-neutral-900 transition-transform duration-200 group-hover:-translate-y-0.5 dark:text-[#FAFAFA]" />
                    <span>GitHub</span>
                    <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-neutral-900 transition-transform duration-200 group-hover:scale-x-100 dark:bg-[#FAFAFA]" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@sannveerse"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="group relative inline-flex items-center gap-1.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:text-[#FE2C55] dark:text-[#9A9AA2] dark:hover:text-[#FE2C55]"
                  >
                    <TikTokIcon className="size-3.5 text-neutral-900 transition-transform duration-200 group-hover:-translate-y-0.5 dark:text-white" />
                    <span>TikTok</span>
                    <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#FE2C55] transition-transform duration-200 group-hover:scale-x-100" />
                  </a>
                  <a
                    href="https://www.instagram.com/innssaan_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="group relative inline-flex items-center gap-1.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:text-[#E4405F] dark:text-[#9A9AA2] dark:hover:text-[#E4405F]"
                  >
                    <InstagramIcon className="size-3.5 text-[#E4405F] transition-transform duration-200 group-hover:-translate-y-0.5" />
                    <span>Instagram</span>
                    <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#E4405F] transition-transform duration-200 group-hover:scale-x-100" />
                  </a>
                  <a
                    href="https://open.spotify.com/user/Innssaan_"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Daily Spotify"
                    className="group relative inline-flex items-center gap-1.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:text-[#1DB954] dark:text-[#9A9AA2] dark:hover:text-[#35C46A]"
                  >
                    <SpotifyIcon className="size-3.5 text-[#1DB954] transition-transform duration-200 group-hover:-translate-y-0.5 dark:text-[#35C46A]" />
                    <span>Daily Spotify</span>
                    <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#35C46A] transition-transform duration-200 group-hover:scale-x-100" />
                  </a>
                  <a
                    href="https://discord.gg/yQnaVA475"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Discord"
                    className="group relative inline-flex items-center gap-1.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:text-[#5865F2] dark:text-[#9A9AA2] dark:hover:text-[#7289DA]"
                  >
                    <DiscordIcon className="size-3.5 text-[#5865F2] transition-transform duration-200 group-hover:-translate-y-0.5" />
                    <span>Discord</span>
                    <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#5865F2] transition-transform duration-200 group-hover:scale-x-100" />
                  </a>
                </div>
              </Parallax>

              <div className="hero-visual reveal self-start relative z-30 mx-auto w-full max-w-[380px] lg:max-w-[460px] mt-0 pt-0 lg:-mt-[62px]">
                <TeamLanyardRail
                  seamless
                  autoplay
                  items={PROFILE_LANYARD}
                  caption={
                    lang === "en"
                      ? "Pull the lanyard or click the card to flip"
                      : "Tarik lanyard atau sentuh kartu untuk melihat profil lengkap"
                  }
                  labels={{
                    flip: "Klik atau tekan Enter untuk membalik kartu",
                    back: "Klik lagi atau tekan Esc untuk kembali",
                    show: "Tampilkan",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="tentang">
          <div className="container">
            <Parallax offset={12}>
              <div className="section-header reveal">
                <span className="section-tag">
                  {lang === "en" ? "About" : "Tentang"}
                </span>
                <h2 className="section-title">
                  {lang === "en"
                    ? "Where clean code meets functional design and visual storytelling"
                    : "Perpaduan kode yang rapi, desain fungsional, dan visual yang bercerita"}
                </h2>
              </div>
            </Parallax>

            <div className="about-grid">
              <Parallax offset={14} delay={0.06} variant="left">
                <div className="about-text reveal">
                  <div className="mb-7 flex flex-col sm:flex-row sm:items-end gap-5">
                    <SpiderClonePortrait />
                    <div className="min-w-0 flex-1 pb-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xl font-bold tracking-tight text-neutral-950 dark:text-[#FAFAFA]">
                          Innssaan
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#35C46A]/35 bg-[#35C46A]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#35C46A]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#35C46A]" />
                          Active
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-[#9A9AA2]">
                        Founder Jevallene - Web · UI/UX &amp; Visuals · Videographer · Photographer
                      </p>
                    </div>
                  </div>
                  <p>
                    {lang === "en"
                      ? "I design and build fast, responsive, and intuitive websites and digital interfaces. My focus is turning ideas into digital products that feel refined visually and solid under the hood."
                      : "Saya merancang dan membangun website serta antarmuka digital yang cepat, responsif, dan mudah digunakan. Fokus saya adalah mengubah ide menjadi produk digital yang bersih secara visual dan solid secara teknis."}
                  </p>
                  <p>
                    {lang === "en"
                      ? "Beyond the browser, I work on commercial photography and videography—from editorial portraits and product shoots to cinematic short-form videos that elevate brand presence."
                      : "Di luar pengembangan web, saya aktif menggarap fotografi dan videografi—mulai dari potret editorial, katalog produk, hingga video pendek sinematik untuk membantu brand tampil lebih kuat."}
                  </p>

                  <div className="stats-row">
                    <div className="stat-item">
                      <span className="stat-number">
                        <AnimatedNumber value={3} suffix="+" />
                      </span>
                      <span className="stat-label">Tahun Pengalaman</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">
                        <AnimatedNumber value={20} suffix="+" />
                      </span>
                      <span className="stat-label">Proyek Selesai</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">
                        <AnimatedNumber value={10} suffix="+" />
                      </span>
                      <span className="stat-label">Klien &amp; Kolaborasi</span>
                    </div>
                  </div>
                </div>
              </Parallax>

              <Parallax offset={14} delay={0.14}>
                <GlowCard accent="indigo" className="reveal" contentClassName="p-6 sm:p-7">
                  <div className="skills-card !border-0 !bg-transparent !p-0 !shadow-none">
                    <h3 className="mb-4 text-lg font-semibold tracking-tight text-zinc-950 dark:text-[#FAFAFA]">
                      Keahlian Utama
                    </h3>
                    <div className="skills-list flex flex-wrap gap-2.5">
                    {SKILLS.map((skill) => {
                      const isSynced =
                        selectedTech !== null &&
                        (skill.techId === selectedTech ||
                          (selectedTech === "next" && skill.techId === "react"));
                      return (
                        <motion.button
                          key={skill.label}
                          type="button"
                          whileHover={{ y: -2, scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 380, damping: 22 }}
                          onClick={() => {
                            if (skill.techId) {
                              setSelectedTech((prev) =>
                                prev === skill.techId ? null : skill.techId
                              );
                            }
                          }}
                          className={`skill-pill btn-21-shine transition-all ${
                            skill.techId ? "cursor-pointer" : "cursor-default"
                          } ${
                            isSynced
                              ? "!border-accent !bg-accent !text-[#08080A] font-semibold shadow-[0_0_24px_rgba(var(--accent-rgb),0.4)]"
                              : ""
                          }`}
                        >
                          {skill.label}
                        </motion.button>
                      );
                    })}
                    </div>
                  </div>
                </GlowCard>
              </Parallax>
            </div>
          </div>
        </section>

        <React.Suspense fallback={null}>
          <Parallax offset={14} variant="zoom">
            <TechStackBento
              selectedTech={selectedTech}
              onSelectTech={setSelectedTech}
              lang={lang}
            />
          </Parallax>

          <Parallax offset={16} variant="up">
            <ProjectsBento
              filter={filter}
              onFilterChange={setFilter}
              selectedTech={selectedTech}
              onSelectTech={setSelectedTech}
              lang={lang}
            />
          </Parallax>

          <Parallax offset={14} variant="tilt">
            <JourneyBento lang={lang} />
          </Parallax>

          <Parallax offset={12} variant="zoom">
            <BentoGrid />
          </Parallax>

          <Parallax offset={14} variant="left">
            <SpotifySection />
          </Parallax>

          <Parallax offset={12} variant="right">
            <ContactSection
              formStatus={formStatus}
              isSubmitting={isSubmitting}
              onSubmit={handleContactSubmit}
            />
          </Parallax>

          <Parallax offset={10} variant="up">
            <GuestbookPanel />
          </Parallax>
        </React.Suspense>
      </motion.main>

      <footer className="footer relative z-10 border-t border-white/[0.08] bg-white/[0.015] text-xs text-[#9A9AA2]">
        <div className="container py-10">
          {/* Top subtle note */}
          <p className="border-b border-black/10 pb-4 text-[11px] leading-relaxed text-neutral-500 dark:border-white/[0.08] dark:text-[#7E7E88]">
            {lang === "en"
              ? "Jevallene — Creative Digital Studio by Innssaan, specializing in Web Development, UI/UX Design, Photography, and Videography."
              : "Jevallene — Creative Digital Studio oleh Innssaan. Bergerak di bidang Web Development, UI/UX Design, Fotografi, dan Videografi."}
          </p>

          {/* Multi-column Apple-style directory */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-black/10 py-8 sm:grid-cols-3 lg:grid-cols-5 dark:border-white/[0.08]">
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-semibold tracking-wide text-neutral-900 dark:text-[#FAFAFA]">
                Navigasi
              </h3>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a href="#hero" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="#tentang" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Tentang Saya
                  </a>
                </li>
                <li>
                  <a href="#proyek" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Proyek Pilihan
                  </a>
                </li>
                <li>
                  <a href="#pengalaman" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Pengalaman
                  </a>
                </li>
                <li>
                  <a href="#kontak" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Kontak
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-[11px] font-semibold tracking-wide text-neutral-900 dark:text-[#FAFAFA]">
                Fokus &amp; Keahlian
              </h3>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a href="#proyek" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Web Development
                  </a>
                </li>
                <li>
                  <a href="#proyek" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    UI/UX Design
                  </a>
                </li>
                <li>
                  <a href="#pengalaman" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Frontend Architecture
                  </a>
                </li>
                <li>
                  <a href="#proyek" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Interactive Motion
                  </a>
                </li>
                <li>
                  <a href="#tentang" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Fotografi &amp; Videografi
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-[11px] font-semibold tracking-wide text-neutral-900 dark:text-[#FAFAFA]">
                Karya &amp; Ruang
              </h3>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a href="#proyek" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Arsip Proyek
                  </a>
                </li>
                <li>
                  <a href="#pengalaman" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Perjalanan Karier
                  </a>
                </li>
                <li>
                  <a
                    href="https://open.spotify.com/user/Innssaan_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#35C46A] dark:hover:text-[#35C46A]"
                  >
                    Daily Spotify
                  </a>
                </li>
                <li>
                  <a href="#kontak" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Buku Tamu
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-[11px] font-semibold tracking-wide text-neutral-900 dark:text-[#FAFAFA]">
                Terhubung
              </h3>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a
                    href="https://github.com/Innssaan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/innssaan_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#E4405F] dark:hover:text-[#E4405F]"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@sannveerse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#FE2C55] dark:hover:text-[#FE2C55]"
                  >
                    TikTok
                  </a>
                </li>
                <li>
                  <a
                    href="https://open.spotify.com/user/Innssaan_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#35C46A] dark:hover:text-[#35C46A]"
                  >
                    Spotify
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/628562010605"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#25D366] dark:hover:text-[#25D366]"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/yQnaVA475"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#5865F2] dark:hover:text-[#7289DA]"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:rifkitv21@gmail.com"
                    className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-[11px] font-semibold tracking-wide text-neutral-900 dark:text-[#FAFAFA]">
                Lokasi &amp; Status
              </h3>
              <ul className="space-y-1.5 text-[11px]">
                <li className="text-neutral-500 dark:text-[#7E7E88]">Bandung, Indonesia</li>
                <li>
                  <a href="#kontak" className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]">
                    Tersedia untuk Kolaborasi
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/628562010605"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent dark:hover:text-[#FAFAFA]"
                  >
                    Diskusi Proyek
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick contact line */}
          <p className="border-b border-black/10 py-4 text-[11px] text-neutral-500 dark:border-white/[0.08] dark:text-[#7E7E88]">
            Tertarik mendiskusikan proyek atau peluang kolaborasi? Hubungi langsung via{" "}
            <a
              href="https://wa.me/628562010605"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
            >
              WhatsApp
            </a>{" "}
            atau kirimkan detail kebutuhan melalui{" "}
            <a
              href="#kontak"
              className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
            >
              formulir kontak
            </a>
            .
          </p>

          {/* Bottom copyright, quick links, social icons & back to top */}
          <div className="flex flex-col justify-between gap-4 pt-4 text-[11px] md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-neutral-500 dark:text-[#7E7E88]">
                &copy; {new Date().getFullYear()} Innssaan · JEVALLENE. Seluruh hak cipta dilindungi.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-neutral-500 dark:text-[#7E7E88]">
                <a href="#tentang" className="transition-colors hover:text-neutral-900 dark:hover:text-[#FAFAFA]">
                  Tentang
                </a>
                <span aria-hidden="true">|</span>
                <a href="#proyek" className="transition-colors hover:text-neutral-900 dark:hover:text-[#FAFAFA]">
                  Proyek
                </a>
                <span aria-hidden="true">|</span>
                <a href="#pengalaman" className="transition-colors hover:text-neutral-900 dark:hover:text-[#FAFAFA]">
                  Pengalaman
                </a>
                <span aria-hidden="true">|</span>
                <a href="#kontak" className="transition-colors hover:text-neutral-900 dark:hover:text-[#FAFAFA]">
                  Kontak
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-4">
                <motion.a
                  whileHover={{ y: -2, scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  href="https://github.com/Innssaan"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-neutral-800 transition-colors hover:text-black dark:text-[#E4E4E7] dark:hover:text-white"
                >
                  <GitHubIcon className="size-4" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -2, scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  href="https://www.instagram.com/innssaan_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-[#E4405F] transition-opacity hover:opacity-80"
                >
                  <InstagramIcon className="size-4" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -2, scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  href="https://www.tiktok.com/@sannveerse"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="text-neutral-900 transition-opacity hover:opacity-80 dark:text-white"
                >
                  <TikTokIcon className="size-4" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -2, scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  href="https://open.spotify.com/user/Innssaan_"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Daily Spotify"
                  className="text-[#1DB954] transition-opacity hover:opacity-80 dark:text-[#35C46A]"
                >
                  <SpotifyIcon className="size-4" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -2, scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  href="https://discord.gg/yQnaVA475"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                  className="text-[#5865F2] transition-opacity hover:opacity-80"
                >
                  <DiscordIcon className="size-4" />
                </motion.a>
              </div>
              <span className="hidden text-neutral-500 sm:inline dark:text-[#7E7E88]">
                Bandung, Indonesia
              </span>
              <motion.button
                type="button"
                onClick={handleRocketBackToTop}
                disabled={rocketLaunching}
                whileHover={{ y: -2, scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className="back-to-top group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 transition-colors hover:border-accent/50 hover:bg-accent/15 hover:text-white disabled:cursor-wait disabled:opacity-70"
              >
                <Rocket className="size-3.5 text-accent transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                {lang === "en" ? "Back to top" : "Kembali ke atas"} &uarr;
              </motion.button>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {photoLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setPhotoLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Foto profil fullscreen"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setPhotoLightboxOpen(false)}
              aria-label="Tutup tampilan fullscreen"
              className="fixed right-4 top-4 sm:right-6 sm:top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-accent hover:border-accent"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[88vh] max-w-[90vw] overflow-hidden rounded-2xl border border-white/15 bg-[#0E0E12] shadow-2xl"
            >
              <img
                src="/avatar-innssaan.jpg?v=5"
                alt="Foto profil Innssaan ukuran penuh"
                className="max-h-[84vh] w-auto max-w-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFloatingRocket && !rocketLaunching && (
          <motion.button
            key="floating-rocket-top"
            type="button"
            onClick={handleRocketBackToTop}
            aria-label={lang === "en" ? "Launch rocket back to top" : "Luncurkan roket kembali ke atas"}
            title={lang === "en" ? "Back to top" : "Kembali ke atas"}
            initial={{ opacity: 0, y: 24, scale: 0.75 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.75 }}
            whileHover={{ y: -4, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="group fixed bottom-5 right-5 z-[90] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-accent/60 bg-[#0B0B0F]/90 text-white shadow-[0_0_28px_rgba(var(--accent-rgb),0.45)] backdrop-blur-md transition-colors hover:border-[var(--accent-bright)] hover:bg-accent sm:bottom-7 sm:right-7"
          >
            <Rocket className="size-5 text-accent transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <RocketReturnOverlay
        active={rocketLaunching}
        onMidpoint={handleRocketMidpoint}
        onComplete={handleRocketComplete}
      />
    </>
  );
}
