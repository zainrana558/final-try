"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, type Variants } from "framer-motion";
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

/* ── Canvas map: title → dynamic import (SSR disabled) ── */
const canvasMap: Record<string, React.ComponentType> = {
  "Anime":    dynamic(() => import("@/components/canvas/AnimeCanvas"),   { ssr: false, loading: () => <CanvasFallback color="#3d0a2e" /> }),
  "Cartoons": dynamic(() => import("@/components/canvas/CartoonCanvas"), { ssr: false, loading: () => <CanvasFallback color="#0d3320" /> }),
  "Horror":   dynamic(() => import("@/components/canvas/HorrorCanvas"),  { ssr: false, loading: () => <CanvasFallback color="#1a0000" /> }),
  "Comedy":   dynamic(() => import("@/components/canvas/ComedyCanvas"),  { ssr: false, loading: () => <CanvasFallback color="#332400" /> }),
  "Action":   dynamic(() => import("@/components/canvas/ActionCanvas"),  { ssr: false, loading: () => <CanvasFallback color="#1a0e00" /> }),
  "Romance":  dynamic(() => import("@/components/canvas/RomanceCanvas"), { ssr: false, loading: () => <CanvasFallback color="#330010" /> }),
  "Sci-Fi":   dynamic(() => import("@/components/canvas/SciFiCanvas"),   { ssr: false, loading: () => <CanvasFallback color="#001433" /> }),
};

function CanvasFallback({ color }: { color: string }) {
  return <div style={{ position:"fixed", inset:0, zIndex:0, background: color }} />;
}

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const container: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { ease: EASE, duration: 0.5 } },
};

const navVariant: Variants = {
  hidden: { opacity: 0, y: -16 },
  show:   { opacity: 1, y: 0, transition: { ease: EASE, duration: 0.45 } },
};

export default function GenrePageClient({ title, accentColor, rows, profileId }: GenrePageClientProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [playingItem,  setPlayingItem]  = useState<MediaItem | null>(null);

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

  const CanvasComponent = canvasMap[title] ?? null;

  return (
    <div className="min-h-[100dvh]">
      {/* z-0: Canvas full-screen background */}
      {CanvasComponent && <CanvasComponent />}

      {/* z-1: Dark overlay */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 1,
          background: "rgba(0,0,0,0.45)",
          pointerEvents: "none",
        }}
      />

      {/* z-10: All content */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Frosted glass sub-navbar */}
        <motion.div
          variants={navVariant}
          initial="hidden"
          animate="show"
          className="sticky top-16 flex items-center gap-4 px-4 md:px-8 py-4"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Link
            href="/browse"
            className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              width: 44, height: 44,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: accentColor }}>
            {title}
          </h1>
        </motion.div>

        {/* Content rows */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8 py-6 pb-16"
        >
          {rows.map((row) => (
            <motion.div key={row.title} variants={itemVariant}>
              <ContentRow
                title={row.title}
                items={row.items}
                onItemClick={setSelectedItem}
                mediaType={row.mediaType}
              />
            </motion.div>
          ))}
        </motion.div>
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
    </div>
  );
}
