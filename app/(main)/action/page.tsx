import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";
import { actionConfig } from "@/lib/particles/configs";

// LUMINA: Action page accent color - red
const ACTION_ACCENT = "#E50914";

export default async function ActionPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  // Movie genre 28 = Action, TV genre 10759 = Action & Adventure (correct TV ID)
  const [movies, tvShows, moviesPage2] = await Promise.all([
    getByGenreDiscover("movie", 28),
    getByGenreDiscover("tv", 10759),
    getByGenreDiscover("movie", 28, undefined, "2"),
  ]);

  const rows: ContentRow[] = [
    { title: "Action Movies", items: movies.results, mediaType: "movie" },
    { title: "Action & Adventure TV", items: tvShows.results, mediaType: "tv" },
    { title: "More Action Movies", items: moviesPage2.results, mediaType: "movie" },
  ];

  return (
    <div style={{ "--accent": ACTION_ACCENT, background: actionConfig.background } as React.CSSProperties}>
      <GenrePageClient 
        title="Action" 
        accentColor={ACTION_ACCENT} 
        rows={rows} 
        profileId={profileId} 
        particleConfig={actionConfig}
        tagline="High-octane thrills"
      />
    </div>
  );
}
