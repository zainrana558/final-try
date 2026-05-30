"use client";

import Image from "next/image";
import { Play, Star } from "lucide-react";
import { getImageUrl, getTitle, getYear, formatRating } from "@/lib/utils";
import type { MediaItem } from "@/types";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
  mediaType?: "movie" | "tv";
}

export default function MediaCard({ item, onClick, mediaType }: MediaCardProps) {
  const type = mediaType || item.media_type || (item.title ? "movie" : "tv");
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);

  return (
    <motion.button
      ref={cardRef}
      onClick={() => onClick({ ...item, media_type: type })}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.05, y: -4, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
      className="relative flex-shrink-0 cursor-pointer outline-none"
      style={{ width: 148, zIndex: hovered ? 10 : 1 }}
    >
      <div
        className="relative overflow-hidden rounded-xl bg-zinc-900"
        style={{
          aspectRatio: "2/3",
          border: "1px solid #1a1a1a",
          boxShadow: hovered
            ? "0 20px 60px -10px rgba(0,0,0,0.9), 0 0 0 1px rgba(124,58,237,0.3)"
            : "0 4px 20px -4px rgba(0,0,0,0.6)",
          transition: "box-shadow 0.25s ease",
        }}
      >
        <Image
          src={getImageUrl(item.poster_path)}
          alt={getTitle(item)}
          fill
          className="object-cover"
          sizes="148px"
          style={{ transform: hovered ? "scale(1.08)" : "scale(1)", transition: "transform 0.4s ease" }}
        />

        {/* Cinematic ambient glow on hover */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(124,58,237,0.12) 0%, transparent 50%)",
            }}
          />
        )}

        {/* Dark overlay */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{ background: hovered ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)" }}
        />

        {/* Play button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 40,
              height: 40,
              background: "rgba(124,58,237,0.95)",
              boxShadow: "0 0 20px rgba(124,58,237,0.6)",
            }}
          >
            <Play className="h-4 w-4 fill-white text-white ml-0.5" />
          </div>
        </motion.div>

        {/* Bottom meta */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-2.5 py-2"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.2 }}
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)" }}
        >
          <p className="truncate text-[11px] font-semibold text-white leading-tight">{getTitle(item)}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] text-zinc-300" style={{ fontFamily: "var(--font-mono)" }}>
              {formatRating(item.vote_average)}
            </span>
            <span className="text-[10px] text-zinc-600">·</span>
            <span className="text-[10px] text-zinc-500">{getYear(item)}</span>
          </div>
        </motion.div>
      </div>
    </motion.button>
  );
}
