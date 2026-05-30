"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Play, Plus, Check, Star, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl, getTitle, getYear, formatRuntime, formatRating } from "@/lib/utils";
import type { MediaDetails, MediaItem, CastMember } from "@/types";
import MediaCard from "@/components/browse/MediaCard";

interface DetailModalProps {
  mediaId: number;
  mediaType: "movie" | "tv";
  onClose: () => void;
  onPlay: (item: MediaItem, season?: number, episode?: number) => void;
  profileId: string | null;
}

export default function DetailModal({
  mediaId,
  mediaType,
  onClose,
  onPlay,
  profileId,
}: DetailModalProps) {
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [inList, setInList] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/tmdb?endpoint=/${mediaType}/${mediaId}&append_to_response=credits,similar,videos`
      );
      if (res.ok) {
        const data = await res.json();
        setDetails(data);
      }
    } catch {
      // network error
    }
    setLoading(false);
  }, [mediaId, mediaType]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  useEffect(() => {
    if (!profileId) return;
    import("@/actions/watchlist").then(({ isInWatchlist }) => {
      isInWatchlist(profileId, mediaId, mediaType).then(setInList);
    }).catch(() => {});
  }, [profileId, mediaId, mediaType]);

  useEffect(() => {
    if (!profileId) return;
    import("@/actions/ratings").then(({ getRating }) => {
      getRating(profileId, mediaId, mediaType).then(setUserRating);
    }).catch(() => {});
  }, [profileId, mediaId, mediaType]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function toggleWatchlist() {
    if (!profileId || !details) return;
    const body = {
      profile_id: profileId,
      media_id: mediaId,
      media_type: mediaType,
      title: getTitle(details),
      poster_path: details.poster_path,
    };
    try {
      if (!inList) {
        const { addToWatchlist } = await import("@/actions/watchlist");
        await addToWatchlist(body);
      } else {
        const { removeFromWatchlist } = await import("@/actions/watchlist");
        await removeFromWatchlist(profileId, mediaId, mediaType);
      }
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

  const trailer = details?.videos?.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "rgba(8,6,5,0.95)" }}
    >
      <div className="flex min-h-full items-start justify-center p-4 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative w-full max-w-5xl rounded-2xl overflow-hidden"
          style={{
            background: "#12100e",
            border: "1px solid #2a2520",
            boxShadow: "0 32px 64px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute right-6 top-6 z-20 rounded-full p-2.5"
            style={{
              background: "rgba(8,6,5,0.9)",
              border: "1px solid rgba(245,240,235,0.1)",
            }}
          >
            <X className="h-5 w-5" style={{ color: "#f5f0eb" }} />
          </motion.button>

          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="w-full max-w-3xl space-y-4 px-8">
                <div className="h-64 rounded-xl relative overflow-hidden skeleton-shimmer" />
              </div>
            </div>
          ) : details ? (
            <>
              {/* Hero Section - Theater Mode */}
              <div className="relative aspect-video w-full overflow-hidden">
                {trailer ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <Image
                      src={getImageUrl(details.backdrop_path, "original")}
                      alt={getTitle(details)}
                      fill
                      className="object-cover"
                    />
                    {/* Warm gradient to dark */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to top, #12100e 0%, rgba(18,16,14,0.75) 40%, transparent 100%)",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to right, #12100e 0%, rgba(18,16,14,0.6) 40%, transparent 100%)",
                      }}
                    />
                  </>
                )}
              </div>

              {/* Content Section */}
              <div className="px-8 pt-8 pb-12 space-y-8">
                {/* Title */}
                <div className="space-y-4">
                  <h2
                    className="text-4xl font-bold leading-none tracking-tighter md:text-5xl"
                    style={{ color: "#f5f0eb" }}
                  >
                    {getTitle(details)}
                  </h2>

                  {/* Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    {details.vote_average && (
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{
                          background: "rgba(245,240,235,0.05)",
                          border: "1px solid rgba(212,168,83,0.15)",
                        }}
                      >
                        <Star className="h-3.5 w-3.5" style={{ color: "#e8c87a", fill: "#e8c87a" }} />
                        <span className="text-xs tracking-widest" style={{ color: "#f5f0eb" }}>
                          {formatRating(details.vote_average)}
                        </span>
                      </div>
                    )}
                    {details.release_date && (
                      <div
                        className="px-3 py-1.5 rounded-lg"
                        style={{
                          background: "rgba(245,240,235,0.05)",
                          border: "1px solid rgba(245,240,235,0.08)",
                        }}
                      >
                        <span className="text-xs tracking-widest uppercase" style={{ color: "#b8b0a4" }}>
                          {getYear(details)}
                        </span>
                      </div>
                    )}
                    {details.runtime && (
                      <div
                        className="px-3 py-1.5 rounded-lg"
                        style={{
                          background: "rgba(245,240,235,0.05)",
                          border: "1px solid rgba(245,240,235,0.08)",
                        }}
                      >
                        <span className="text-xs tracking-widest uppercase" style={{ color: "#b8b0a4" }}>
                          {formatRuntime(details.runtime)}
                        </span>
                      </div>
                    )}
                    <div
                      className="px-3 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(245,240,235,0.05)",
                        border: "1px solid rgba(245,240,235,0.08)",
                      }}
                    >
                      <span className="text-xs tracking-widest uppercase" style={{ color: "#b8b0a4" }}>4K</span>
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(245,240,235,0.05)",
                        border: "1px solid rgba(245,240,235,0.08)",
                      }}
                    >
                      <span className="text-xs tracking-widest uppercase" style={{ color: "#b8b0a4" }}>HDR</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onPlay(details)}
                    className="flex items-center gap-2.5 rounded-xl px-8 py-4 text-base font-semibold transition-all"
                    style={{
                      background: "linear-gradient(135deg, #f5f0eb 0%, #e8dcc8 100%)",
                      color: "#080605",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                    }}
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Play
                  </motion.button>
                  {profileId && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={toggleWatchlist}
                      className="flex items-center gap-2.5 rounded-xl px-7 py-4 font-semibold transition-all"
                      style={{
                        background: "rgba(245,240,235,0.05)",
                        border: "1px solid rgba(245,240,235,0.12)",
                        color: "#f5f0eb",
                      }}
                    >
                      {inList ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      {inList ? "In My List" : "My List"}
                    </motion.button>
                  )}
                </div>

                {/* Tagline */}
                {details.tagline && (
                  <p
                    className="text-lg italic border-l-2 pl-5 leading-relaxed"
                    style={{ color: "#9c948a", borderColor: "#d4a853" }}
                  >
                    &ldquo;{details.tagline}&rdquo;
                  </p>
                )}

                {/* Overview */}
                <p className="text-base leading-relaxed" style={{ color: "#b8b0a4" }}>
                  {details.overview}
                </p>

                {/* Genres */}
                {details.genres && (
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-full px-4 py-2 text-xs font-medium tracking-wide uppercase"
                        style={{
                          background: "rgba(245,240,235,0.05)",
                          border: "1px solid rgba(245,240,235,0.08)",
                          color: "#9c948a",
                        }}
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Star Rating */}
                {profileId && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6a6054" }}>
                      Your Rating
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                        const active = hoverRating !== null ? n <= hoverRating : userRating !== null && n <= userRating;
                        return (
                          <motion.button
                            key={n}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRate(n)}
                            onMouseEnter={() => setHoverRating(n)}
                            onMouseLeave={() => setHoverRating(null)}
                          >
                            <Star
                              className="h-5 w-5"
                              style={{
                                fill: active ? "#e8c87a" : "transparent",
                                color: active ? "#e8c87a" : "#3a352e",
                              }}
                            />
                          </motion.button>
                        );
                      })}
                      {userRating && (
                        <span className="ml-4 text-xs tracking-widest" style={{ color: "#9c948a" }}>
                          {userRating}/10
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="h-px" style={{ background: "#2a2520" }} />

                {/* Cast */}
                {details.credits?.cast && details.credits.cast.length > 0 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1 h-6 rounded-full"
                        style={{ background: "#d4a853", boxShadow: "0 0 8px rgba(212,168,83,0.3)" }}
                      />
                      <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#f5f0eb" }}>Cast</h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {details.credits.cast.slice(0, 10).map((member: CastMember) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          className="flex-shrink-0 text-center"
                          style={{ width: 88 }}
                        >
                          <div
                            className="relative mx-auto overflow-hidden rounded-full"
                            style={{
                              width: 72,
                              height: 72,
                              background: "linear-gradient(135deg, #1a1612, #12100e)",
                              border: "1px solid #2a2520",
                            }}
                          >
                            {member.profile_path ? (
                              <Image
                                src={getImageUrl(member.profile_path, "w185")}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-lg font-semibold" style={{ color: "#4a4540" }}>
                                {member.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <p className="mt-2.5 w-full truncate text-xs font-semibold leading-tight" style={{ color: "#b8b0a4" }}>
                            {member.name}
                          </p>
                          <p className="w-full truncate text-[10px] leading-tight uppercase tracking-widest" style={{ color: "#4a4540" }}>
                            {member.character}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* More Like This */}
                {details.similar?.results && details.similar.results.length > 0 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1 h-6 rounded-full"
                        style={{ background: "#d4a853", boxShadow: "0 0 8px rgba(212,168,83,0.3)" }}
                      />
                      <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#f5f0eb" }}>More Like This</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {details.similar.results.slice(0, 10).map((item: MediaItem, index: number) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                            delay: index * 0.05,
                          }}
                        >
                          <MediaCard
                            item={item}
                            onClick={() => {
                              onClose();
                              setTimeout(() => {
                                window.dispatchEvent(
                                  new CustomEvent("open-detail", {
                                    detail: { ...item, media_type: mediaType },
                                  })
                                );
                              }, 100);
                            }}
                            mediaType={mediaType}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-96 items-center justify-center" style={{ color: "#4a4540" }}>
              Failed to load details
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
