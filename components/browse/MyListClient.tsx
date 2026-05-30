"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import MediaCard from "./MediaCard";
import DetailModal from "@/components/modals/DetailModal";
import VideoPlayer from "@/components/modals/VideoPlayer";
import type { MediaItem, WatchlistItem } from "@/types";

interface MyListClientProps {
  items: WatchlistItem[];
  profileId: string;
}

export default function MyListClient({ items, profileId }: MyListClientProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);

  if (!items.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: "rgba(245,240,235,0.05)",
                border: "1px solid #2a2520",
              }}
            >
              <Heart className="h-8 w-8" style={{ color: "#4a4540" }} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#f5f0eb" }}>Your list is empty</h2>
            <p className="mt-2 text-sm" style={{ color: "#5a544a" }}>
              Browse movies and shows to add them to your list.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-8 pb-16 md:px-8">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-1 h-6 rounded-full flex-shrink-0"
          style={{
            background: "linear-gradient(180deg, #d4a853, #8c7c5c)",
            boxShadow: "0 0 8px rgba(212,168,83,0.3)",
          }}
        />
        <h1 className="text-xl font-bold tracking-tight" style={{ color: "#f5f0eb" }}>My List</h1>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, #2a2520, transparent)" }} />
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {items.map((item) => (
          <MediaCard
            key={item.id}
            item={{
              id: item.media_id,
              overview: "",
              poster_path: item.poster_path,
              backdrop_path: null,
              vote_average: 0,
              vote_count: 0,
              popularity: 0,
              ...(item.media_type === "movie"
                ? { title: item.title }
                : { name: item.title }),
              media_type: item.media_type as "movie" | "tv",
            }}
            onClick={setSelectedItem}
            mediaType={item.media_type as "movie" | "tv"}
          />
        ))}
      </div>

      {selectedItem && (
        <DetailModal
          mediaId={selectedItem.id}
          mediaType={(selectedItem.media_type || "movie") as "movie" | "tv"}
          onClose={() => setSelectedItem(null)}
          onPlay={(playItem) => {
            setSelectedItem(null);
            setPlayingItem(playItem);
          }}
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
