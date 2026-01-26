"use client";

import { useState } from "react";

interface ImageCardProps {
  url: string;
  prompt: string;
  createdAt: string;
}

export default function ImageCard({ url, prompt, createdAt }: ImageCardProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-square relative cursor-pointer"
      >
        <img
          src={url}
          alt={prompt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </a>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-400">{formattedDate}</p>
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {showPrompt ? "Hide" : "See prompt"}
          </button>
        </div>
        {showPrompt && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 max-h-40 overflow-y-auto whitespace-pre-wrap break-words">
            {prompt}
          </div>
        )}
      </div>
    </div>
  );
}
