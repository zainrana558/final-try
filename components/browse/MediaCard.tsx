"use client";

import Image from "next/image";
import { Play, Star } from "lucide-react";
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
    <button
      onClick={() => onClick({ ...item, media_type: type })}
      className="group relative flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 hover:scale-105 hover:z-10"
      style={{ width: 148 }}
    >
      <div
        className="relative overflow-hidden rounded-lg bg-zinc-900"
        style={{ aspectRatio: "2/3" }}
      >
        <Image
          src={getImageUrl(item.poster_path)}
          alt={getTitle(item)}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 144px, 148px"
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/50 rounded-lg" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200 group-hover:opacity-100">
          <div
            className="rounded-full p-3 shadow-xl"
            style={{ background: "rgba(124,58,237,0.95)" }}
          >
            <Play className="h-5 w-5 fill-white text-white" />
          </div>
        </div>

        {/* Bottom meta */}
        <div
          className="absolute bottom-0 left-0 right-0 px-2 py-2 opacity-0 transition-all duration-200 group-hover:opacity-100"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)" }}
        >
          <p className="truncate text-xs font-semibold text-white leading-tight">{getTitle(item)}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] text-zinc-300">{formatRating(item.vote_average)}</span>
            <span className="text-[10px] text-zinc-500">·</span>
            <span className="text-[10px] text-zinc-400">{getYear(item)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
