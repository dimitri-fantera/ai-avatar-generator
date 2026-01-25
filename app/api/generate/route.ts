import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { generateImage } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Google AI API key not configured" },
        { status: 500 }
      );
    }

    const imageBuffer = await generateImage(prompt);

    const timestamp = Date.now();
    const sanitizedPrompt = prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50);
    const filename = `avatars/${timestamp}-${sanitizedPrompt}.png`;

    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      prompt,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image" },
      { status: 500 }
    );
  }
}
