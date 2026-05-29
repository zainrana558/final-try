import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";

export default async function SciFiPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  const [movies, tvShows] = await Promise.all([
    getByGenreDiscover("movie", 878),
    getByGenreDiscover("tv", 878),
  ]);

  const rows: ContentRow[] = [
    { title: "Sci-Fi Movies", items: movies.results, mediaType: "movie" },
    { title: "Sci-Fi TV Shows", items: tvShows.results, mediaType: "tv" },
    { title: "More Sci-Fi", items: movies.results.slice(8), mediaType: "movie" },
  ];

  return <GenrePageClient title="Sci-Fi" accentColor="#38bdf8" rows={rows} profileId={profileId} />;
}
