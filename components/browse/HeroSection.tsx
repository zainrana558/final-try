"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Plus, Info } from "lucide-react";
import { getImageUrl, getTitle } from "@/lib/utils";
import type { MediaItem } from "@/types";

interface HeroSectionProps {
  slides: MediaItem[];
  onPlay?: (item: MediaItem) => void;
  onInfo?: (item: MediaItem) => void;
  onAddToList?: (item: MediaItem) => void;
}

export default function HeroSection({ 
  slides, 
  onPlay, 
  onInfo,
  onAddToList 
}: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  // LUMINA: Auto-advance every 6 seconds with progress animation
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, 6000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev + 100) / 60); // 6 seconds = 60 intervals of 100ms
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [slides.length]);

  // LUMINA: Reset progress on manual slide change
  useEffect(() => {
    setProgress(0);
  }, [current]);

  if (!slides.length) return null;

  const item = slides[current];
  const mediaType = item.media_type || (item.title ? "movie" : "tv");

  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{ height: "75vh", minHeight: "600px" }}
    >
      {/* LUMINA: Full-bleed image */}
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(item.backdrop_path, "original")}
          alt={getTitle(item)}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* LUMINA: Hard gradient overlays (no blur) */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, var(--page-bg) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, var(--page-bg) 0%, transparent 50%)",
        }}
      />

      {/* LUMINA: Content positioned bottom-left */}
      <div 
        className="absolute bottom-0 left-0 right-0 px-12 pb-12"
        style={{ maxWidth: "1200px" }}
      >
        <div className="space-y-4">
          {/* LUMINA: Genre badges */}
          <div className="flex gap-2">
            <span
              className="px-2 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "var(--card-bg)",
                border: "1px solid #333333",
                borderRadius: "4px",
                color: "var(--text-primary)",
              }}
            >
              {mediaType === "movie" ? "Movie" : "TV Series"}
            </span>
            {item.vote_average > 0 && (
              <span
                className="px-2 py-1 text-xs font-semibold"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid #333333",
                  borderRadius: "4px",
                  color: "var(--text-secondary)",
                }}
              >
                ★ {item.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          {/* LUMINA: Title */}
          <h1
            className="text-5xl font-bold leading-tight"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              textShadow: "rgba(0,0,0,0.8) 0 2px 8px",
            }}
          >
            {getTitle(item)}
          </h1>

          {/* LUMINA: Description */}
          <p
            className="line-clamp-2 text-sm leading-relaxed"
            style={{
              color: "#999999",
              maxWidth: "480px",
            }}
          >
            {item.overview}
          </p>

          {/* LUMINA: Buttons row */}
          <div className="flex gap-3">
            <button
              onClick={() => onPlay?.(item)}
              className="flex items-center gap-2 px-5 font-semibold text-white transition-all duration-100"
              style={{
                background: "var(--accent)",
                borderRadius: "4px",
                height: "44px",
                padding: "0 20px",
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.85)"}
              onMouseLeave={(e) => e.currentTarget.style.filter = "brightness(1)"}
            >
              <Play className="w-5 h-5 fill-current" />
              Play Now
            </button>

            <button
              onClick={() => onAddToList?.(item)}
              className="flex items-center gap-2 px-5 font-semibold text-white transition-all duration-100"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "4px",
                height: "44px",
                padding: "0 20px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--text-primary)";
                e.currentTarget.style.color = "var(--page-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
            >
              <Plus className="w-5 h-5" />
              My List
            </button>

            <button
              onClick={() => onInfo?.(item)}
              className="flex items-center gap-2 px-5 font-semibold text-white transition-all duration-100"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "4px",
                height: "44px",
                padding: "0 20px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--text-primary)";
                e.currentTarget.style.color = "var(--page-bg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
            >
              <Info className="w-5 h-5" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* LUMINA: Slide indicators bottom-right */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 right-12 flex gap-1.5">
          {slides.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="relative transition-all duration-100"
              style={{
                width: "32px",
                height: "2px",
                background: i === current ? "var(--text-primary)" : "#333333",
              }}
            >
              {i === current && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: "var(--text-primary)",
                    width: `${progress}%`,
                    transition: "none",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
