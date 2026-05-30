"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "./MediaCard";
import type { MediaItem } from "@/types";

interface ContentRowProps {
  eyebrow?: string;
  title: string;
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
  mediaType?: "movie" | "tv";
  variant?: "default" | "continue-watching";
  seeAllHref?: string;
}

export default function ContentRow({ 
  eyebrow, 
  title, 
  items, 
  onItemClick, 
  mediaType,
  variant = "default",
  seeAllHref 
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  function handleScroll() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }

  if (!items.length) return null;

  return (
    <div className="space-y-4 px-12 mb-8">
      {/* LUMINA: Section header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {eyebrow && (
            <p
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "#555555" }}
            >
              {eyebrow}
            </p>
          )}
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h2>
        </div>
        {seeAllHref && (
          <a
            href={seeAllHref}
            className="text-sm transition-all duration-100 hover:underline"
            style={{ color: "var(--accent)" }}
          >
            See All →
          </a>
        )}
      </div>

      {/* LUMINA: Scroll row */}
      <div className="group relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center transition-all duration-150 ${
            showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "var(--elevated-surface)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover-surface)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--elevated-surface)"}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onClick={onItemClick}
              mediaType={mediaType}
              variant={variant}
            />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center transition-all duration-150 ${
            showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "var(--elevated-surface)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover-surface)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--elevated-surface)"}
        >
          <ChevronRight className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
        </button>
      </div>
    </div>
  );
}
