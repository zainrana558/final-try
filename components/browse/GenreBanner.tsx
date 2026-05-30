"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const genres = [
  { label: "Anime",   href: "/anime",   gradient: "linear-gradient(135deg, #3d0a2e 0%, #1a0a14 100%)", accent: "#ff6b9d", icon: "🌸", sub: "Japanese Animation" },
  { label: "Cartoon", href: "/cartoon", gradient: "linear-gradient(135deg, #3d2200 0%, #1a1000 100%)", accent: "#fbbf24", icon: "🎨", sub: "Animated Series" },
  { label: "Horror",  href: "/horror",  gradient: "linear-gradient(135deg, #1a0000 0%, #0a0505 100%)", accent: "#ef4444", icon: "💀", sub: "Fear & Suspense" },
  { label: "Comedy",  href: "/comedy",  gradient: "linear-gradient(135deg, #2d1a00 0%, #1a0f00 100%)", accent: "#facc15", icon: "😂", sub: "Light & Fun" },
  { label: "Action",  href: "/action",  gradient: "linear-gradient(135deg, #001a3d 0%, #00101f 100%)", accent: "#38bdf8", icon: "⚡", sub: "High Octane" },
  { label: "Romance", href: "/romance", gradient: "linear-gradient(135deg, #3d001a 0%, #1a000f 100%)", accent: "#fb7185", icon: "❤️", sub: "Love Stories" },
  { label: "Sci-Fi",  href: "/scifi",   gradient: "linear-gradient(135deg, #0a001a 0%, #000510 100%)", accent: "#a78bfa", icon: "🚀", sub: "Future Worlds" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const card = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ease: [0.25, 0.46, 0.45, 0.94], duration: 0.4 } },
};

export default function GenreBanner() {
  const router = useRouter();

  return (
    <section className="px-4 md:px-8 py-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-4 w-[2px] rounded-full" style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
        <h2 className="text-base font-semibold text-white tracking-tight">Browse by Genre</h2>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #1f1f1f, transparent)" }} />
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="flex gap-3 pb-1"
          style={{ width: "max-content" }}
        >
          {genres.map((genre) => (
            <motion.button
              key={genre.label}
              variants={card}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={() => router.push(genre.href)}
              className="relative flex-shrink-0 overflow-hidden rounded-2xl cursor-pointer text-left"
              style={{
                width: 148,
                height: 110,
                background: genre.gradient,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Radial highlight */}
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(ellipse at top left, ${genre.accent}15 0%, transparent 65%)` }}
              />
              {/* Accent corner glow */}
              <div
                className="absolute top-0 right-0 h-16 w-16 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${genre.accent}20 0%, transparent 70%)`, transform: "translate(30%, -30%)" }}
              />

              {/* Icon */}
              <span
                className="absolute top-3 right-3 text-2xl select-none pointer-events-none"
                style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
              >
                {genre.icon}
              </span>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 px-3.5 py-3">
                <p
                  className="text-[13px] font-bold text-white leading-none tracking-tight"
                  style={{ fontFamily: "var(--font-display, Syne, sans-serif)" }}
                >
                  {genre.label}
                </p>
                <p className="text-[10px] mt-0.5 font-medium tracking-wide" style={{ color: `${genre.accent}99` }}>
                  {genre.sub}
                </p>
              </div>

              {/* Accent border bottom */}
              <div
                className="absolute bottom-0 left-3 right-3 h-[1px] rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${genre.accent}40, transparent)` }}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
