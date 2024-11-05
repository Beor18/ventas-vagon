/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface ImageData {
  downloadUrl: string;
  uploadedAt: string;
  url: string;
}

export default function Component() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [visibleImages, setVisibleImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const imagesPerPage = 12;

  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      setLoading(true);
      const response = await fetch("/api/upload/list", { cache: "no-cache" });
      const data = await response.json();

      const sortedImages = data?.blobs
        .map((blob: any) => ({
          downloadUrl: blob.downloadUrl,
          uploadedAt: blob.uploadedAt,
          url: blob.url,
        }))
        .sort(
          (a: ImageData, b: ImageData) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );

      setImages(sortedImages);
      setVisibleImages(sortedImages.slice(0, imagesPerPage));
    } catch (error) {
      console.error("Failed to fetch images:", error);
      toast({
        title: "Error",
        description: "Failed to fetch images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const nextImages = images.slice(
      nextPage * imagesPerPage,
      (nextPage + 1) * imagesPerPage
    );
    setVisibleImages((prev) => [...prev, ...nextImages]);
    setPage(nextPage);
  };

  const toggleSelectImage = (url: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) return;

    try {
      const urlsToDelete = Array.from(selectedImages);

      const response = await fetch("/api/upload/del", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: urlsToDelete }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete images");
      }

      setSelectedImages(new Set());
      fetchImages();
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: `${urlsToDelete.length} image(s) deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting images:", error);
      toast({
        title: "Error",
        description: "Failed to delete images. Please try again.",
        variant: "destructive",
      });
    }
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Image Gallery</h2>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={selectedImages.size === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({selectedImages.size})
          </Button>
        </div>
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
              <div
                key={index}
                className="relative group rounded-md overflow-hidden"
              >
                <img
                  src={image.downloadUrl}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full aspect-square object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex flex-col gap-4 items-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openModal(image.downloadUrl)}
                      className="mr-2"
                    >
                      <Image className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <div className="flex flex-row gap-2 items-center bg-red-800 p-4 rounded">
                      <p className="text-sm text-white">Eliminar</p>
                      <Checkbox
                        checked={selectedImages.has(image.url)}
                        onCheckedChange={() => toggleSelectImage(image.url)}
                        className="bg-white"
                      />
                    </div>
                  </div>
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
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="w-full mt-4"
          >
            Load More
          </Button>
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
          <p>
            Are you sure you want to delete {selectedImages.size} selected
            image(s)?
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
