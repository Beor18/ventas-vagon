/* eslint-disable @next/next/no-img-element */
import React, {
  useRef,
  useState,
  useEffect,
  Suspense,
  useCallback,
} from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import GalleryModal from "@/components/GalleryModal/index";

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}

export const InputField = React.memo(
  ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
  }: InputFieldProps) => (
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
  )
);

InputField.displayName = "InputField";

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
  loadGalleryImages: () => Promise<void>;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  onChange,
  preview,
  handleGallerySelect,
  galleryImages = [],
  isUploading,
  loadGalleryImages,
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [localPreview, setLocalPreview] = useState(preview);

  useEffect(() => {
    setLocalPreview(preview);
  }, [preview]);

  const handleGallerySelection = useCallback(
    (image: any) => {
      const imageUrl = image?.downloadUrl || image?.url;
      setLocalPreview(imageUrl);
      handleGallerySelect(image);
      setShowGallery(false);
    },
    [handleGallerySelect]
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        {localPreview ? (
          <div className="relative aspect-video w-96 overflow-hidden rounded-lg border">
            <img
              src={localPreview}
              alt={label}
              className="h-full w-full object-cover"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-2 right-2"
              onClick={() => setShowGallery(true)}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Cambiar Imagen
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full h-32"
            onClick={() => setShowGallery(true)}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Seleccionar Imagen
          </Button>
        )}
      </div>

      {showGallery && (
        <GalleryModal
          open={showGallery}
          onClose={() => setShowGallery(false)}
          onSelect={handleGallerySelection}
          images={galleryImages}
          isLoading={isUploading}
          onOpen={loadGalleryImages}
        />
      )}
    </div>
  );
};
