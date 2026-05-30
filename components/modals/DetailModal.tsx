"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X, Play, Plus, Check, Star, Clock, Calendar, Film,
} from "lucide-react";
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
      // network error — details stays null
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
      className="fixed inset-0 z-50 overflow-y-auto bg-black"
    >
      <div className="flex min-h-full items-start justify-center p-4 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="relative w-full max-w-5xl rounded-2xl overflow-hidden"
          style={{
            background: "#0a0a0a",
            border: "1px solid #1f1f1f",
            boxShadow: "0 32px 64px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.03)"
          }}
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute right-6 top-6 z-20 rounded-full p-2.5"
            style={{
              background: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <X className="h-5 w-5 text-white" />
          </motion.button>

          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="w-full max-w-3xl space-y-4 px-8">
                <div className="h-64 bg-zinc-900 rounded-lg relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 65%, transparent 100%)",
                      animation: "shimmer 1.5s linear infinite"
                    }}
                  />
                </div>
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
                    {/* Heavy gradient to black */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.7) 40%, transparent 100%)"
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.6) 40%, transparent 100%)"
                      }}
                    />
                  </>
                )}
              </div>

              {/* Content Section */}
              <div className="px-8 pt-8 pb-12 space-y-8">
                {/* Title with Ultra-Compressed Tracking */}
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-white leading-none tracking-tighter md:text-5xl">
                    {getTitle(details)}
                  </h2>

                  {/* Metadata Badges - Monospace & Wide Tracking */}
                  <div className="flex flex-wrap items-center gap-3">
                    {details.vote_average && (
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded border"
                        style={{
                          borderColor: "rgba(255,255,255,0.1)",
                          background: "rgba(255,255,255,0.05)"
                        }}
                      >
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-white font-mono tracking-widest">
                          {formatRating(details.vote_average)}
                        </span>
                      </div>
                    )}
                    {details.release_date && (
                      <div
                        className="px-3 py-1.5 rounded border"
                        style={{
                          borderColor: "rgba(255,255,255,0.1)",
                          background: "rgba(255,255,255,0.05)"
                        }}
                      >
                        <span className="text-xs text-white font-mono tracking-widest uppercase">
                          {getYear(details)}
                        </span>
                      </div>
                    )}
                    {details.runtime && (
                      <div
                        className="px-3 py-1.5 rounded border"
                        style={{
                          borderColor: "rgba(255,255,255,0.1)",
                          background: "rgba(255,255,255,0.05)"
                        }}
                      >
                        <span className="text-xs text-white font-mono tracking-widest uppercase">
                          {formatRuntime(details.runtime)}
                        </span>
                      </div>
                    )}
                    <div
                      className="px-3 py-1.5 rounded border"
                      style={{
                        borderColor: "rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.05)"
                      }}
                    >
                      <span className="text-xs text-white font-mono tracking-widest uppercase">
                        4K
                      </span>
                    </div>
                    <div
                      className="px-3 py-1.5 rounded border"
                      style={{
                        borderColor: "rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.05)"
                      }}
                    >
                      <span className="text-xs text-white font-mono tracking-widest uppercase">
                        HDR
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onPlay(details)}
                    className="flex items-center gap-2.5 rounded-lg bg-white text-black font-semibold px-8 py-4 text-base transition-all"
                    style={{
                      boxShadow: "0 8px 32px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.5)"
                    }}
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Play
                  </motion.button>
                  {profileId && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={toggleWatchlist}
                      className="flex items-center gap-2.5 rounded-lg px-7 py-4 font-semibold text-white"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.15)"
                      }}
                    >
                      {inList ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      {inList ? "In My List" : "My List"}
                    </motion.button>
                  )}
                </div>

                {/* Tagline */}
                {details.tagline && (
                  <p className="text-lg italic text-zinc-400 border-l-2 border-zinc-700 pl-5 leading-relaxed">
                    &ldquo;{details.tagline}&rdquo;
                  </p>
                )}

                {/* Overview */}
                <p className="text-base leading-relaxed text-zinc-300">{details.overview}</p>

                {/* Genres */}
                {details.genres && (
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-full px-4 py-2 text-xs font-medium tracking-wide uppercase"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#a3a3a3"
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
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
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
                                fill: active ? "#facc15" : "transparent",
                                color: active ? "#facc15" : "#3f3f46",
                              }}
                            />
                          </motion.button>
                        );
                      })}
                      {userRating && (
                        <span className="ml-4 text-xs text-zinc-400 font-mono tracking-widest">
                          {userRating}/10
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="h-px bg-[#1f1f1f]" />

                {/* Cast */}
                {details.credits?.cast && details.credits.cast.length > 0 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 rounded-full bg-white" style={{ boxShadow: "0 0 8px rgba(255,255,255,0.3)" }} />
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest">Cast</h3>
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
                              background: "linear-gradient(135deg, #1a1a1a, #0a0a0a)",
                              border: "1px solid #2a2a2a"
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
                              <div className="flex h-full items-center justify-center text-lg text-zinc-600 font-semibold">
                                {member.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <p className="mt-2.5 w-full truncate text-xs font-semibold text-zinc-200 leading-tight">
                            {member.name}
                          </p>
                          <p className="w-full truncate text-[10px] text-zinc-600 leading-tight uppercase tracking-widest">
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
                      <div className="w-1 h-6 rounded-full bg-white" style={{ boxShadow: "0 0 8px rgba(255,255,255,0.3)" }} />
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest">More Like This</h3>
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
                            delay: index * 0.05
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
            <div className="flex h-96 items-center justify-center text-zinc-600">
              Failed to load details
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
