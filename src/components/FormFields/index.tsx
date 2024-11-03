/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
    />
  </div>
);

interface ImageUploadFieldProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: any;
  handleGallerySelect: (url: string) => void;
  setProduct?: React.Dispatch<React.SetStateAction<any>>;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  onChange,
  preview,
  handleGallerySelect,
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "gallery">("gallery");
  const [images, setImages] = useState<string[]>([]);
  const [visibleImages, setVisibleImages] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const imagesPerPage = 9; // Define cuántas imágenes cargar por página

  useEffect(() => {
    async function fetchImages() {
      const response = await fetch("/api/upload/list", { cache: "no-cache" });
      const data = await response.json();

      // Ordenar imágenes por fecha de subida en orden descendente
      const sortedImages = (data?.blobs || []).sort(
        (a: any, b: any) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

      setImages(sortedImages);
      setVisibleImages(sortedImages.slice(0, imagesPerPage));
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

  const handleGalleryImageSelect = (imageUrl: any) => {
    handleGallerySelect(imageUrl);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Label>{label}</Label>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "gallery")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          <TabsContent value="gallery">
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-4 gap-4">
                {visibleImages.map((image: any, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                      preview === image.downloadUrl
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleGalleryImageSelect(image)}
                  >
                    <Suspense
                      fallback={<div className="w-full h-auto bg-gray-200" />}
                    >
                      <img
                        src={image?.downloadUrl}
                        alt={`Gallery image ${index}`}
                        className="w-full h-auto object-cover aspect-square"
                        loading="lazy"
                      />
                    </Suspense>
                  </div>
                ))}
              </div>
              {visibleImages.length < images.length && (
                <button
                  onClick={handleLoadMore}
                  className="w-full mt-4 text-blue-500"
                >
                  Load More
                </button>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
