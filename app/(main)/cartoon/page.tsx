import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";

export default async function CartoonPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  const [tvShows, movies] = await Promise.all([
    getByGenreDiscover("tv", 16, "en"),
    getByGenreDiscover("movie", 16, "en"),
  ]);

  const rows: ContentRow[] = [
    { title: "Popular Cartoons", items: tvShows.results, mediaType: "tv" },
    { title: "Animated Movies", items: movies.results, mediaType: "movie" },
    { title: "More Cartoons", items: tvShows.results.slice(8), mediaType: "tv" },
  ];

  return <GenrePageClient title="Cartoons" accentColor="#4ade80" rows={rows} profileId={profileId} />;
}
