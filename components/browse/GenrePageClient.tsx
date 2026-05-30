"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import ContentRow from "./ContentRow";
import DetailModal from "@/components/modals/DetailModal";
import VideoPlayer from "@/components/modals/VideoPlayer";
import type { MediaItem, ContentRow as ContentRowType } from "@/types";

interface GenrePageClientProps {
  title: string;
  accentColor: string;
  rows: ContentRowType[];
  profileId: string | null;
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const rowVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: EASE, duration: 0.45 } },
};

export default function GenrePageClient({ title, accentColor, rows, profileId }: GenrePageClientProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);

  const handleDetailOpen = useCallback((e: Event) => {
    const customEvent = e as CustomEvent<MediaItem>;
    setSelectedItem(customEvent.detail);
  }, []);

  useEffect(() => {
    window.addEventListener("open-detail", handleDetailOpen);
    return () => window.removeEventListener("open-detail", handleDetailOpen);
  }, [handleDetailOpen]);

  function handlePlay(item: MediaItem) {
    setSelectedItem(null);
    setPlayingItem(item);
  }

  return (
    <div className="min-h-[100dvh]">
      {/* Sub-navbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: EASE, duration: 0.35 }}
        className="sticky top-0 z-10 flex items-center gap-4 px-4 md:px-8 py-4"
        style={{
          background: "rgba(5,5,5,0.95)",
          borderBottom: "1px solid #141414",
        }}
      >
        <Link
          href="/browse"
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-white/[0.05]"
          style={{ border: "1px solid #1f1f1f" }}
        >
          <ArrowLeft className="h-4 w-4 text-zinc-400" />
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="w-[2px] h-5 rounded-full"
            style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}55)` }}
          />
          <h1
            className="text-xl font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display, Syne, sans-serif)" }}
          >
            {title}
          </h1>
        </div>
        {/* Subtle accent glow behind title */}
        <div
          className="absolute inset-y-0 left-0 w-48 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at left, ${accentColor}08 0%, transparent 70%)` }}
        />
      </motion.div>

      {/* Content rows */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="py-8 space-y-0"
      >
        {rows.map((row) => (
          <motion.div key={row.title} variants={rowVariant}>
            <ContentRow
              title={row.title}
              items={row.items}
              onItemClick={setSelectedItem}
              mediaType={row.mediaType}
            />
          </motion.div>
        ))}
      </motion.div>

      {selectedItem && (
        <DetailModal
          mediaId={selectedItem.id}
          mediaType={(selectedItem.media_type || (selectedItem.title ? "movie" : "tv")) as "movie" | "tv"}
          onClose={() => setSelectedItem(null)}
          onPlay={handlePlay}
          profileId={profileId}
        />
      )}
      {playingItem && (
        <VideoPlayer
          item={playingItem}
          onClose={() => setPlayingItem(null)}
          profileId={profileId}
        />
      )}
    </div>
  );
}
