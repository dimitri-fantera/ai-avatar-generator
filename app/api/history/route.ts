import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Fetching history, BLOB_READ_WRITE_TOKEN exists:", !!process.env.BLOB_READ_WRITE_TOKEN);

    const { blobs } = await list({ prefix: "avatars/" });

    console.log("Blobs found:", blobs.length);
    console.log("Blob pathnames:", blobs.map(b => b.pathname));

    const pngBlobs = blobs.filter((blob) => blob.pathname.endsWith(".png"));
    const jsonBlobs = blobs.filter((blob) => blob.pathname.endsWith(".json"));

    // Create a map of base filename to JSON metadata URL
    const metadataMap = new Map<string, string>();
    for (const jsonBlob of jsonBlobs) {
      const baseFilename = jsonBlob.pathname.replace(".json", "");
      metadataMap.set(baseFilename, jsonBlob.url);
    }

    // Fetch metadata for each image
    const images = await Promise.all(
      pngBlobs.map(async (blob) => {
        const baseFilename = blob.pathname.replace(".png", "");
        const metadataUrl = metadataMap.get(baseFilename);

        let prompt = "Generated avatar";
        let createdAt: string;

        if (metadataUrl) {
          try {
            const metaRes = await fetch(metadataUrl, { cache: "no-store" });
            if (metaRes.ok) {
              const metadata = await metaRes.json();
              prompt = metadata.prompt || prompt;
              createdAt = metadata.createdAt;
            }
          } catch {
            // Fall back to filename-based prompt
          }
        }

        // Fallback: extract from filename
        if (!createdAt!) {
          const filename = blob.pathname.replace("avatars/", "").replace(".png", "");
          const parts = filename.split("-");
          const timestamp = parts[0];
          createdAt = new Date(parseInt(timestamp)).toISOString();

          if (prompt === "Generated avatar") {
            const promptSlug = parts.slice(1).join("-");
            prompt = promptSlug.replace(/-/g, " ") || "Generated avatar";
          }
        }

        return {
          url: blob.url,
          prompt,
          createdAt,
        };
      })
    );

    images.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
