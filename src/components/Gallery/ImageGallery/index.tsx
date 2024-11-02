/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

interface ImageData {
  downloadUrl: string;
  uploadedAt: string;
}

export default function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [visibleImages, setVisibleImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const imagesPerPage = 12;

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        const response = await fetch("/api/upload/list", { cache: "no-cache" });
        const data = await response.json();

        const sortedImages = data?.blobs
          .map((blob: any) => ({
            downloadUrl: blob.downloadUrl,
            uploadedAt: blob.uploadedAt,
          }))
          .sort(
            (a: ImageData, b: ImageData) =>
              new Date(b.uploadedAt).getTime() -
              new Date(a.uploadedAt).getTime()
          );

        setImages(sortedImages);
        setVisibleImages(sortedImages.slice(0, imagesPerPage));
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const nextImages = images.slice(
      nextPage * imagesPerPage,
      (nextPage + 1) * imagesPerPage
    );
    setVisibleImages((prev) => [...prev, ...nextImages]);
    setPage(nextPage);
  };

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

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
        ) : visibleImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {visibleImages.map((image: ImageData, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.downloadUrl}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-md transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openModal(image.downloadUrl)}
                    className="text-white hover:underline flex items-center"
                  >
                    <Image className="mr-2 h-4 w-4" />
                    View Full Size
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No images uploaded yet.
          </p>
        )}

        {visibleImages.length < images.length && (
          <button
            onClick={handleLoadMore}
            className="w-full mt-4 text-blue-500"
          >
            Load More
          </button>
        )}
      </CardContent>

      <Dialog open={!!selectedImage} onOpenChange={closeModal}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size image"
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
