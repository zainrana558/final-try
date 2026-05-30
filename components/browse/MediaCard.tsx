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
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group relative flex-shrink-0 overflow-visible"
      style={{ width: 156 }}
    >
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          aspectRatio: "2/3",
          background: "#12100e",
          boxShadow: "0 4px 16px -4px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Warm ambient glow behind card on hover */}
        <div
          className="absolute -inset-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(212,168,83,0.12) 0%, transparent 65%)",
          }}
        />

        {/* Poster Image */}
        <motion.div
          className="relative w-full h-full"
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        >
          <Image
            src={getImageUrl(item.poster_path)}
            alt={getTitle(item)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 156px, 160px"
          />
        </motion.div>

        {/* Warm gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, #080605 0%, rgba(8,6,5,0.82) 35%, rgba(8,6,5,0.4) 70%, rgba(8,6,5,0.1) 100%)",
          }}
        />

        {/* Play button - appears on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            whileHover={{ scale: 1.12 }}
            className="rounded-full p-4"
            style={{
              background: "linear-gradient(135deg, #d4a853 0%, #b8883a 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <Play className="h-5 w-5 fill-[#080605] text-[#080605]" />
          </motion.div>
        </motion.div>

        {/* Bottom metadata - appears on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        >
          <p className="text-sm font-semibold leading-tight truncate mb-1.5" style={{ color: "#f5f0eb" }}>
            {getTitle(item)}
          </p>
          <div className="flex items-center gap-2">
            <Star className="h-3 w-3" style={{ color: "#e8c87a", fill: "#e8c87a" }} />
            <span className="text-[11px] tracking-wide" style={{ color: "#b8b0a4" }}>
              {formatRating(item.vote_average)}
            </span>
            <span style={{ color: "#4a4540" }}>•</span>
            <span className="text-[11px] tracking-widest uppercase" style={{ color: "#7a7168" }}>
              {getYear(item)}
            </span>
          </div>
        </motion.div>

        {/* Warm border on hover */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            border: "1px solid rgba(212,168,83,0.2)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        />
      </div>
    </motion.button>
  );
}
