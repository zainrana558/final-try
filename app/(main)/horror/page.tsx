import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";

export default async function HorrorPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  const [movies, tvShows] = await Promise.all([
    getByGenreDiscover("movie", 27),
    getByGenreDiscover("tv", 27),
  ]);

  const rows: ContentRow[] = [
    { title: "Horror Movies", items: movies.results, mediaType: "movie" },
    { title: "Horror TV Shows", items: tvShows.results, mediaType: "tv" },
    { title: "More Horror", items: movies.results.slice(8), mediaType: "movie" },
  ];

  return <GenrePageClient title="Horror" accentColor="#ef4444" rows={rows} profileId={profileId} />;
}
