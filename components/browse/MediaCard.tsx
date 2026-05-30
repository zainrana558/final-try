"use client";

import Image from "next/image";
import { Play, Star } from "lucide-react";
import { getImageUrl, getTitle, getYear, formatRating } from "@/lib/utils";
import type { MediaItem } from "@/types";

interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
  mediaType?: "movie" | "tv";
  variant?: "default" | "continue-watching";
  progress?: number;
}

export default function MediaCard({ 
  item, 
  onClick, 
  mediaType,
  variant = "default",
  progress = 0
}: MediaCardProps) {
  const type = mediaType || item.media_type || (item.title ? "movie" : "tv");

  return (
    <button
      onClick={() => onClick({ ...item, media_type: type })}
      className="group relative flex-shrink-0 overflow-hidden transition-all duration-150"
      style={{ 
        width: 280,
        borderRadius: "4px",
        background: "var(--card-bg)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.borderTop = `2px solid var(--accent)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.borderTop = "2px solid transparent";
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "16/9", borderRadius: "4px" }}
      >
        <Image
          src={getImageUrl(item.poster_path)}
          alt={getTitle(item)}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 280px, 280px"
        />

        {/* LUMINA: Dark overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-150"
          style={{ 
            background: "rgba(0,0,0,0.55)",
            borderRadius: "4px",
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}
        />

        {/* LUMINA: Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <div
            className="flex items-center justify-center"
            style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--accent)" }}
          >
            <Play className="w-6 h-6 fill-current text-white" style={{ marginLeft: "2px" }} />
          </div>
        </div>

        {/* LUMINA: Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <p 
            className="text-sm font-semibold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {getTitle(item)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span 
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                {formatRating(item.vote_average)}
              </span>
            </div>
            <span 
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              · {getYear(item)}
            </span>
          </div>
        </div>

        {/* LUMINA: Continue watching progress bar */}
        {variant === "continue-watching" && progress > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <div
              className="h-full"
              style={{ 
                width: `${progress}%`,
                background: "var(--accent)",
              }}
            />
          </div>
        )}
      </div>
    </button>
  );
}
