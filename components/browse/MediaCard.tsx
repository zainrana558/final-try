"use client";

import Image from "next/image";
import { Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import { getImageUrl, getTitle, getYear, formatRating } from "@/lib/utils";
import type { MediaItem } from "@/types";

interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
  mediaType?: "movie" | "tv";
}

export default function MediaCard({ item, onClick, mediaType }: MediaCardProps) {
  const type = mediaType || item.media_type || (item.title ? "movie" : "tv");

  return (
    <motion.button
      onClick={() => onClick({ ...item, media_type: type })}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="group relative flex-shrink-0 overflow-visible"
      style={{ width: 156 }}
    >
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          aspectRatio: "2/3",
          background: "#0a0a0a",
          boxShadow: "0 4px 20px -4px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)"
        }}
      >
        {/* Backlight glow behind card */}
        <div
          className="absolute -inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)"
          }}
        />

        {/* Poster Image */}
        <motion.div
          className="relative w-full h-full"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <Image
            src={getImageUrl(item.poster_path)}
            alt={getTitle(item)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 156px, 160px"
          />
        </motion.div>

        {/* Dark gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background: "linear-gradient(to top, #000000 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 100%)"
          }}
        />

        {/* Play button - appears on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={false}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            className="rounded-full p-4"
            style={{
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.8)"
            }}
          >
            <Play className="h-6 w-6 fill-black text-black" />
          </motion.div>
        </motion.div>

        {/* Bottom metadata - appears on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={false}
        >
          <p className="text-sm font-semibold text-white leading-tight truncate mb-1">
            {getTitle(item)}
          </p>
          <div className="flex items-center gap-2">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] text-zinc-300 font-mono tracking-wide">
              {formatRating(item.vote_average)}
            </span>
            <span className="text-[11px] text-zinc-600">•</span>
            <span className="text-[11px] text-zinc-400 font-mono tracking-widest uppercase">
              {getYear(item)}
            </span>
          </div>
        </motion.div>

        {/* Premium border on hover */}
        <div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            border: "1px solid rgba(255,255,255,0.2)"
          }}
        />
      </div>
    </motion.button>
  );
}
