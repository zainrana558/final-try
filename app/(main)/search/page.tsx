"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import MediaCard from "@/components/browse/MediaCard";
import DetailModal from "@/components/modals/DetailModal";
import VideoPlayer from "@/components/modals/VideoPlayer";
import type { MediaItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setPage(1); setTotalPages(1); return; }
    const timeout = setTimeout(async () => {
      setLoading(true); setPage(1);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=1`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setTotalPages(data.total_pages ?? 1);
        }
      } catch {}
      setLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  async function handleLoadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${nextPage}`);
      if (res.ok) {
        const data = await res.json();
        setResults((prev) => [...prev, ...(data.results || [])]);
        setPage(nextPage);
        setTotalPages(data.total_pages ?? totalPages);
      }
    } catch {}
    setLoadingMore(false);
  }

  function getCookieProfileId() {
    const match = document.cookie.match(/profile_id=([^;]+)/);
    return match ? match[1] : null;
  }

  return (
    <div className="min-h-screen px-4 pt-6 pb-16 md:px-8" style={{ background: "#050505" }}>
      {/* Search input */}
      <div className="mx-auto max-w-lg mb-8">
        <div
          className="relative flex items-center rounded-2xl overflow-hidden transition-all duration-200"
          style={{ background: "#0a0a0a", border: "1px solid #1f1f1f" }}
        >
          <Search className="absolute left-4 h-4 w-4 flex-shrink-0" style={{ color: "#444" }} />
          <input
            type="text"
            placeholder="Search movies, TV shows…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent py-3.5 pl-11 pr-4 text-[14px] text-white outline-none placeholder:text-zinc-700"
          />
          {loading && (
            <Loader2 className="absolute right-4 h-4 w-4 animate-spin" style={{ color: "#555" }} />
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="skeleton-shimmer rounded-xl"
                style={{ aspectRatio: "2/3", animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Result count */}
            <div className="mb-4 flex items-center gap-2">
              <div className="h-3.5 w-[2px] rounded-full" style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
              <p className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "#555" }}>
                {results.length} results
                {query && <span style={{ color: "#444" }}> for &ldquo;{query}&rdquo;</span>}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
              {results.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.3 }}
                >
                  <MediaCard item={item} onClick={setSelectedItem} />
                </motion.div>
              ))}
            </div>

            {page < totalPages && (
              <div className="mt-10 flex justify-center">
                <motion.button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-[13px] font-semibold text-white transition-all"
                  style={{
                    background: loadingMore ? "#111" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                    border: loadingMore ? "1px solid #1f1f1f" : "none",
                    boxShadow: loadingMore ? "none" : "0 4px 20px rgba(124,58,237,0.3)",
                  }}
                  whileHover={!loadingMore ? { boxShadow: "0 6px 28px rgba(124,58,237,0.5)" } : {}}
                  whileTap={{ scale: 0.97 }}
                >
                  {loadingMore ? (
                    <><Loader2 className="h-4 w-4 animate-spin" style={{ color: "#555" }} /><span style={{ color: "#555" }}>Loading…</span></>
                  ) : "Load More"}
                </motion.button>
              </div>
            )}
          </motion.div>
        ) : query.trim() ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center"
          >
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-white font-semibold mb-2">No results found</p>
            <p className="text-[13px]" style={{ color: "#555" }}>
              Nothing matched &ldquo;{query}&rdquo; — try a different search.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center"
          >
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-white font-semibold mb-2">Find your next watch</p>
            <p className="text-[13px]" style={{ color: "#555" }}>Search movies, TV shows, and anime above.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedItem && (
        <DetailModal
          mediaId={selectedItem.id}
          mediaType={(selectedItem.media_type || "movie") as "movie" | "tv"}
          onClose={() => setSelectedItem(null)}
          onPlay={(item) => { setSelectedItem(null); setPlayingItem(item); }}
          profileId={getCookieProfileId()}
        />
      )}
      {playingItem && (
        <VideoPlayer item={playingItem} onClose={() => setPlayingItem(null)} profileId={getCookieProfileId()} />
      )}
    </div>
  );
}
