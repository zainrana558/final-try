"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import MediaCard from "@/components/browse/MediaCard";
import DetailModal from "@/components/modals/DetailModal";
import VideoPlayer from "@/components/modals/VideoPlayer";
import type { MediaItem } from "@/types";

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
    if (!query.trim()) {
      setResults([]);
      setPage(1);
      setTotalPages(1);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      setPage(1);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=1`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setTotalPages(data.total_pages ?? 1);
        }
      } catch {
        // network error
      }
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
    } catch {
      // network error
    }
    setLoadingMore(false);
  }

  function getCookieProfileId() {
    const match = document.cookie.match(/profile_id=([^;]+)/);
    return match ? match[1] : null;
  }

  return (
    <div className="px-4 pt-4 md:px-8">
      {/* Search Input */}
      <div className="relative mx-auto max-w-xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "#5a544a" }} />
        <input
          type="text"
          placeholder="Search movies, TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl py-3 pl-12 pr-4 text-base outline-none transition-all"
          style={{
            background: "rgba(245,240,235,0.04)",
            border: "1px solid #2a2520",
            color: "#f5f0eb",
          }}
          autoFocus
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2"
              style={{ borderColor: "#d4a853", borderTopColor: "transparent" }}
            />
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
              {results.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onClick={setSelectedItem}
                />
              ))}
            </div>

            {page < totalPages && (
              <div className="mt-8 flex justify-center pb-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-xl px-6 py-3 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  style={{
                    border: "1px solid #2a2520",
                    color: "#9c948a",
                    background: "transparent",
                  }}
                >
                  {loadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin inline" />
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        ) : query.trim() ? (
          <div className="py-12 text-center">
            <p style={{ color: "#5a544a" }}>
              No results found for &ldquo;{query}&rdquo;
            </p>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p style={{ color: "#5a544a" }}>
              Start typing to search for movies and TV shows
            </p>
          </div>
        )}
      </div>

      {selectedItem && (
        <DetailModal
          mediaId={selectedItem.id}
          mediaType={(selectedItem.media_type || "movie") as "movie" | "tv"}
          onClose={() => setSelectedItem(null)}
          onPlay={(item) => {
            setSelectedItem(null);
            setPlayingItem(item);
          }}
          profileId={getCookieProfileId()}
        />
      )}

      {playingItem && (
        <VideoPlayer
          item={playingItem}
          onClose={() => setPlayingItem(null)}
          profileId={getCookieProfileId()}
        />
      )}
    </div>
  );
}
