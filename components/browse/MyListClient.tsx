"use client";

import { useState } from "react";
import MediaCard from "./MediaCard";
import DetailModal from "@/components/modals/DetailModal";
import VideoPlayer from "@/components/modals/VideoPlayer";
import type { MediaItem, WatchlistItem } from "@/types";
import { motion } from "framer-motion";

interface MyListClientProps { items: WatchlistItem[]; profileId: string; }

export default function MyListClient({ items, profileId }: MyListClientProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);

  if (!items.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-5xl mb-4">❤️</p>
          <h2 className="text-xl font-semibold text-white mb-2 tracking-tight">Your list is empty</h2>
          <p className="text-[13px]" style={{ color: "#555" }}>Browse movies and shows to add them to your list.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-8 pb-16 md:px-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-4 w-[2px] rounded-full" style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
        <h1 className="text-xl font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display, Syne, sans-serif)" }}>My List</h1>
        <span className="text-[11px] uppercase tracking-[0.12em]" style={{ color: "#333", fontFamily: "var(--font-mono)" }}>{items.length} titles</span>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.3 }}
          >
            <MediaCard
              item={{
                id: item.media_id, overview: "", poster_path: item.poster_path,
                backdrop_path: null, vote_average: 0, vote_count: 0, popularity: 0,
                ...(item.media_type === "movie" ? { title: item.title } : { name: item.title }),
                media_type: item.media_type as "movie" | "tv",
              }}
              onClick={setSelectedItem}
              mediaType={item.media_type as "movie" | "tv"}
            />
          </motion.div>
        ))}
      </div>
      {selectedItem && (
        <DetailModal
          mediaId={selectedItem.id}
          mediaType={(selectedItem.media_type || "movie") as "movie" | "tv"}
          onClose={() => setSelectedItem(null)}
          onPlay={(playItem) => { setSelectedItem(null); setPlayingItem(playItem); }}
          profileId={profileId}
        />
      )}
      {playingItem && <VideoPlayer item={playingItem} onClose={() => setPlayingItem(null)} profileId={profileId} />}
    </div>
  );
}
