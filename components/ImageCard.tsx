interface ImageCardProps {
  url: string;
  prompt: string;
  createdAt: string;
}

export default function ImageCard({ url, prompt, createdAt }: ImageCardProps) {
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
        <p className="text-sm text-gray-700 line-clamp-2" title={prompt}>
          {prompt}
        </p>
        <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
      </div>
    </div>
  );
}
