import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";

export default async function SciFiPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  // Movie genre 878 = Science Fiction ✓
  // TV genre 10765 = Sci-Fi & Fantasy (correct TV ID — 878 does not exist for TV)
  const [movies, tvShows, moviesPage2] = await Promise.all([
    getByGenreDiscover("movie", 878),
    getByGenreDiscover("tv", 10765),
    getByGenreDiscover("movie", 878, undefined, "2"),
  ]);

  const rows: ContentRow[] = [
    { title: "Sci-Fi Movies", items: movies.results, mediaType: "movie" },
    { title: "Sci-Fi & Fantasy TV", items: tvShows.results, mediaType: "tv" },
    { title: "More Sci-Fi Movies", items: moviesPage2.results, mediaType: "movie" },
  ];

  return <GenrePageClient title="Sci-Fi" accentColor="#38bdf8" rows={rows} profileId={profileId} />;
}
