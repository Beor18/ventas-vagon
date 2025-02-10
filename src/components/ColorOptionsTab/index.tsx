/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ProductType, ColorOptionType } from "@/types/types";
import { ImageUploadField } from "@/components/FormFields";

interface ColorOptionsTabProps {
  product: ProductType;
  setProduct: (product: ProductType) => void;
  newColorOption: ColorOptionType;
  setNewColorOption: (colorOption: ColorOptionType) => void;
  handleNewColorOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addColorOption: () => void;
  removeColorOption: (colorOptionIndex: number) => void;
  editColorOption: (index: number, updatedColorOption: ColorOptionType) => void;
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
  galleryImages: any[];
  loadGalleryImages: () => Promise<void>;
  isUploading: boolean;
}

const ColorOptionsTab: React.FC<ColorOptionsTabProps> = ({
  product,
  setProduct,
  newColorOption,
  setNewColorOption,
  handleNewColorOptionChange,
  addColorOption,
  removeColorOption,
  editColorOption,
  handleImagePreview,
  galleryImages,
  loadGalleryImages,
  isUploading,
}) => {
  useEffect(() => {
    loadGalleryImages();
  }, []);

  const handleGallerySelect = (url: any, index: number) => {
    const downloadUrl =
      typeof url === "object" && url.downloadUrl ? url.downloadUrl : url;

    let fileName =
      typeof downloadUrl === "string"
        ? decodeURIComponent(downloadUrl.split("/").pop() || "")
        : "";

    let nameWithoutExtension = fileName
      .substring(0, fileName.lastIndexOf("."))
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .split(" ")
      .slice(0, 3)
      .join(" ");

    const updatedColorOption = {
      ...product.colorOptions[index],
      imageUrl: downloadUrl,
      colorName: nameWithoutExtension || product.colorOptions[index].colorName,
      colorCode: nameWithoutExtension || product.colorOptions[index].colorCode,
    };

    editColorOption(index, updatedColorOption);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Frame Color</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {product.colorOptions &&
          product.colorOptions.map((colorOption, index) => (
            <Card key={index}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{colorOption.colorName}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeColorOption(index)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Color Name</Label>
                    <Input
                      value={colorOption.colorName}
                      name="colorName"
                      onChange={(e) => {
                        handleNewColorOptionChange(e);
                        editColorOption(index, {
                          ...colorOption,
                          colorName: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label>Color Code</Label>
                    <Input
                      value={colorOption.colorCode}
                      name="colorCode"
                      onChange={(e) => {
                        handleNewColorOptionChange(e);
                        editColorOption(index, {
                          ...colorOption,
                          colorCode: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label>Additional Price</Label>
                    <Input
                      type="number"
                      value={colorOption.additionalPrice}
                      name="additionalPrice"
                      onChange={(e) => {
                        handleNewColorOptionChange(e);
                        editColorOption(index, {
                          ...colorOption,
                          additionalPrice: parseFloat(e.target.value),
                        });
                      }}
                    />
                  </div>
                </div>
                {colorOption.imageUrl && (
                  <img
                    src={colorOption.imageUrl}
                    alt={colorOption.colorName}
                    className="w-full h-32 object-cover border rounded-md"
                  />
                )}

                <div>
                  <Label htmlFor={`colorImage-${index}`}>Color Image</Label>
                  <ImageUploadField
                    label="Select Color Image"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleImagePreview(
                        e,
                        (url) =>
                          editColorOption(index, {
                            ...colorOption,
                            imageUrl: url,
                          }),
                        () => {}
                      )
                    }
                    preview={colorOption.imageUrl}
                    handleGallerySelect={(url) =>
                      handleGallerySelect(url, index)
                    }
                    setProduct={setProduct}
                    galleryImages={galleryImages}
                    isUploading={isUploading}
                    loadGalleryImages={loadGalleryImages}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <Button onClick={addColorOption} className="w-full mt-2">
            Add Color Option
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorOptionsTab;
