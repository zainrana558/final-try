"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Info } from "lucide-react";
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
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
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

      {/* Warm Cinematic Gradient Mask - Fades to warm black */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, #080605 0%, #080605 15%, rgba(8,6,5,0.75) 45%, rgba(8,6,5,0.35) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, #080605 0%, rgba(8,6,5,0.88) 35%, transparent 72%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top right, rgba(8,6,5,0.5) 0%, transparent 40%)",
        }}
      />

      {/* Warm ambient glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 60%, rgba(212,168,83,0.04) 0%, transparent 50%)",
        }}
      />

      {/* Content - Left Side */}
      <div className="absolute bottom-20 left-6 max-w-2xl md:bottom-32 md:left-16 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 100, damping: 22, delay: 0.15 }}
            className="space-y-5"
          >
            {/* Media Type Badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em]"
                style={{
                  background: "rgba(212,168,83,0.12)",
                  border: "1px solid rgba(212,168,83,0.2)",
                  color: "#d4a853",
                }}
              >
                {mediaType === "movie" ? "Featured Movie" : "Featured Series"}
              </span>
            </motion.div>

            {/* Title */}
            <h1
              className="text-4xl font-bold leading-none tracking-tighter md:text-6xl lg:text-7xl"
              style={{
                color: "#f5f0eb",
                textShadow: "0 4px 32px rgba(0,0,0,0.8), 0 1px 8px rgba(0,0,0,0.6)",
              }}
            >
              {getTitle(item)}
            </h1>

            {/* Metadata Badges */}
            {item.vote_average && (
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                  style={{
                    background: "rgba(8,6,5,0.6)",
                    border: "1px solid rgba(212,168,83,0.15)",
                  }}
                >
                  <span style={{ color: "#e8c87a" }} className="text-xs">★</span>
                  <span
                    className="text-xs font-medium tracking-wide"
                    style={{ color: "#f5f0eb" }}
                  >
                    {item.vote_average.toFixed(1)}
                  </span>
                </div>
                {item.release_date && (
                  <div
                    className="rounded-lg px-3 py-1.5"
                    style={{
                      background: "rgba(8,6,5,0.6)",
                      border: "1px solid rgba(245,240,235,0.08)",
                    }}
                  >
                    <span
                      className="text-xs tracking-widest uppercase"
                      style={{ color: "#b8b0a4" }}
                    >
                      {new Date(item.release_date).getFullYear()}
                    </span>
                  </div>
                )}
                <div
                  className="rounded-lg px-3 py-1.5"
                  style={{
                    background: "rgba(8,6,5,0.6)",
                    border: "1px solid rgba(245,240,235,0.08)",
                  }}
                >
                  <span
                    className="text-xs tracking-widest uppercase"
                    style={{ color: "#b8b0a4" }}
                  >
                    HD
                  </span>
                </div>
              </div>
            )}

            {/* Overview */}
            <p
              className="line-clamp-3 text-sm leading-relaxed max-w-lg md:text-base"
              style={{
                color: "#b8b0a4",
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              }}
            >
              {item.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onPlay({ ...item, media_type: mediaType })}
                className="flex items-center gap-2.5 rounded-xl px-8 py-4 text-base font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, #f5f0eb 0%, #e8dcc8 100%)",
                  color: "#080605",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 20px rgba(212,168,83,0.15)",
                }}
              >
                <Play className="h-5 w-5 fill-current" />
                Play Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onInfo({ ...item, media_type: mediaType })}
                className="flex items-center gap-2.5 rounded-xl px-7 py-4 font-semibold transition-all"
                style={{
                  background: "rgba(245,240,235,0.08)",
                  border: "1px solid rgba(245,240,235,0.12)",
                  color: "#f5f0eb",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
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
        <div className="absolute bottom-8 right-8 flex gap-2 md:bottom-12 md:right-12 z-10">
          {items.slice(0, 5).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-1 rounded-full transition-all"
              initial={false}
              animate={{
                width: i === current ? 32 : 8,
                background: i === current ? "#d4a853" : "rgba(245,240,235,0.25)",
              }}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
