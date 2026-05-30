"use client";

import { useState, useEffect, useCallback } from "react";
import HeroSection from "./HeroSection";
import ContentRow from "./ContentRow";
import GenreBanner from "./GenreBanner";
import DetailModal from "@/components/modals/DetailModal";
import VideoPlayer from "@/components/modals/VideoPlayer";
import type { MediaItem, ContentRow as ContentRowType } from "@/types";

interface BrowseClientProps {
  heroItems: MediaItem[];
  rows: ContentRowType[];
  profileId: string | null;
  accentColor?: string;
}

export default function BrowseClient({ heroItems, rows, profileId, accentColor = "#E50914" }: BrowseClientProps) {
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

  function handleItemClick(item: MediaItem) {
    setSelectedItem(item);
  }

  function handlePlay(item: MediaItem) {
    setSelectedItem(null);
    setPlayingItem(item);
  }

  function handleAddToList(item: MediaItem) {
    // TODO: Implement add to list functionality
  }

  return (
    <>
      {/* LUMINA: Hero section with auto-advancing slides */}
      <HeroSection
        slides={heroItems}
        onPlay={handlePlay}
        onInfo={handleItemClick}
        onAddToList={handleAddToList}
      />

      {/* LUMINA: Content rows */}
      <div className="relative z-10 pb-16">
        <GenreBanner />

        <div className="space-y-0">
          {rows.map((row, index) => (
            <ContentRow
              key={row.title}
              eyebrow={index === 0 ? "FEATURED" : undefined}
              title={row.title}
              items={row.items}
              onItemClick={handleItemClick}
              mediaType={row.mediaType}
              variant={row.title === "Continue Watching" ? "continue-watching" : "default"}
            />
          ))}
        </div>
      </div>

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
    </>
  );
}
