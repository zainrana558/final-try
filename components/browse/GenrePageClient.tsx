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
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: EASE, duration: 0.5 },
  },
};

const navVariant = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0, transition: { ease: EASE, duration: 0.4 } },
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
        variants={navVariant}
        initial="hidden"
        animate="show"
        className="sticky top-0 z-10 flex items-center gap-4 px-4 md:px-8 py-4"
        style={{
          background: "rgba(10,10,10,0.9)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link
          href="/browse"
          className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:bg-white/10"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ArrowLeft className="h-4 w-4 text-white" />
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-6 rounded-full"
            style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}88)` }}
          />
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        </div>
      </motion.div>

      {/* Content rows */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="py-8 space-y-0"
      >
        {rows.map((row) => (
          <motion.div key={row.title} variants={item}>
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
