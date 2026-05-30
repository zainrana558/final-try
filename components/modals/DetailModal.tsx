"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X, Play, Plus, Check, Star, Clock, Calendar, Film,
} from "lucide-react";
import { getImageUrl, getTitle, getYear, formatRuntime, formatRating } from "@/lib/utils";
import type { MediaDetails, MediaItem, CastMember } from "@/types";
import MediaCard from "@/components/browse/MediaCard";
import { motion, AnimatePresence } from "framer-motion";

interface DetailModalProps {
  mediaId: number;
  mediaType: "movie" | "tv";
  onClose: () => void;
  onPlay: (item: MediaItem, season?: number, episode?: number) => void;
  profileId: string | null;
}

export default function DetailModal({
  mediaId, mediaType, onClose, onPlay, profileId,
}: DetailModalProps) {
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [inList, setInList] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tmdb?endpoint=/${mediaType}/${mediaId}&append_to_response=credits,similar,videos`);
      if (res.ok) setDetails(await res.json());
    } catch {}
    setLoading(false);
  }, [mediaId, mediaType]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  useEffect(() => {
    if (!profileId) return;
    import("@/actions/watchlist").then(({ isInWatchlist }) =>
      isInWatchlist(profileId, mediaId, mediaType).then(setInList)
    ).catch(() => {});
  }, [profileId, mediaId, mediaType]);

  useEffect(() => {
    if (!profileId) return;
    import("@/actions/ratings").then(({ getRating }) =>
      getRating(profileId, mediaId, mediaType).then(setUserRating)
    ).catch(() => {});
  }, [profileId, mediaId, mediaType]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function toggleWatchlist() {
    if (!profileId || !details) return;
    const body = { profile_id: profileId, media_id: mediaId, media_type: mediaType, title: getTitle(details), poster_path: details.poster_path };
    try {
      if (!inList) { const { addToWatchlist } = await import("@/actions/watchlist"); await addToWatchlist(body); }
      else { const { removeFromWatchlist } = await import("@/actions/watchlist"); await removeFromWatchlist(profileId, mediaId, mediaType); }
      setInList(!inList);
    } catch {}
  }

  async function handleRate(rating: number) {
    if (!profileId) return;
    try {
      const { setRating } = await import("@/actions/ratings");
      await setRating({ profile_id: profileId, media_id: mediaId, media_type: mediaType, rating });
      setUserRating(rating);
    } catch {}
  }

  const trailer = details?.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: "rgba(0,0,0,0.88)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl"
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          style={{ background: "#0a0a0a", border: "1px solid #1f1f1f" }}
        >
          {/* Close */}
          <motion.button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200"
            style={{ background: "rgba(0,0,0,0.7)", border: "1px solid #2a2a2a" }}
            whileHover={{ background: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-3.5 w-3.5 text-white" />
          </motion.button>

          {loading ? (
            <div className="flex h-80 items-center justify-center">
              <div className="relative">
                <div
                  className="h-8 w-8 rounded-full border-2 animate-spin"
                  style={{ borderColor: "#1f1f1f", borderTopColor: "#7c3aed" }}
                />
                <div
                  className="absolute inset-0 h-8 w-8 rounded-full animate-ping opacity-20"
                  style={{ border: "2px solid #7c3aed" }}
                />
              </div>
            </div>
          ) : details ? (
            <>
              {/* Hero */}
              <div className="relative aspect-video w-full overflow-hidden">
                {trailer ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <Image
                    src={getImageUrl(details.backdrop_path, "original")}
                    alt={getTitle(details)}
                    fill
                    className="object-cover"
                  />
                )}
                {/* Gradient over hero */}
                <div
                  className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-24"
                  style={{ background: "linear-gradient(to top, #0a0a0a 0%, transparent 100%)" }}
                >
                  <h2
                    className="text-2xl font-bold text-white leading-tight tracking-tighter md:text-3xl"
                    style={{ fontFamily: "var(--font-display, Syne, sans-serif)" }}
                  >
                    {getTitle(details)}
                  </h2>
                </div>
              </div>

              <div className="px-6 pt-4 pb-8 space-y-5">
                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <motion.button
                    onClick={() => onPlay(details)}
                    className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                      boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                    }}
                    whileHover={{ scale: 1.03, boxShadow: "0 6px 28px rgba(124,58,237,0.5)" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <Play className="h-4 w-4 fill-current" /> Play
                  </motion.button>

                  {profileId && (
                    <motion.button
                      onClick={toggleWatchlist}
                      className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold"
                      style={{
                        background: inList ? "rgba(124,58,237,0.12)" : "transparent",
                        border: `1px solid ${inList ? "rgba(124,58,237,0.4)" : "#2a2a2a"}`,
                        color: inList ? "#c4b5fd" : "#888",
                      }}
                      whileHover={{ background: "rgba(124,58,237,0.12)", color: "#c4b5fd" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {inList ? "In My List" : "My List"}
                    </motion.button>
                  )}
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span
                      className="text-[12px] font-semibold text-yellow-400"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {formatRating(details.vote_average)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#555" }}>
                    <Calendar className="h-3 w-3" />
                    <span style={{ fontFamily: "var(--font-mono)" }}>{getYear(details)}</span>
                  </span>
                  {details.runtime && (
                    <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#555" }}>
                      <Clock className="h-3 w-3" />
                      <span style={{ fontFamily: "var(--font-mono)" }}>{formatRuntime(details.runtime)}</span>
                    </span>
                  )}
                  {details.number_of_seasons && (
                    <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "#555" }}>
                      <Film className="h-3 w-3" />
                      <span style={{ fontFamily: "var(--font-mono)" }}>
                        {details.number_of_seasons}S
                      </span>
                    </span>
                  )}
                </div>

                {/* Tagline */}
                {details.tagline && (
                  <p
                    className="text-[12px] italic pl-3"
                    style={{ color: "#555", borderLeft: "2px solid #2a2a2a" }}
                  >
                    &ldquo;{details.tagline}&rdquo;
                  </p>
                )}

                {/* Overview */}
                <p className="text-[13px] leading-relaxed" style={{ color: "#888" }}>
                  {details.overview}
                </p>

                {/* Genres */}
                {details.genres && (
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-full px-3 py-1 text-[11px] font-medium tracking-wide"
                        style={{
                          background: "rgba(124,58,237,0.1)",
                          border: "1px solid rgba(124,58,237,0.2)",
                          color: "#c4b5fd",
                        }}
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Star Rating */}
                {profileId && (
                  <div className="space-y-2">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                      style={{ color: "#444" }}
                    >
                      Your Rating
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                        const active = hoverRating !== null ? n <= hoverRating : userRating !== null && n <= userRating;
                        return (
                          <motion.button
                            key={n}
                            onClick={() => handleRate(n)}
                            onMouseEnter={() => setHoverRating(n)}
                            onMouseLeave={() => setHoverRating(null)}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                          >
                            <Star
                              className="h-4 w-4"
                              style={{
                                fill: active ? "#facc15" : "transparent",
                                color: active ? "#facc15" : "#2a2a2a",
                                strokeWidth: 1.5,
                              }}
                            />
                          </motion.button>
                        );
                      })}
                      {userRating && (
                        <span
                          className="ml-2 text-[11px]"
                          style={{ color: "#555", fontFamily: "var(--font-mono)" }}
                        >
                          {userRating}/10
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div style={{ height: "1px", background: "#141414" }} />

                {/* Cast */}
                {details.credits?.cast && details.credits.cast.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-[2px] rounded-full" style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
                      <h3 className="text-[13px] font-semibold text-white">Cast</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {details.credits.cast.slice(0, 12).map((member: CastMember) => (
                        <div key={member.id} className="flex-shrink-0 text-center" style={{ width: 64 }}>
                          <div
                            className="relative mx-auto overflow-hidden rounded-full"
                            style={{
                              width: 52, height: 52,
                              background: "#111",
                              border: "1px solid #1f1f1f",
                            }}
                          >
                            {member.profile_path ? (
                              <Image src={getImageUrl(member.profile_path, "w185")} alt={member.name} fill className="object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-base font-bold text-zinc-600">
                                {member.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <p className="mt-1.5 w-full truncate text-[10px] font-semibold text-zinc-200 leading-tight">{member.name}</p>
                          <p className="w-full truncate text-[9px] leading-tight" style={{ color: "#444" }}>{member.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* More Like This */}
                {details.similar?.results && details.similar.results.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-[2px] rounded-full" style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
                      <h3 className="text-[13px] font-semibold text-white">More Like This</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {details.similar.results.slice(0, 10).map((item: MediaItem) => (
                        <MediaCard
                          key={item.id}
                          item={item}
                          onClick={() => {
                            onClose();
                            setTimeout(() => {
                              window.dispatchEvent(new CustomEvent("open-detail", { detail: { ...item, media_type: mediaType } }));
                            }, 100);
                          }}
                          mediaType={mediaType}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-80 items-center justify-center text-[13px]" style={{ color: "#444" }}>
              Failed to load details
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
