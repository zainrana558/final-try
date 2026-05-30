"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
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
    <div className="space-y-4 px-4 md:px-12 mb-10">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-1 h-6 rounded-full flex-shrink-0"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #737373 100%)",
            boxShadow: "0 0 8px rgba(255,255,255,0.3)"
          }}
        />
        <h2 className="text-xl font-bold text-white tracking-tight leading-none">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#1f1f1f] to-transparent" />
      </div>

      {/* Scroll Row */}
      <div className="group relative -mx-4 px-4 md:-mx-12 md:px-12">
        {/* Left Arrow */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{
            background: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.9)"
          }}
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </motion.button>

        {/* Cards Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide py-4"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: index * 0.03
              }}
            >
              <MediaCard
                item={item}
                onClick={onItemClick}
                mediaType={mediaType}
              />
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{
            background: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.9)"
          }}
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </motion.button>
      </div>
    </div>
  );
}
