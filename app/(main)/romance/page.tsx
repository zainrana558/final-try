import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";
import { romanceConfig } from "@/lib/particles/configs";

// LUMINA: Romance page accent color - rose
const ROMANCE_ACCENT = "#FF4D8B";

export default async function RomancePage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  // Movie genre 10749 = Romance ✓
  // TV has no Romance genre — 10766 (Soap Opera) is the closest equivalent on TV
  const [movies, tvShows, moviesPage2] = await Promise.all([
    getByGenreDiscover("movie", 10749),
    getByGenreDiscover("tv", 10766),
    getByGenreDiscover("movie", 10749, undefined, "2"),
  ]);

  const rows: ContentRow[] = [
    { title: "Romance Movies", items: movies.results, mediaType: "movie" },
    { title: "Romance TV Shows", items: tvShows.results, mediaType: "tv" },
    { title: "More Romance Movies", items: moviesPage2.results, mediaType: "movie" },
  ];

  return (
    <div style={{ "--accent": ROMANCE_ACCENT, background: romanceConfig.background } as React.CSSProperties}>
      <GenrePageClient 
        title="Romance" 
        accentColor={ROMANCE_ACCENT} 
        rows={rows} 
        profileId={profileId} 
        particleConfig={romanceConfig}
        tagline="Love stories that touch the heart"
      />
    </div>
  );
}
