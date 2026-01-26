"use client";

import { useState, useEffect, useCallback } from "react";
import Gallery from "@/components/Gallery";

interface HistoryImage {
  url: string;
  prompt: string;
  createdAt: string;
}

export default function PromptPage() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<HistoryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<HistoryImage | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setCurrentImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate image");
      }

      const data = await res.json();
      setCurrentImage(data);
      await fetchHistory();
    } catch (error) {
      console.error("Generation failed:", error);
      alert(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
        Simple Prompt
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Enter any prompt to generate an image with Gemini AI
      </p>

      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Generating..." : "Generate Image"}
          </button>
        </form>

        {isLoading && (
          <div className="mt-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Generating your image...</p>
          </div>
        )}

        {currentImage && !isLoading && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Generated Image
            </h2>
            <img
              src={currentImage.url}
              alt={currentImage.prompt}
              className="w-full max-w-md mx-auto rounded-lg"
            />
            <p className="mt-2 text-sm text-gray-500 text-center truncate">
              &quot;{currentImage.prompt}&quot;
            </p>
          </div>
        )}
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Generation History
        </h2>
        <Gallery images={history} />
      </div>
    </main>
  );
}
