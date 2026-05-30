"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Info, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl, getTitle } from "@/lib/utils";
import type { MediaItem } from "@/types";

interface HeroBannerProps {
  items: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onInfo: (item: MediaItem) => void;
}

export default function HeroBanner({ items, onPlay, onInfo }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const item = items[current];

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!item) return null;

  const mediaType = item.media_type || (item.title ? "movie" : "tv");

  return (
    <div className="relative h-[70vh] w-full overflow-hidden md:h-[85vh]">
      {/* Backdrop Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={getImageUrl(item.backdrop_path, "original")}
            alt={getTitle(item)}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Heavy Linear Gradient Mask - Fades to absolute black */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, #000000 0%, #000000 20%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)"
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, #000000 0%, rgba(0,0,0,0.85) 30%, transparent 70%)"
        }}
      />

      {/* Content - Left Side */}
      <div className="absolute bottom-20 left-8 max-w-2xl md:bottom-32 md:left-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="space-y-6"
          >
            {/* Title */}
            <h1 className="text-4xl font-bold text-white leading-none tracking-tighter drop-shadow-2xl md:text-6xl lg:text-7xl">
              {getTitle(item)}
            </h1>

            {/* Metadata Badges */}
            {item.vote_average && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 border border-white/10 rounded">
                  <span className="text-xs text-yellow-400 font-bold">★</span>
                  <span className="text-xs text-white font-medium font-mono tracking-wide">
                    {item.vote_average.toFixed(1)}
                  </span>
                </div>
                {item.release_date && (
                  <div className="px-3 py-1 bg-black/40 border border-white/10 rounded">
                    <span className="text-xs text-white font-mono tracking-widest uppercase">
                      {new Date(item.release_date).getFullYear()}
                    </span>
                  </div>
                )}
                <div className="px-3 py-1 bg-black/40 border border-white/10 rounded">
                  <span className="text-xs text-white font-mono tracking-widest uppercase">
                    HD
                  </span>
                </div>
              </div>
            )}

            {/* Overview */}
            <p className="line-clamp-3 text-sm text-zinc-300 leading-relaxed md:text-base max-w-lg">
              {item.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onPlay({ ...item, media_type: mediaType })}
                className="flex items-center gap-2 rounded-lg bg-white text-black font-semibold px-8 py-4 text-base transition-all"
                style={{
                  boxShadow: "0 8px 32px rgba(255,255,255,0.25), inset 0 1px 0 rgba(255,255,255,0.5)"
                }}
              >
                <Play className="h-5 w-5 fill-current" />
                Play
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onInfo({ ...item, media_type: mediaType })}
                className="flex items-center gap-2 rounded-lg px-7 py-4 font-semibold text-white transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)"
                }}
              >
                <Info className="h-5 w-5" />
                More Info
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-2 md:bottom-12 md:right-12">
          {items.slice(0, 5).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-1 rounded-full transition-all"
              initial={false}
              animate={{
                width: i === current ? 32 : 8,
                background: i === current ? "#ffffff" : "rgba(255,255,255,0.3)"
              }}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          ))}
        </div>
      )}

      {/* Ambient Backlight Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.08) 0%, transparent 40%)"
        }}
      />
    </div>
  );
}
