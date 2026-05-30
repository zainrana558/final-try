import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";

export default async function AnimePage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  const [popular, topRated] = await Promise.all([
    getByGenreDiscover("tv", 16, "ja"),
    getByGenreDiscover("movie", 16, "ja"),
  ]);

  const rows: ContentRow[] = [
    { title: "Popular Anime", items: popular.results.slice(0, 10), mediaType: "tv" },
    { title: "Anime Movies", items: topRated.results, mediaType: "movie" },
    { title: "More Anime", items: popular.results.slice(10), mediaType: "tv" },
  ];

  return (
    <GenrePageClient
      title="Anime"
      accentColor="#f472b6"
      rows={rows}
      profileId={profileId}
    />
  );
}
