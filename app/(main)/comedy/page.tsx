import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";

export default async function ComedyPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  const [movies, tvShows] = await Promise.all([
    getByGenreDiscover("movie", 35),
    getByGenreDiscover("tv", 35),
  ]);

  const rows: ContentRow[] = [
    { title: "Comedy Movies", items: movies.results, mediaType: "movie" },
    { title: "Comedy Shows", items: tvShows.results, mediaType: "tv" },
    { title: "More Comedy", items: movies.results.slice(8), mediaType: "movie" },
  ];

  return <GenrePageClient title="Comedy" accentColor="#facc15" rows={rows} profileId={profileId} />;
}
