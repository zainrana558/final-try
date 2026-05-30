import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";
import { comedyConfig } from "@/lib/particles/configs";

// LUMINA: Comedy page accent color - warm orange
const COMEDY_ACCENT = "#FF8C00";

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

  return (
    <div style={{ "--accent": COMEDY_ACCENT, background: comedyConfig.background } as React.CSSProperties}>
      <GenrePageClient 
        title="Comedy" 
        accentColor={COMEDY_ACCENT} 
        rows={rows} 
        profileId={profileId} 
        particleConfig={comedyConfig}
        tagline="Laugh until it hurts"
      />
    </div>
  );
}
