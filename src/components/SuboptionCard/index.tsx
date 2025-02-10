import React, { useCallback } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { InputField, ImageUploadField } from "@/components/FormFields";
import { ProductType, SubOptionType } from "@/types/types";
import SuboptionField from "../SuboptionField";

interface SuboptionCardProps {
  suboption: SubOptionType;
  optionIndex: number;
  subOptionIndex: number;
  handleSubOptionChange: (
    optionIndex: number,
    subOptionIndex: number,
    field: string,
    value: string | number
  ) => void;
  removeSubOption: (optionIndex: number, subOptionIndex: number) => void;
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
  setProduct: (product: ProductType) => void;
  product: ProductType;
  handleGallerySelect: (
    image: any,
    optionIndex: number,
    subOptionIndex?: number
  ) => void;
  galleryImages: any[];
  isUploading: boolean;
  loadGalleryImages: () => Promise<void>;
}

const SuboptionCard: React.FC<SuboptionCardProps> = ({
  suboption,
  optionIndex,
  subOptionIndex,
  handleSubOptionChange,
  removeSubOption,
  handleImagePreview,
  setProduct,
  product,
  handleGallerySelect,
  galleryImages,
  isUploading,
  loadGalleryImages,
}) => {
  const handleFieldChange = useCallback(
    (name: string, value: string | number) => {
      handleSubOptionChange(optionIndex, subOptionIndex, name, value);
    },
    [handleSubOptionChange, optionIndex, subOptionIndex]
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleImagePreview(
        e,
        (url: string) => {
          const updatedOptions = [...product.options];
          updatedOptions[optionIndex].suboptions[subOptionIndex] = {
            ...updatedOptions[optionIndex].suboptions[subOptionIndex],
            imageUrl: url,
          };
          setProduct({
            ...product,
            options: updatedOptions,
          });
        },
        (previewUrl: string) => {
          const updatedOptions = [...product.options];
          updatedOptions[optionIndex].suboptions[subOptionIndex] = {
            ...updatedOptions[optionIndex].suboptions[subOptionIndex],
            imageUrl: previewUrl,
          };
          setProduct({
            ...product,
            options: updatedOptions,
          });
        }
      );
    },
    [handleImagePreview, optionIndex, subOptionIndex, product, setProduct]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-base">
          <span>Suboption {subOptionIndex + 1}</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeSubOption(optionIndex, subOptionIndex)}
          >
            <Minus className="mr-2 h-4 w-4" /> Remove
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <SuboptionField
            label="Suboption Name"
            name="name"
            value={suboption.name}
            onChange={handleFieldChange}
            placeholder="Enter suboption name"
          />
          <SuboptionField
            label="Suboption Price"
            name="price"
            value={suboption.price}
            onChange={handleFieldChange}
            placeholder="Enter suboption price"
            type="number"
          />
          <ImageUploadField
            label="Suboption Image"
            onChange={handleImageChange}
            preview={suboption.imageUrl}
            handleGallerySelect={(image) =>
              handleGallerySelect(image, optionIndex, subOptionIndex)
            }
            galleryImages={galleryImages}
            isUploading={isUploading}
            loadGalleryImages={loadGalleryImages}
          />
          <SuboptionField
            label="Suboption Code"
            name="code"
            value={suboption.code}
            onChange={handleFieldChange}
            placeholder="Enter suboption code"
          />
          <SuboptionField
            label="Details"
            name="details"
            value={suboption.details}
            onChange={handleFieldChange}
            placeholder="Enter details"
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Optimizamos con memo y una función de comparación personalizada
export default React.memo(SuboptionCard, (prevProps, nextProps) => {
  return (
    prevProps.suboption === nextProps.suboption &&
    prevProps.optionIndex === nextProps.optionIndex &&
    prevProps.subOptionIndex === nextProps.subOptionIndex &&
    prevProps.isUploading === nextProps.isUploading
  );
});
