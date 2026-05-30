import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";
import { horrorConfig } from "@/lib/particles/configs";

// LUMINA: Horror page accent color - void purple
const HORROR_ACCENT = "#8B00FF";

export default async function HorrorPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  // TV has no Horror genre ID — 9648 (Mystery/Thriller) is the closest dark TV category
  const [movies, tvShows, moviesPage2] = await Promise.all([
    getByGenreDiscover("movie", 27),
    getByGenreDiscover("tv", 9648),
    getByGenreDiscover("movie", 27, undefined, "2"),
  ]);

  const rows: ContentRow[] = [
    { title: "Horror Movies", items: movies.results, mediaType: "movie" },
    { title: "Dark & Thriller TV", items: tvShows.results, mediaType: "tv" },
    { title: "More Horror Movies", items: moviesPage2.results, mediaType: "movie" },
  ];

  return (
    <div style={{ "--accent": HORROR_ACCENT, background: horrorConfig.background } as React.CSSProperties}>
      <GenrePageClient 
        title="Horror" 
        accentColor={HORROR_ACCENT} 
        rows={rows} 
        profileId={profileId} 
        particleConfig={horrorConfig}
        tagline="Face your fears"
      />
    </div>
  );
}
