"use client";

import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const genres = [
  {
    label: "Anime",   href: "/anime",
    accent: "#f472b6", glow: "rgba(244,114,182,0.35)",
    animation: `@keyframes petalFall{0%{transform:translateY(-20px) rotate(0deg);opacity:0}10%{opacity:1}90%{opacity:.8}100%{transform:translateY(140px) rotate(360deg);opacity:0}}`,
    particles: ["🌸","🌸","🌺","🌸"], animName: "petalFall",
    bg: "linear-gradient(135deg,#1a0a14 0%,#3d0a2e 100%)",
  },
  {
    label: "Cartoon", href: "/cartoon",
    accent: "#4ade80", glow: "rgba(74,222,128,0.35)",
    animation: `@keyframes leafDrift{0%{transform:translateX(0) translateY(-10px) rotate(0deg);opacity:0}10%{opacity:1}50%{transform:translateX(12px) translateY(60px) rotate(180deg)}100%{transform:translateX(-8px) translateY(130px) rotate(360deg);opacity:0}}`,
    particles: ["🍃","🍀","🍃","🌿"], animName: "leafDrift",
    bg: "linear-gradient(135deg,#071a0d 0%,#0d3320 100%)",
  },
  {
    label: "Horror",  href: "/horror",
    accent: "#ef4444", glow: "rgba(239,68,68,0.35)",
    animation: `@keyframes ashFloat{0%{transform:translateY(140px) scale(1);opacity:0}10%{opacity:.6}90%{opacity:.3}100%{transform:translateY(-10px) scale(.5);opacity:0}}`,
    particles: ["💀","🕷️","💀","🕸️"], animName: "ashFloat",
    bg: "linear-gradient(135deg,#1a0000 0%,#2d0000 100%)",
  },
  {
    label: "Comedy",  href: "/comedy",
    accent: "#facc15", glow: "rgba(250,204,21,0.35)",
    animation: `@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:0}10%{opacity:1}100%{transform:translateY(140px) rotate(720deg);opacity:0}}`,
    particles: ["🎉","😂","🎊","✨"], animName: "confettiFall",
    bg: "linear-gradient(135deg,#1a1500 0%,#332900 100%)",
  },
  {
    label: "Action",  href: "/action",
    accent: "#f97316", glow: "rgba(249,115,22,0.35)",
    animation: `@keyframes emberRise{0%{transform:translateY(140px) scale(1);opacity:0}15%{opacity:1}85%{opacity:.7}100%{transform:translateY(-10px) scale(.3);opacity:0}}`,
    particles: ["💥","🔥","⚡","🔥"], animName: "emberRise",
    bg: "linear-gradient(135deg,#1a0800 0%,#331500 100%)",
  },
  {
    label: "Romance", href: "/romance",
    accent: "#fb7185", glow: "rgba(251,113,133,0.35)",
    animation: `@keyframes heartFloat{0%{transform:translateY(0) scale(1);opacity:0}15%{opacity:1}50%{transform:translateY(-60px) scale(1.2)}100%{transform:translateY(-130px) scale(.5);opacity:0}}`,
    particles: ["❤️","💕","💗","💖"], animName: "heartFloat",
    bg: "linear-gradient(135deg,#1a0008 0%,#330010 100%)",
  },
  {
    label: "Sci-Fi",  href: "/scifi",
    accent: "#38bdf8", glow: "rgba(56,189,248,0.35)",
    animation: `@keyframes starTwinkle{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.4)}}`,
    particles: ["⭐","🌟","✨","💫"], animName: "starTwinkle",
    bg: "linear-gradient(135deg,#00101a 0%,#001f33 100%)",
  },
];

const containerVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { ease: EASE, duration: 0.5 } },
};

const headerVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { ease: EASE, duration: 0.45 } },
};

export default function GenreBanner() {
  const router = useRouter();

  return (
    <section className="px-4 md:px-8 py-8">
      <motion.h2
        className="text-lg font-semibold md:text-xl mb-4"
        variants={headerVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        Browse by Genre
      </motion.h2>

      <div className="overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex gap-3 pb-2"
          style={{ width: "max-content" }}
        >
          {genres.map((genre) => (
            <motion.div
              key={genre.label}
              variants={cardVariants}
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
              onClick={() => router.push(genre.href)}
              className="relative overflow-hidden cursor-pointer flex-shrink-0 rounded-2xl flex flex-col items-center justify-end"
              style={{
                width:  "clamp(140px,12vw,180px)",
                height: "clamp(170px,14vw,220px)",
                background: genre.bg,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px 4px ${genre.glow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <style>{genre.animation}</style>

              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {genre.particles.map((p, i) => (
                  <span
                    key={i}
                    className="absolute text-lg select-none"
                    style={{
                      left: `${15 + i * 20}%`,
                      top: ["Action","Sci-Fi","Horror"].includes(genre.label) ? "80%" : "10%",
                      animation: `${genre.animName} ${1.8 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div
                className="relative z-10 w-full px-3 py-3 text-center"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
              >
                <span className="text-sm font-semibold" style={{ color: genre.accent }}>
                  {genre.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
