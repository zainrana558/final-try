"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X, Play, Plus, Check, Star, Clock, Calendar, Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    const res = await fetch(
      `/api/tmdb?endpoint=/${mediaType}/${mediaId}&append_to_response=credits,similar,videos`
    );
    if (res.ok) {
      const data = await res.json();
      setDetails(data);
    }
    setLoading(false);
  }, [mediaId, mediaType]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

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
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function toggleWatchlist() {
    if (!profileId || !details) return;
    const action = inList ? "remove" : "add";
    const body = {
      profile_id: profileId,
      media_id: mediaId,
      media_type: mediaType,
      title: getTitle(details),
      poster_path: details.poster_path,
    };
    try {
      if (action === "add") {
        const { addToWatchlist } = await import("@/actions/watchlist");
        await addToWatchlist(body);
      } else {
        const { removeFromWatchlist } = await import("@/actions/watchlist");
        await removeFromWatchlist(profileId, mediaId, mediaType);
      }
      setInList(!inList);
    } catch {
      // ignore
    }
  }

  async function handleRate(rating: number) {
    if (!profileId) return;
    try {
      const { setRating } = await import("@/actions/ratings");
      await setRating({ profile_id: profileId, media_id: mediaId, media_type: mediaType, rating });
      setUserRating(rating);
    } catch {
      // ignore
    }
  }

  const trailer = details?.videos?.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-12"
      style={{ background: "rgba(0,0,0,0.85)" }}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full p-2 transition-all duration-200 hover:bg-white/10"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <X className="h-4 w-4 text-white" />
        </button>

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
              style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }}
            />
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
              <div
                className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-16"
                style={{ background: "linear-gradient(to top, #111111 0%, transparent 100%)" }}
              >
                <h2 className="text-2xl font-bold text-white md:text-3xl leading-tight">
                  {getTitle(details)}
                </h2>
              </div>
            </div>

            <div className="px-6 pt-4 pb-8 space-y-6">

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => onPlay(details)}
                  className="gap-2 rounded-lg px-5 font-semibold"
                  style={{ background: "#7c3aed", color: "#fff" }}
                >
                  <Play className="h-4 w-4 fill-current" />
                  Play
                </Button>
                {profileId && (
                  <Button
                    variant="outline"
                    onClick={toggleWatchlist}
                    className="gap-2 rounded-lg px-5 font-semibold"
                    style={{
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "transparent",
                      color: "#e4e4e7",
                    }}
                  >
                    {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {inList ? "In My List" : "My List"}
                  </Button>
                )}
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{formatRating(details.vote_average)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {getYear(details)}
                </span>
                {details.runtime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {formatRuntime(details.runtime)}
                  </span>
                )}
                {details.number_of_seasons && (
                  <span className="flex items-center gap-1.5">
                    <Film className="h-3.5 w-3.5" />
                    {details.number_of_seasons} Season{details.number_of_seasons > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Tagline */}
              {details.tagline && (
                <p className="text-sm italic text-zinc-500 border-l-2 border-zinc-700 pl-3">
                  &ldquo;{details.tagline}&rdquo;
                </p>
              )}

              {/* Overview */}
              <p className="text-sm leading-relaxed text-zinc-300">{details.overview}</p>

              {/* Genres */}
              {details.genres && (
                <div className="flex flex-wrap gap-2">
                  {details.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: "rgba(124,58,237,0.15)",
                        border: "1px solid rgba(124,58,237,0.3)",
                        color: "#a78bfa",
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
                  <p className="text-sm font-semibold text-zinc-300">Your Rating</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                      const active = hoverRating !== null ? n <= hoverRating : userRating !== null && n <= userRating;
                      return (
                        <button
                          key={n}
                          onClick={() => handleRate(n)}
                          onMouseEnter={() => setHoverRating(n)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="transition-transform duration-100 hover:scale-125"
                        >
                          <Star
                            className="h-5 w-5 transition-colors duration-100"
                            style={{
                              fill: active ? "#facc15" : "transparent",
                              color: active ? "#facc15" : "#3f3f46",
                              strokeWidth: 1.5,
                            }}
                          />
                        </button>
                      );
                    })}
                    {userRating && (
                      <span className="ml-2 text-xs text-zinc-500">{userRating}/10</span>
                    )}
                  </div>
                </div>
              )}

              {/* Divider */}
              <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

              {/* Cast */}
              {details.credits?.cast && details.credits.cast.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-0.5 h-4 rounded-full"
                      style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }}
                    />
                    <h3 className="text-base font-bold text-white">Cast</h3>
                  </div>
                  <div
                    className="flex gap-3 overflow-x-auto pb-2"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {details.credits.cast.slice(0, 10).map((member: CastMember) => (
                      <div key={member.id} className="flex-shrink-0 text-center" style={{ width: 72 }}>
                        <div
                          className="relative mx-auto overflow-hidden rounded-full bg-zinc-800"
                          style={{ width: 60, height: 60 }}
                        >
                          {member.profile_path ? (
                            <Image
                              src={getImageUrl(member.profile_path, "w185")}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xl text-zinc-500 font-semibold">
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <p className="mt-1.5 w-full truncate text-[10px] font-semibold text-zinc-200 leading-tight">
                          {member.name}
                        </p>
                        <p className="w-full truncate text-[10px] text-zinc-500 leading-tight">
                          {member.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* More Like This */}
              {details.similar?.results && details.similar.results.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-0.5 h-4 rounded-full"
                      style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }}
                    />
                    <h3 className="text-base font-bold text-white">More Like This</h3>
                  </div>
                  <div
                    className="flex gap-3 overflow-x-auto pb-2"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {details.similar.results.slice(0, 10).map((item: MediaItem) => (
                      <MediaCard
                        key={item.id}
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
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-96 items-center justify-center text-zinc-500">
            Failed to load details
          </div>
        )}
      </div>
    </div>
  );
}
