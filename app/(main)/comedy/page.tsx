import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";

export default async function ComedyPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  // TV genre 35 = Comedy — same ID works for both movie and TV ✓
  const [movies, tvShows, moviesPage2] = await Promise.all([
    getByGenreDiscover("movie", 35),
    getByGenreDiscover("tv", 35),
    getByGenreDiscover("movie", 35, undefined, "2"),
  ]);

  const rows: ContentRow[] = [
    { title: "Comedy Movies", items: movies.results, mediaType: "movie" },
    { title: "Comedy Shows", items: tvShows.results, mediaType: "tv" },
    { title: "More Comedy Movies", items: moviesPage2.results, mediaType: "movie" },
  ];

  return <GenrePageClient title="Comedy" accentColor="#facc15" rows={rows} profileId={profileId} />;
}
