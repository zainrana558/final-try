"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const genres = [
  {
    label: "Anime",
    href: "/anime",
    gradient: "linear-gradient(135deg, #5a2040 0%, #3a1a30 100%)",
    accent: "#e85d8a",
    icon: "✦",
  },
  {
    label: "Cartoon",
    href: "/cartoon",
    gradient: "linear-gradient(135deg, #6a4010 0%, #4a3010 100%)",
    accent: "#e8943c",
    icon: "◆",
  },
  {
    label: "Horror",
    href: "/horror",
    gradient: "linear-gradient(135deg, #2a1008 0%, #1a0a04 100%)",
    accent: "#a04030",
    icon: "✦",
  },
  {
    label: "Comedy",
    href: "/comedy",
    gradient: "linear-gradient(135deg, #5a4820 0%, #3a3020 100%)",
    accent: "#e8c468",
    icon: "◆",
  },
  {
    label: "Action",
    href: "/action",
    gradient: "linear-gradient(135deg, #1e3050 0%, #162040 100%)",
    accent: "#7ab8e8",
    icon: "✦",
  },
  {
    label: "Romance",
    href: "/romance",
    gradient: "linear-gradient(135deg, #4a1830 0%, #2a1020 100%)",
    accent: "#c85878",
    icon: "◆",
  },
  {
    label: "Sci-Fi",
    href: "/scifi",
    gradient: "linear-gradient(135deg, #1a2448 0%, #101838 100%)",
    accent: "#5bc4c4",
    icon: "✦",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: EASE, duration: 0.4 } },
};

export default function GenreBanner() {
  const router = useRouter();

  return (
    <section className="px-4 md:px-8 py-6">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-1 h-6 rounded-full"
          style={{ background: "linear-gradient(180deg, #d4a853, #8c7c5c)", boxShadow: "0 0 8px rgba(212,168,83,0.3)" }}
        />
        <h2 className="text-xl font-bold tracking-tight" style={{ color: "#f5f0eb" }}>
          Browse by Genre
        </h2>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
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
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={() => router.push(genre.href)}
              className="relative flex-shrink-0 overflow-hidden rounded-xl cursor-pointer"
              style={{
                width: 140,
                height: 120,
                background: genre.gradient,
                border: "1px solid rgba(245,240,235,0.06)",
              }}
            >
              {/* Subtle warm texture overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse at top left, rgba(212,168,83,0.08) 0%, transparent 60%)",
                }}
              />

              {/* Icon top-right */}
              <span
                className="absolute top-3 right-3 text-xl select-none pointer-events-none"
                style={{
                  color: genre.accent,
                  opacity: 0.6,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                }}
              >
                {genre.icon}
              </span>

              {/* Decorative circle */}
              <div
                className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${genre.accent}15 0%, transparent 70%)`,
                }}
              />

              {/* Label bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-3 py-3">
                <p
                  className="text-sm font-bold tracking-wide leading-none"
                  style={{
                    color: "#f5f0eb",
                    textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                  }}
                >
                  {genre.label}
                </p>
              </div>

              {/* Hover border */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ border: `1px solid ${genre.accent}40` }}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
