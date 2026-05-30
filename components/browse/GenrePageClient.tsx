"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContentRow from "./ContentRow";
import GenreHeader from "./GenreHeader";
import ParticleLayer from "@/components/particles/ParticleLayer";
import GSAPVignette from "@/components/effects/GSAPVignette";
import GSAPSpeedLines from "@/components/effects/GSAPSpeedLines";
import FramerPulse from "@/components/effects/FramerPulse";
import SciFiEffects from "@/components/effects/SciFiEffects";
import DetailModal from "@/components/modals/DetailModal";
import VideoPlayer from "@/components/modals/VideoPlayer";
import type { MediaItem, ContentRow as ContentRowType } from "@/types";
import type { ParticleConfig } from "@/lib/particles/configs";

interface GenrePageClientProps {
  title: string;
  accentColor: string;
  rows: ContentRowType[];
  profileId: string | null;
  particleConfig?: ParticleConfig;
  tagline?: string;
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

export default function GenrePageClient({ 
  title, 
  accentColor, 
  rows, 
  profileId, 
  particleConfig,
  tagline 
}: GenrePageClientProps) {
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

  // LUMINA: Render extra effects based on particle config
  const renderExtraEffects = () => {
    if (!particleConfig?.extraEffects) return null;

    switch (particleConfig.extraEffects) {
      case "gsap-vignette":
        return <GSAPVignette />;
      case "gsap-speedlines":
        return <GSAPSpeedLines accentColor={accentColor} />;
      case "framer-pulse":
        return <FramerPulse count={3} />;
      case "gsap-scanline":
        return <SciFiEffects accentColor={accentColor} />;
      case "css-grid":
        return <SciFiEffects accentColor={accentColor} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[100dvh] relative">
      {/* LUMINA: Particle Layer */}
      <AnimatePresence mode="wait">
        {particleConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ParticleLayer config={particleConfig} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* LUMINA: Extra Effects */}
      <AnimatePresence mode="wait">
        {particleConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderExtraEffects()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LUMINA: Sub-navbar */}
      <motion.div
        variants={navVariant}
        initial="hidden"
        animate="show"
        className="sticky top-0 z-20 flex items-center gap-4 px-4 md:px-8 py-4"
        style={{
          background: "var(--sidebar-bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          href="/browse"
          className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-100"
          style={{ border: "1px solid var(--border)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover-surface)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <ArrowLeft className="h-4 w-4" style={{ color: "var(--text-primary)" }} />
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-6"
            style={{ background: accentColor }}
          />
          <h1 
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h1>
        </div>
      </motion.div>

      {/* LUMINA: Genre Header */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <GenreHeader title={title} tagline={tagline} accentColor={accentColor} />
      </div>

      {/* LUMINA: Content rows */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="py-8 space-y-0"
        style={{ position: "relative", zIndex: 10 }}
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
