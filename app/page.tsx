"use client";

import { useState, useEffect, useCallback } from "react";
import PromptForm from "@/components/PromptForm";
import Gallery from "@/components/Gallery";
import PasswordGate from "@/components/PasswordGate";

interface HistoryImage {
  url: string;
  prompt: string;
  createdAt: string;
}

export default function Home() {
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

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setCurrentImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
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
        AI Avatar Generator
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Generate unique avatars using Google Gemini AI
      </p>

      <div className="max-w-2xl mx-auto mb-12">
        <PasswordGate>
          <PromptForm onSubmit={handleGenerate} isLoading={isLoading} />
        </PasswordGate>

        {isLoading && (
          <div className="mt-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Generating your avatar...</p>
          </div>
        )}

        {currentImage && !isLoading && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Generated Avatar
            </h2>
            <img
              src={currentImage.url}
              alt={currentImage.prompt}
              className="w-full max-w-md mx-auto rounded-lg"
            />
            <p className="mt-2 text-sm text-gray-500 text-center">
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
