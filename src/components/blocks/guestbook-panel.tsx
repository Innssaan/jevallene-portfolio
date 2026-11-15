import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { MessageSquare, Send, User } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { Magnetic } from "@/components/ui/micro-interactions";

interface GuestbookComment {
  id: string;
  name: string;
  role: string;
  message: string;
  date: string;
}

const STORAGE_KEY = "jevallene-guestbook-comments";

const INITIAL_COMMENTS: GuestbookComment[] = [
  {
    id: "seed-1",
    name: "Raka Pratama",
    role: "Frontend Engineer",
    message:
      "Transisi parallax dan interaksi lanyard 3D terasa sangat responsif. Detail tipografi dan kontrasnya juga rapi di mode gelap.",
    date: "Hari ini",
  },
  {
    id: "seed-2",
    name: "Nadia Kusuma",
    role: "UI/UX Designer",
    message:
      "Integrasi pemutar Spotify memberikan pengalaman menjelajah portofolio yang lebih hidup dan berkarakter.",
    date: "Kemarin",
  },
];

export function GuestbookPanel() {
  const [comments, setComments] = useState<GuestbookComment[]>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GuestbookComment[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_COMMENTS;
  });

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {
      // ignore storage errors
    }
  }, [comments]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanMessage = message.trim();
    if (!cleanName || !cleanMessage) return;

    const newEntry: GuestbookComment = {
      id: `c-${Date.now()}`,
      name: cleanName,
      role: role.trim() || "Pengunjung",
      message: cleanMessage,
      date: "Baru saja",
    };

    setComments((prev) => [newEntry, ...prev]);
    setName("");
    setRole("");
    setMessage("");
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 2200);
  };

  return (
    <section
      id="guestbook"
      aria-labelledby="guestbook-heading"
      className="px-4 sm:px-6 lg:px-8 pb-12"
    >
      <div className="max-w-7xl mx-auto">
        <GlowCard contentClassName="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#D4D4D8] dark:border-[#3A3A44]">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-zinc-700 dark:text-[#C4C4CC]">
                <MessageSquare className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                Buku Tamu
              </span>
              <h3
                id="guestbook-heading"
                className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-[#FAFAFA] mt-1"
              >
                Tinggalkan Kesan &amp; Masukan
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono border border-[#D4D4D8] dark:border-[#3A3A44] bg-zinc-100 dark:bg-[#1A1A1F] text-zinc-800 dark:text-[#FAFAFA]">
              {comments.length} Komentar
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda *"
                  required
                  className="w-full rounded-xl border border-[#D4D4D8] dark:border-[#3A3A44] bg-white dark:bg-[#1A1A1F] px-3.5 py-2.5 text-sm text-zinc-900 dark:text-[#FAFAFA] placeholder:text-zinc-500 dark:placeholder:text-[#9A9AA2] focus:border-accent focus:outline-none"
                />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Jabatan / Instansi (opsional)"
                  className="w-full rounded-xl border border-[#D4D4D8] dark:border-[#3A3A44] bg-white dark:bg-[#1A1A1F] px-3.5 py-2.5 text-sm text-zinc-900 dark:text-[#FAFAFA] placeholder:text-zinc-500 dark:placeholder:text-[#9A9AA2] focus:border-accent focus:outline-none"
                />
              </div>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan kesan, masukan, atau pesan kolaborasi..."
                required
                className="w-full rounded-xl border border-[#D4D4D8] dark:border-[#3A3A44] bg-white dark:bg-[#1A1A1F] px-3.5 py-2.5 text-sm text-zinc-900 dark:text-[#FAFAFA] placeholder:text-zinc-500 dark:placeholder:text-[#9A9AA2] focus:border-accent focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between gap-3">
                <Magnetic strength={0.18}>
                  <button
                    type="submit"
                    className="btn-21-shine group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent hover:bg-[var(--accent-mid)] text-white text-sm font-medium transition-colors cursor-pointer"
                  >
                    <Send
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                    <span>Kirim Komentar</span>
                  </button>
                </Magnetic>
                {submitted && (
                  <span className="text-xs font-medium text-[#35C46A]">
                    Komentar ditambahkan!
                  </span>
                )}
              </div>
            </form>

            {/* Comments List */}
            <div className="lg:col-span-7 space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {comments.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-xl border border-[#D4D4D8] dark:border-[#3A3A44] bg-zinc-50 dark:bg-[#1A1A1F] p-4"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D4D4D8] dark:border-[#3A3A44] bg-white dark:bg-[#111114] text-accent">
                        <User className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-zinc-950 dark:text-[#FAFAFA] leading-tight">
                          {c.name}
                        </p>
                        <p className="text-[11px] font-mono text-zinc-600 dark:text-[#9A9AA2]">
                          {c.role}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-[#9A9AA2]">
                      {c.date}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-[#C4C4CC] mt-2">
                    {c.message}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlowCard>
      </div>
    </section>
  );
}
