import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";
import { animeConfig } from "@/lib/particles/configs";

// LUMINA: Anime page accent color - sakura pink
const ANIME_ACCENT = "#FF6B9D";

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
    <div style={{ "--accent": ANIME_ACCENT, background: animeConfig.background } as React.CSSProperties}>
      <GenrePageClient
        title="Anime"
        accentColor={ANIME_ACCENT}
        rows={rows}
        profileId={profileId}
        particleConfig={animeConfig}
        tagline="Japanese animation at its finest"
      />
    </div>
  );
}
