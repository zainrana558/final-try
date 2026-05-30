import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { searchMedia } from "@/lib/tmdb/client";

const searchSchema = z.object({
  q: z.string().min(1).max(100),
  page: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const validation = searchSchema.safeParse({
    q: searchParams.get("q"),
    page: searchParams.get("page"),
  });

  if (!validation.success) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const { q: query, page = "1" } = validation.data;

  try {
    const data = await searchMedia(query, page);
    const filtered = {
      ...data,
      results: data.results.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      ),
    };

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
