/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, useEffect } from "react";
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
  setProduct,
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "gallery">("upload");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchImages() {
      const response = await fetch("/api/upload/list", { cache: "no-cache" });
      const data = await response.json();
      setImages(data?.blobs || []);
    }

    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      const nameWithoutExtension = fileName.split(".").slice(0, -1).join(".");
      if (setProduct) {
        setProduct((prev) => ({ ...prev, name: nameWithoutExtension }));
      }
    }
  };

  const handleGalleryImageSelect = (imageUrl: any) => {
    handleGallerySelect(imageUrl);

    let fileName = "";

    if (typeof imageUrl === "string") {
      fileName = imageUrl.split("/").pop() || "";
    } else if (imageUrl && typeof imageUrl.pathname === "string") {
      fileName = imageUrl.pathname;
    } else if (imageUrl && typeof imageUrl.downloadUrl === "string") {
      fileName = imageUrl.downloadUrl.split("/").pop() || "";
    }

    if (fileName && setProduct) {
      const nameWithoutExtension = fileName.split(".").slice(0, -1).join(".");
      setProduct((prev) => ({ ...prev, name: nameWithoutExtension }));
    }
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
            {/* <TabsTrigger value="upload">Upload</TabsTrigger> */}
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          {/* <TabsContent value="upload">
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                ref={inputFileRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => inputFileRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Choose Image
              </Button>
              {preview && (
                <div className="relative h-20 w-20">
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-cover rounded-md w-full h-full"
                  />
                </div>
              )}
            </div>
          </TabsContent> */}
          <TabsContent value="gallery">
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-3 gap-4">
                {images.map((image: any, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                      preview === image
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => handleGalleryImageSelect(image)}
                  >
                    <img
                      src={image?.downloadUrl}
                      alt={`Gallery image ${index}`}
                      className="w-full h-auto object-cover aspect-square"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
