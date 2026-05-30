"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "./MediaCard";
import type { MediaItem } from "@/types";

interface ContentRowProps {
  title: string;
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
  mediaType?: "movie" | "tv";
}

export default function ContentRow({ title, items, onItemClick, mediaType }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (!items.length) return null;

  return (
    <div className="space-y-3 px-4 md:px-8 mb-8">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-5 rounded-full flex-shrink-0"
          style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }}
        />
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      {/* Scroll row */}
      <div className="group relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 hover:scale-110"
          style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onClick={onItemClick}
              mediaType={mediaType}
            />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 hover:scale-110"
          style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}
