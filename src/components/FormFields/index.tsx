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
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
  preview: any;
  handleGallerySelect: (
    image: any,
    optionIndex?: number,
    subOptionIndex?: number
  ) => void;
  galleryImages: any[];
  setProduct?: React.Dispatch<React.SetStateAction<any>>;
  isUploading: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  onChange,
  preview,
  handleGallerySelect,
  galleryImages = [],
  isUploading,
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "gallery">("gallery");
  const [visibleImages, setVisibleImages] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const imagesPerPage = 9;
  useEffect(() => {
    if (galleryImages?.length > 0) {
      setVisibleImages(galleryImages.slice(0, imagesPerPage));
    }
  }, [galleryImages]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const nextImages = galleryImages.slice(
      nextPage * imagesPerPage,
      (nextPage + 1) * imagesPerPage
    );
    setVisibleImages((prev) => [...prev, ...nextImages]);
    setPage(nextPage);
  };

  const handleGalleryImageSelect = (image: any) => {
    console.log("image", image);
    console.log("preview", preview);
    handleGallerySelect(image);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 relative">
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          </div>
        )}
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
                      preview === image?.downloadUrl || preview === image?.url
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleGalleryImageSelect(image)}
                  >
                    <Suspense
                      fallback={<div className="w-full h-auto bg-gray-200" />}
                    >
                      <img
                        src={image?.downloadUrl || image?.url}
                        alt={`Gallery image ${index}`}
                        className="w-full h-auto object-cover aspect-square"
                        loading="lazy"
                      />
                    </Suspense>
                  </div>
                ))}
              </div>
              {visibleImages.length < galleryImages.length && (
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
