import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";

export default async function RomancePage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  const [movies, tvShows] = await Promise.all([
    getByGenreDiscover("movie", 10749),
    getByGenreDiscover("tv", 10749),
  ]);

  const rows: ContentRow[] = [
    { title: "Romance Movies", items: movies.results, mediaType: "movie" },
    { title: "Romance TV Shows", items: tvShows.results, mediaType: "tv" },
    { title: "More Romance", items: movies.results.slice(8), mediaType: "movie" },
  ];

  return <GenrePageClient title="Romance" accentColor="#fb7185" rows={rows} profileId={profileId} />;
}
