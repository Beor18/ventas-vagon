/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "lucide-react";

interface ImageData {
  downloadUrl: string;
}

export default function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        const response = await fetch("/api/upload/list", { cache: "no-cache" });
        const data = await response.json();
        const urls = data?.blobs.map((blob: any) => ({ downloadUrl: blob }));
        setImages(urls);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  return (
    <Card className="w-full max-w-full mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <Skeleton
                key={index}
                className="w-full aspect-square rounded-md"
              />
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {images.map((image: any, index) => (
              <div key={index} className="relative group">
                <img
                  src={image?.downloadUrl?.downloadUrl}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-md transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a
                    href={image?.downloadUrl?.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline flex items-center"
                  >
                    <Image className="mr-2 h-4 w-4" />
                    View Full Size
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No images uploaded yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
