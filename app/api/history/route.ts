import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Fetching history, BLOB_READ_WRITE_TOKEN exists:", !!process.env.BLOB_READ_WRITE_TOKEN);

    const { blobs } = await list({ prefix: "avatars/" });

    console.log("Blobs found:", blobs.length);
    console.log("Blob pathnames:", blobs.map(b => b.pathname));

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

    console.log("Returning images:", images.length);
    return NextResponse.json({ images }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({
      images: [],
      error: error instanceof Error ? error.message : "Unknown error",
      tokenExists: !!process.env.BLOB_READ_WRITE_TOKEN
    });
  }
}
