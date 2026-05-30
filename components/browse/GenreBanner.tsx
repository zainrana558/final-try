"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const genres = [
  {
    label: "Anime",
    href: "/anime",
    gradient: "linear-gradient(135deg, #581c87 0%, #831843 100%)",
    accent: "#f472b6",
    icon: "🌸",
  },
  {
    label: "Cartoon",
    href: "/cartoon",
    gradient: "linear-gradient(135deg, #b45309 0%, #c2410c 100%)",
    accent: "#fbbf24",
    icon: "🎨",
  },
  {
    label: "Horror",
    href: "/horror",
    gradient: "linear-gradient(135deg, #1c0505 0%, #1f2937 100%)",
    accent: "#ef4444",
    icon: "💀",
  },
  {
    label: "Comedy",
    href: "/comedy",
    gradient: "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
    accent: "#facc15",
    icon: "😂",
  },
  {
    label: "Action",
    href: "/action",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #164e63 100%)",
    accent: "#38bdf8",
    icon: "⚡",
  },
  {
    label: "Romance",
    href: "/romance",
    gradient: "linear-gradient(135deg, #831843 0%, #e11d48 100%)",
    accent: "#fb7185",
    icon: "❤️",
  },
  {
    label: "Sci-Fi",
    href: "/scifi",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #1d4ed8 100%)",
    accent: "#60a5fa",
    icon: "🚀",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: [0.25, 0.46, 0.45, 0.94], duration: 0.4 } },
};

export default function GenreBanner() {
  const router = useRouter();

  return (
    <section className="px-4 md:px-8 py-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
        <h2 className="text-xl font-bold text-white tracking-tight">Browse by Genre</h2>
      </div>

      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="flex gap-3 pb-2"
          style={{ width: "max-content" }}
        >
          {genres.map((genre) => (
            <motion.button
              key={genre.label}
              variants={cardVariants}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={() => router.push(genre.href)}
              className="relative flex-shrink-0 overflow-hidden rounded-xl cursor-pointer"
              style={{
                width: 140,
                height: 120,
                background: genre.gradient,
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Subtle noise texture overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at top left, rgba(255,255,255,0.06) 0%, transparent 60%)",
                }}
              />

              {/* Icon top-right */}
              <span
                className="absolute top-3 right-3 text-2xl select-none pointer-events-none"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}
              >
                {genre.icon}
              </span>

              {/* Label bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-3 py-3">
                <p
                  className="text-sm font-bold tracking-wide leading-none"
                  style={{ color: genre.accent, textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
                >
                  {genre.label}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
