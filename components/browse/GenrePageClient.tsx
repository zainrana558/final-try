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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.25, 0.46, 0.45, 0.94], duration: 0.5 },
  },
};

const navVariant = {
  hidden: { opacity: 0, y: -16 },
  show: { opacity: 1, y: 0, transition: { ease: [0.25, 0.46, 0.45, 0.94], duration: 0.45 } },
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
      {/* Frosted glass sub-navbar */}
      <motion.div
        variants={navVariant}
        initial="hidden"
        animate="show"
        className="sticky top-16 z-10 flex items-center gap-4 px-4 md:px-8 py-4"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Link
          href="/browse"
          className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            minWidth: 44, minHeight: 44,
          }}
        >
          <ArrowLeft className="h-4 w-4 text-white" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: accentColor }}>
          {title}
        </h1>
      </motion.div>

      {/* Rows with stagger */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8 py-6 pb-16"
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
