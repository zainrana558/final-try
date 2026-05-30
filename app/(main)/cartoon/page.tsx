import { cookies } from "next/headers";
import { getByGenreDiscover } from "@/lib/tmdb/client";
import GenrePageClient from "@/components/browse/GenrePageClient";
import type { ContentRow } from "@/types";
import { cartoonConfig } from "@/lib/particles/configs";

// LUMINA: Cartoon page accent color - amber
const CARTOON_ACCENT = "#FFB800";

export default async function CartoonPage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile_id")?.value || null;

  const [tvShows, movies, tvPage2] = await Promise.all([
    getByGenreDiscover("tv", 16, "en"),
    getByGenreDiscover("movie", 16, "en"),
    getByGenreDiscover("tv", 16, "en", "2"),
  ]);

  const rows: ContentRow[] = [
    { title: "Popular Cartoons", items: tvShows.results, mediaType: "tv" },
    { title: "Animated Movies", items: movies.results, mediaType: "movie" },
    { title: "More Cartoons", items: tvPage2.results, mediaType: "tv" },
  ];

  return (
    <div style={{ "--accent": CARTOON_ACCENT, background: cartoonConfig.background } as React.CSSProperties}>
      <GenrePageClient 
        title="Cartoons" 
        accentColor={CARTOON_ACCENT} 
        rows={rows} 
        profileId={profileId} 
        particleConfig={cartoonConfig}
        tagline="Animated adventures for everyone"
      />
    </div>
  );
}
