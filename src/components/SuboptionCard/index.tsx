import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { InputField, ImageUploadField } from "@/components/FormFields";
import { ProductType, OptionType, SubOptionType } from "@/types/types";

interface SuboptionCardProps {
  suboption: SubOptionType;
  optionIndex: number;
  subOptionIndex: number;
  handleSubOptionChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number,
    subOptionIndex: number
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
}) => (
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
        <InputField
          label="Suboption Name"
          name="name"
          value={suboption.name}
          onChange={(e) =>
            handleSubOptionChange(e, optionIndex, subOptionIndex)
          }
          placeholder="Enter suboption name"
        />
        <InputField
          label="Suboption Price"
          name="price"
          type="number"
          value={suboption.price}
          onChange={(e) =>
            handleSubOptionChange(e, optionIndex, subOptionIndex)
          }
          placeholder="Enter suboption price"
        />
        <ImageUploadField
          label="Suboption Image"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
              (url: string) => {
                const updatedOptions = [...product.options];
                updatedOptions[optionIndex].suboptions[
                  subOptionIndex
                ].imageUrl = url;
                setProduct({
                  ...product,
                  options: updatedOptions,
                });
              }
            )
          }
          preview={suboption.imageUrl}
          handleGallerySelect={(image) =>
            handleGallerySelect(image, optionIndex, subOptionIndex)
          }
          galleryImages={galleryImages}
          isUploading={isUploading}
        />
        <InputField
          label="Suboption Code"
          name="code"
          value={suboption.code}
          onChange={(e) =>
            handleSubOptionChange(e, optionIndex, subOptionIndex)
          }
          placeholder="Enter suboption code"
        />
        <InputField
          label="Details"
          name="details"
          value={suboption.details}
          onChange={(e) =>
            handleSubOptionChange(e, optionIndex, subOptionIndex)
          }
          placeholder="Enter details"
        />
      </div>
    </CardContent>
  </Card>
);

export default SuboptionCard;
