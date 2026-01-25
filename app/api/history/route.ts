import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "avatars/" });

    const images = blobs
      .filter((blob) => blob.pathname.endsWith(".png"))
      .map((blob) => {
        const filename = blob.pathname.replace("avatars/", "").replace(".png", "");
        const parts = filename.split("-");
        const timestamp = parts[0];
        const promptSlug = parts.slice(1).join("-");
        const prompt = promptSlug.replace(/-/g, " ");

        return {
          url: blob.url,
          prompt: prompt || "Generated avatar",
          createdAt: new Date(parseInt(timestamp)).toISOString(),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ images });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ images: [] });
  }
}
