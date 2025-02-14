import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { useToast } from "@/hooks/use-toast";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImages = async (files: File[]) => {
    try {
      setIsUploading(true);
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          });
          return blob.url;
        })
      );
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: "No se pudieron subir las imágenes",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadImages,
  };
}
