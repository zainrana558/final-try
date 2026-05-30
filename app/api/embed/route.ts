import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAllEmbedUrls } from "@/lib/streaming/providers";

const embedSchema = z.object({
  tmdb: z.string().min(1).max(10).regex(/^\d+$/),
  type: z.enum(["movie", "tv"]),
  season: z.string().optional(),
  episode: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const validation = embedSchema.safeParse({
    tmdb: searchParams.get("tmdb"),
    type: searchParams.get("type"),
    season: searchParams.get("season"),
    episode: searchParams.get("episode"),
  });

  if (!validation.success) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const { tmdb, type, season, episode } = validation.data;

  try {
    const providers = getAllEmbedUrls(
      type,
      parseInt(tmdb),
      season ? parseInt(season) : undefined,
      episode ? parseInt(episode) : undefined
    );

    return NextResponse.json({ providers, url: providers[0]?.url ?? null });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get embed URLs" }, { status: 500 });
  }
}
