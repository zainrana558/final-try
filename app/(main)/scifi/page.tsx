import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";
import { scifiConfig } from "@/lib/particles/configs";

// LUMINA: Sci-Fi page accent color - electric cyan
const SCIFI_ACCENT = "#00D4FF";

export default async function SciFiPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  // Movie genre 878 = Science Fiction ✓
  // TV genre 10765 = Sci-Fi & Fantasy (correct TV ID — 878 does not exist for TV)
  const [movies, tvShows, moviesPage2] = await Promise.all([
    getByGenreDiscover("movie", 878),
    getByGenreDiscover("tv", 10765),
    getByGenreDiscover("movie", 878, undefined, "2"),
  ]);

  const rows: ContentRow[] = [
    { title: "Sci-Fi Movies", items: movies.results, mediaType: "movie" },
    { title: "Sci-Fi & Fantasy TV", items: tvShows.results, mediaType: "tv" },
    { title: "More Sci-Fi Movies", items: moviesPage2.results, mediaType: "movie" },
  ];

  return (
    <div style={{ "--accent": SCIFI_ACCENT, background: scifiConfig.background } as React.CSSProperties}>
      <GenrePageClient 
        title="Sci-Fi" 
        accentColor={SCIFI_ACCENT} 
        rows={rows} 
        profileId={profileId} 
        particleConfig={scifiConfig}
        tagline="Explore the future"
      />
    </div>
  );
}
