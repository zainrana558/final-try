"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="relative h-[70vh] w-full overflow-hidden md:h-[82vh]">
      <Image
        src={getImageUrl(item.backdrop_path, "original")}
        alt={getTitle(item)}
        fill
        className="object-cover"
        priority
      />

      {/* Gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.5) 40%, rgba(10,10,10,0.1) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, rgba(10,10,10,0.85) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="absolute bottom-16 left-4 max-w-lg space-y-5 md:bottom-24 md:left-10">
        <h1 className="text-3xl font-bold text-white leading-tight drop-shadow-lg md:text-5xl">
          {getTitle(item)}
        </h1>
        <p className="line-clamp-3 text-sm text-zinc-300 leading-relaxed md:text-base max-w-md">
          {item.overview}
        </p>
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            onClick={() => onPlay({ ...item, media_type: mediaType })}
            className="gap-2 rounded-lg px-6 font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{ background: "#7c3aed" }}
          >
            <Play className="h-5 w-5 fill-current" />
            Play
          </Button>
          <Button
            size="lg"
            onClick={() => onInfo({ ...item, media_type: mediaType })}
            className="gap-2 rounded-lg px-6 font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
            }}
          >
            <Info className="h-5 w-5" />
            More Info
          </Button>
        </div>
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-6 right-4 flex gap-1.5 md:bottom-10 md:right-10">
          {items.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === current ? 28 : 14,
                background: i === current ? "#7c3aed" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
