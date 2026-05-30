"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard from "./MediaCard";
import type { MediaItem } from "@/types";
import { motion } from "framer-motion";

interface ContentRowProps {
  title: string;
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
  mediaType?: "movie" | "tv";
}

export default function ContentRow({ title, items, onItemClick, mediaType }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  function handleScroll() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }

  if (!items.length) return null;

  return (
    <div className="mb-10 px-4 md:px-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="h-4 w-[2px] rounded-full flex-shrink-0"
          style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }}
        />
        <h2
          className="text-base font-semibold text-white tracking-tight"
          style={{ letterSpacing: "-0.01em" }}
        >
          {title}
        </h2>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #1f1f1f, transparent)" }} />
        <span
          className="text-[10px] font-medium uppercase tracking-[0.12em]"
          style={{ color: "#333", fontFamily: "var(--font-mono)" }}
        >
          {items.length} titles
        </span>
      </div>

      {/* Scroll row */}
      <div className="group relative" style={{ marginLeft: -4, marginRight: -4 }}>
        {/* Left fade + arrow */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center pointer-events-none"
          style={{ width: 60 }}
          animate={{ opacity: canScrollLeft ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, #050505, transparent)" }}
          />
          <motion.button
            onClick={() => scroll("left")}
            className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full ml-1 pointer-events-auto transition-all duration-200"
            style={{ background: "#0f0f0f", border: "1px solid #2a2a2a" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </motion.button>
        </motion.div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-3 pt-1 no-scrollbar px-1"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <MediaCard item={item} onClick={onItemClick} mediaType={mediaType} />
            </motion.div>
          ))}
        </div>

        {/* Right fade + arrow */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end pointer-events-none"
          style={{ width: 60 }}
          animate={{ opacity: canScrollRight ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to left, #050505, transparent)" }}
          />
          <motion.button
            onClick={() => scroll("right")}
            className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full mr-1 pointer-events-auto transition-all duration-200"
            style={{ background: "#0f0f0f", border: "1px solid #2a2a2a" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
