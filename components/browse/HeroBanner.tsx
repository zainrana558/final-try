"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import { getImageUrl, getTitle } from "@/lib/utils";
import type { MediaItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface HeroBannerProps {
  items: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onInfo: (item: MediaItem) => void;
}

export default function HeroBanner({ items, onPlay, onInfo }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [muted, setMuted] = useState(true);
  const item = items[current];

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % items.length);
        setTransitioning(false);
      }, 400);
    }, 9000);
    return () => clearInterval(interval);
  }, [items.length]);

  function handleDotClick(i: number) {
    setTransitioning(true);
    setTimeout(() => { setCurrent(i); setTransitioning(false); }, 300);
  }

  if (!item) return null;
  const mediaType = item.media_type || (item.title ? "movie" : "tv");

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "85vh", minHeight: 500 }}>
      {/* Background image with parallax feel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={getImageUrl(item.backdrop_path, "original")}
            alt={getTitle(item)}
            fill
            className="object-cover object-top"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Heavy cinematic gradient masks */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.6) 45%, rgba(5,5,5,0.15) 75%, rgba(5,5,5,0.3) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to right, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.5) 40%, transparent 70%)",
        }}
      />
      {/* Vignette corners */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${current}`}
          className="absolute z-20 bottom-24 left-5 max-w-[480px] md:bottom-32 md:left-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Type badge */}
          <div
            className="mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
          >
            <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#7c3aed" }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "#c4b5fd", fontFamily: "var(--font-mono)" }}
            >
              {mediaType === "movie" ? "Film" : "Series"}
            </span>
          </div>

          <h1
            className="text-4xl font-bold text-white leading-none tracking-tighter mb-3 md:text-6xl"
            style={{ fontFamily: "var(--font-display, Syne, sans-serif)", textShadow: "0 2px 30px rgba(0,0,0,0.8)" }}
          >
            {getTitle(item)}
          </h1>

          <p className="mb-5 line-clamp-2 text-[13px] leading-relaxed md:text-sm" style={{ color: "#999", maxWidth: 380 }}>
            {item.overview}
          </p>

          <div className="flex items-center gap-2.5">
            <motion.button
              onClick={() => onPlay({ ...item, media_type: mediaType })}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: "0 4px 24px rgba(124,58,237,0.4)",
              }}
              whileHover={{ scale: 1.03, boxShadow: "0 6px 32px rgba(124,58,237,0.55)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <Play className="h-4 w-4 fill-current" />
              Play Now
            </motion.button>

            <motion.button
              onClick={() => onInfo({ ...item, media_type: mediaType })}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#e4e4e7",
              }}
              whileHover={{ background: "rgba(255,255,255,0.12)", scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <Info className="h-4 w-4" />
              Details
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls bottom-right */}
      <div className="absolute z-20 bottom-8 right-5 flex items-center gap-3 md:bottom-12 md:right-14">
        {/* Mute toggle */}
        <motion.button
          onClick={() => setMuted(!muted)}
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", color: "#999" }}
          whileHover={{ color: "#fff" }}
          whileTap={{ scale: 0.9 }}
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </motion.button>

        {/* Dot pagination */}
        {items.length > 1 && (
          <div className="flex items-center gap-1.5">
            {items.slice(0, 6).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => handleDotClick(i)}
                className="rounded-full transition-all duration-300"
                animate={{
                  width: i === current ? 24 : 6,
                  background: i === current ? "#7c3aed" : "rgba(255,255,255,0.2)",
                  height: 6,
                }}
                whileHover={{ background: i === current ? "#7c3aed" : "rgba(255,255,255,0.4)" }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
