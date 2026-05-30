import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";

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

  return <GenrePageClient title="Romance" accentColor="#fb7185" rows={rows} profileId={profileId} />;
}
