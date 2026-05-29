import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";

export default async function ActionPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  const [movies, tvShows] = await Promise.all([
    getByGenreDiscover("movie", 28),
    getByGenreDiscover("tv", 28),
  ]);

  const rows: ContentRow[] = [
    { title: "Action Movies", items: movies.results, mediaType: "movie" },
    { title: "Action TV Shows", items: tvShows.results, mediaType: "tv" },
    { title: "More Action", items: movies.results.slice(8), mediaType: "movie" },
  ];

  return <GenrePageClient title="Action" accentColor="#f97316" rows={rows} profileId={profileId} />;
}
