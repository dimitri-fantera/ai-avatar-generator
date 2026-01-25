import ImageCard from "./ImageCard";

interface HistoryImage {
  url: string;
  prompt: string;
  createdAt: string;
}

interface GalleryProps {
  images: HistoryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No avatars generated yet.</p>
        <p className="text-sm mt-1">Generate your first avatar above!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {images.map((image, index) => (
        <ImageCard
          key={`${image.url}-${index}`}
          url={image.url}
          prompt={image.prompt}
          createdAt={image.createdAt}
        />
      ))}
    </div>
  );
}
