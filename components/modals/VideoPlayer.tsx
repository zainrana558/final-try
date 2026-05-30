"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronDown, RefreshCw } from "lucide-react";
import type { MediaItem, Season, Episode } from "@/types";
import { getTitle } from "@/lib/utils";

interface EmbedProvider {
  name: string;
  url: string;
}

interface VideoPlayerProps {
  item: MediaItem;
  onClose: () => void;
  profileId: string | null;
  initialSeason?: number;
  initialEpisode?: number;
}

export default function VideoPlayer({
  item,
  onClose,
  profileId,
  initialSeason = 1,
  initialEpisode = 1,
}: VideoPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(initialEpisode);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [providers, setProviders] = useState<EmbedProvider[]>([]);
  const [providerIndex, setProviderIndex] = useState(0);
  const [showServers, setShowServers] = useState(false);
  const mediaType = item.media_type || (item.title ? "movie" : "tv");

  const fetchEmbed = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/embed?tmdb=${item.id}&type=${mediaType}`;
      if (mediaType === "tv") {
        url += `&season=${season}&episode=${episode}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const list: EmbedProvider[] = data.providers ?? [];
        setProviders(list);
        setProviderIndex(0);
        setEmbedUrl(list[0]?.url ?? data.url ?? null);
      }
    } catch {
      // network error
    }
    setLoading(false);
  }, [item.id, mediaType, season, episode]);

  const switchProvider = (index: number) => {
    if (index >= 0 && index < providers.length) {
      setProviderIndex(index);
      setEmbedUrl(providers[index].url);
      setShowServers(false);
    }
  };

  useEffect(() => { fetchEmbed(); }, [fetchEmbed]);

  useEffect(() => {
    if (mediaType !== "tv") return;
    fetch(`/api/tmdb?endpoint=/tv/${item.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.seasons) {
          setSeasons(data.seasons.filter((s: Season) => s.season_number > 0));
        }
      })
      .catch(() => {});
  }, [item.id, mediaType]);

  useEffect(() => {
    if (mediaType !== "tv") return;
    fetch(`/api/tmdb?endpoint=/tv/${item.id}/season/${season}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.episodes) setEpisodes(data.episodes);
      })
      .catch(() => {});
  }, [item.id, mediaType, season]);

  useEffect(() => {
    if (!profileId || !embedUrl) return;
    const interval = setInterval(async () => {
      try {
        const { saveProgress } = await import("@/actions/progress");
        await saveProgress({
          profile_id: profileId,
          media_id: item.id,
          media_type: mediaType as "movie" | "tv",
          title: getTitle(item),
          poster_path: item.poster_path,
          progress: 0,
          duration: 0,
          ...(mediaType === "tv" ? { season_number: season, episode_number: episode } : {}),
        });
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, [profileId, item, mediaType, season, episode, embedUrl]);

  useEffect(() => {
    if (!profileId) return;
    import("@/actions/progress").then(({ addToHistory }) => {
      addToHistory(profileId, item.id, mediaType, getTitle(item), item.poster_path);
    }).catch(() => {});
  }, [profileId, item, mediaType]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60]" style={{ background: "#080605" }}>
      {/* Top Controls */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        {providers.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setShowServers(!showServers)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition-all"
              style={{
                background: "rgba(14,12,10,0.9)",
                border: "1px solid #2a2520",
                color: "#b8b0a4",
              }}
            >
              <RefreshCw className="h-4 w-4" />
              {providers[providerIndex]?.name ?? "Server"}
            </button>
            {showServers && (
              <div
                className="absolute right-0 top-full mt-1 w-40 rounded-xl p-1"
                style={{
                  background: "#12100e",
                  border: "1px solid #2a2520",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.9)",
                }}
              >
                {providers.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => switchProvider(i)}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm transition-all"
                    style={{
                      background: i === providerIndex ? "rgba(212,168,83,0.15)" : "transparent",
                      color: i === providerIndex ? "#d4a853" : "#b8b0a4",
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          onClick={onClose}
          className="rounded-xl p-2 transition-all"
          style={{
            background: "rgba(14,12,10,0.9)",
            border: "1px solid #2a2520",
            color: "#b8b0a4",
          }}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex h-full flex-col">
        <div className="relative flex-1">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div
                className="h-10 w-10 animate-spin rounded-full border-2"
                style={{ borderColor: "#d4a853", borderTopColor: "transparent" }}
              />
            </div>
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              className="h-full w-full"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <p style={{ color: "#5a544a" }}>Unable to load player</p>
              <button
                onClick={fetchEmbed}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all"
                style={{
                  border: "1px solid #2a2520",
                  color: "#7a7168",
                }}
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          )}
        </div>

        {mediaType === "tv" && (
          <div className="p-4" style={{ background: "#12100e", borderTop: "1px solid #2a2520" }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold" style={{ color: "#f5f0eb" }}>{getTitle(item)}</h3>
                <p className="text-sm" style={{ color: "#7a7168" }}>
                  S{season} E{episode}
                  {episodes[episode - 1] && ` — ${episodes[episode - 1].name}`}
                </p>
              </div>
              <button
                onClick={() => setShowEpisodes(!showEpisodes)}
                className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm transition-all"
                style={{
                  border: "1px solid #2a2520",
                  color: "#9c948a",
                }}
              >
                Episodes
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showEpisodes ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {showEpisodes && (
              <div className="mt-4 space-y-3">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {seasons.map((s) => (
                    <button
                      key={s.season_number}
                      onClick={() => { setSeason(s.season_number); setEpisode(1); }}
                      className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-all"
                      style={{
                        background: season === s.season_number ? "rgba(212,168,83,0.15)" : "rgba(245,240,235,0.05)",
                        color: season === s.season_number ? "#d4a853" : "#7a7168",
                        border: season === s.season_number ? "1px solid rgba(212,168,83,0.2)" : "1px solid transparent",
                      }}
                    >
                      Season {s.season_number}
                    </button>
                  ))}
                </div>
                <div className="max-h-48 space-y-1 overflow-y-auto scrollbar-hide">
                  {episodes.map((ep) => (
                    <button
                      key={ep.episode_number}
                      onClick={() => setEpisode(ep.episode_number)}
                      className="w-full rounded-xl p-3 text-left transition-all"
                      style={{
                        background: episode === ep.episode_number ? "rgba(212,168,83,0.08)" : "transparent",
                        border: episode === ep.episode_number ? "1px solid rgba(212,168,83,0.15)" : "1px solid transparent",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ color: episode === ep.episode_number ? "#f5f0eb" : "#b8b0a4" }}>
                          {ep.episode_number}. {ep.name}
                        </span>
                        {ep.runtime && (
                          <span className="text-xs" style={{ color: "#5a544a" }}>{ep.runtime}m</span>
                        )}
                      </div>
                      {ep.overview && (
                        <p className="mt-1 line-clamp-2 text-xs" style={{ color: "#5a544a" }}>{ep.overview}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
