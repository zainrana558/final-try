"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronDown, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaItem, Season, Episode } from "@/types";
import { getTitle } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface EmbedProvider { name: string; url: string; }

interface VideoPlayerProps {
  item: MediaItem;
  onClose: () => void;
  profileId: string | null;
  initialSeason?: number;
  initialEpisode?: number;
}

export default function VideoPlayer({
  item, onClose, profileId, initialSeason = 1, initialEpisode = 1,
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
      if (mediaType === "tv") url += `&season=${season}&episode=${episode}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const list: EmbedProvider[] = data.providers ?? [];
        setProviders(list);
        setProviderIndex(0);
        setEmbedUrl(list[0]?.url ?? data.url ?? null);
      }
    } catch {}
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
      .then((data) => { if (data.seasons) setSeasons(data.seasons.filter((s: Season) => s.season_number > 0)); })
      .catch(() => {});
  }, [item.id, mediaType]);

  useEffect(() => {
    if (mediaType !== "tv") return;
    fetch(`/api/tmdb?endpoint=/tv/${item.id}/season/${season}`)
      .then((r) => r.json())
      .then((data) => { if (data.episodes) setEpisodes(data.episodes); })
      .catch(() => {});
  }, [item.id, mediaType, season]);

  useEffect(() => {
    if (!profileId || !embedUrl) return;
    const interval = setInterval(async () => {
      try {
        const { saveProgress } = await import("@/actions/progress");
        await saveProgress({
          profile_id: profileId, media_id: item.id, media_type: mediaType as "movie" | "tv",
          title: getTitle(item), poster_path: item.poster_path, progress: 0, duration: 0,
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
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[60]" style={{ background: "#000" }}>
      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
            whileHover={{ background: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-4 w-4 text-white" />
          </motion.button>
          {mediaType === "tv" && (
            <span className="text-[12px] text-zinc-400" style={{ fontFamily: "var(--font-mono)" }}>
              {getTitle(item)} — S{season} E{episode}
              {episodes[episode - 1] ? ` · ${episodes[episode - 1].name}` : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {providers.length > 1 && (
            <div className="relative">
              <motion.button
                onClick={() => setShowServers(!showServers)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] text-zinc-300"
                style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
                whileHover={{ background: "rgba(255,255,255,0.08)" }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {providers[providerIndex]?.name ?? "Server"}
              </motion.button>
              <AnimatePresence>
                {showServers && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1.5 w-40 rounded-xl p-1.5 shadow-2xl"
                    style={{ background: "#0a0a0a", border: "1px solid #1f1f1f" }}
                  >
                    {providers.map((p, i) => (
                      <button
                        key={p.name}
                        onClick={() => switchProvider(i)}
                        className="w-full rounded-lg px-3 py-2 text-left text-[12px] transition-colors duration-150"
                        style={{
                          background: i === providerIndex ? "rgba(124,58,237,0.15)" : "transparent",
                          color: i === providerIndex ? "#c4b5fd" : "#888",
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Player */}
      <div className="flex h-full flex-col">
        <div className="relative flex-1">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="relative">
                <div
                  className="h-10 w-10 rounded-full border-2 animate-spin"
                  style={{ borderColor: "#1f1f1f", borderTopColor: "#7c3aed" }}
                />
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-20"
                  style={{ border: "2px solid #7c3aed" }}
                />
              </div>
            </div>
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              className="h-full w-full"
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[13px]" style={{ color: "#444" }}>
              Unable to load player
            </div>
          )}
        </div>

        {/* Episode panel for TV */}
        {mediaType === "tv" && (
          <div style={{ background: "#060606", borderTop: "1px solid #141414" }}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Prev/Next episode */}
                <motion.button
                  onClick={() => { if (episode > 1) setEpisode(e => e - 1); }}
                  disabled={episode <= 1}
                  className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
                  style={{ background: "#0f0f0f", border: "1px solid #1f1f1f", opacity: episode <= 1 ? 0.3 : 1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-3.5 w-3.5 text-zinc-400" />
                </motion.button>
                <div>
                  <p className="text-[13px] font-semibold text-white">{getTitle(item)}</p>
                  <p className="text-[11px]" style={{ color: "#555", fontFamily: "var(--font-mono)" }}>
                    S{String(season).padStart(2, "0")}·E{String(episode).padStart(2, "0")}
                    {episodes[episode - 1] ? ` — ${episodes[episode - 1].name}` : ""}
                  </p>
                </div>
                <motion.button
                  onClick={() => { if (episode < episodes.length) setEpisode(e => e + 1); }}
                  disabled={episode >= episodes.length}
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ background: "#0f0f0f", border: "1px solid #1f1f1f", opacity: episode >= episodes.length ? 0.3 : 1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                </motion.button>
              </div>

              <motion.button
                onClick={() => setShowEpisodes(!showEpisodes)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-zinc-400"
                style={{ background: "#0f0f0f", border: "1px solid #1f1f1f" }}
                whileHover={{ color: "#fff" }}
                whileTap={{ scale: 0.96 }}
              >
                Episodes
                <motion.div animate={{ rotate: showEpisodes ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.div>
              </motion.button>
            </div>

            <AnimatePresence>
              {showEpisodes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3">
                    {/* Season tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {seasons.map((s) => (
                        <motion.button
                          key={s.season_number}
                          onClick={() => { setSeason(s.season_number); setEpisode(1); }}
                          className="whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[12px] font-medium transition-colors"
                          style={{
                            background: season === s.season_number ? "rgba(124,58,237,0.15)" : "#0f0f0f",
                            border: `1px solid ${season === s.season_number ? "rgba(124,58,237,0.4)" : "#1f1f1f"}`,
                            color: season === s.season_number ? "#c4b5fd" : "#666",
                          }}
                          whileTap={{ scale: 0.96 }}
                        >
                          S{s.season_number}
                        </motion.button>
                      ))}
                    </div>

                    {/* Episode list */}
                    <div className="max-h-44 space-y-1 overflow-y-auto no-scrollbar">
                      {episodes.map((ep) => (
                        <motion.button
                          key={ep.episode_number}
                          onClick={() => setEpisode(ep.episode_number)}
                          className="w-full rounded-xl p-3 text-left transition-all"
                          style={{
                            background: episode === ep.episode_number ? "rgba(124,58,237,0.12)" : "#0a0a0a",
                            border: `1px solid ${episode === ep.episode_number ? "rgba(124,58,237,0.25)" : "#141414"}`,
                          }}
                          whileHover={{ background: "rgba(255,255,255,0.03)" }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-semibold" style={{ color: episode === ep.episode_number ? "#c4b5fd" : "#bbb" }}>
                              <span style={{ fontFamily: "var(--font-mono)", color: "#444", marginRight: 8 }}>
                                {String(ep.episode_number).padStart(2, "0")}
                              </span>
                              {ep.name}
                            </span>
                            {ep.runtime && (
                              <span className="text-[11px] ml-3" style={{ color: "#444", fontFamily: "var(--font-mono)" }}>
                                {ep.runtime}m
                              </span>
                            )}
                          </div>
                          {ep.overview && (
                            <p className="mt-1 line-clamp-1 text-[11px]" style={{ color: "#444" }}>{ep.overview}</p>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
