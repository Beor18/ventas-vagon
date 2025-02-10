import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (image: any) => void;
  images: any[];
  isLoading: boolean;
  onOpen?: () => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  open,
  onClose,
  onSelect,
  images,
  isLoading,
  onOpen,
}) => {
  useEffect(() => {
    if (open && onOpen) {
      onOpen();
    }
  }, [open, onOpen]);

  console.log("GalleryModal images:", images); // Debug

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Seleccionar Imagen</DialogTitle>
        </DialogHeader>
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
            </div>
          ) : images?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {images.map((image, index) => {
                console.log("Image in map:", image); // Debug
                return (
                  <div
                    key={image.url || image.downloadUrl || index}
                    className="relative aspect-square cursor-pointer group hover:opacity-90"
                    onClick={() => {
                      onSelect(image);
                      onClose();
                    }}
                  >
                    <img
                      src={image.url || image.downloadUrl}
                      alt={`Gallery ${index}`}
                      className="object-cover w-full h-full rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm">
                        <Image className="h-4 w-4 mr-2" />
                        Seleccionar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay imágenes disponibles
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
