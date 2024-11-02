/* eslint-disable @next/next/no-img-element */
import React from "react";
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
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
}

const ColorOptionsTab: React.FC<ColorOptionsTabProps> = ({
  product,
  setProduct,
  newColorOption,
  setNewColorOption,
  handleNewColorOptionChange,
  addColorOption,
  removeColorOption,
  handleImagePreview,
}) => {
  const handleGallerySelect = (url: any) => {
    const downloadUrl =
      typeof url === "object" && url.downloadUrl ? url.downloadUrl : url;

    // Procesa el nombre de la imagen para usarlo como `Color Name`
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

    // Actualiza la nueva opción de color con la imagen seleccionada y el nombre procesado
    setNewColorOption({
      ...newColorOption,
      imageUrl: downloadUrl,
      colorName: nameWithoutExtension || newColorOption.colorName,
      colorCode: nameWithoutExtension || newColorOption.colorCode,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Add New Color Option</h3>
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
                  <Label>Color Code</Label>
                  <Input value={colorOption.colorCode} readOnly />
                </div>
                <div>
                  <Label>Additional Price</Label>
                  <Input value={colorOption.additionalPrice} readOnly />
                </div>
              </div>
              {colorOption.imageUrl && (
                <img
                  src={colorOption.imageUrl}
                  alt={colorOption.colorName}
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
            </CardContent>
          </Card>
        ))}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="colorName">Color Name</Label>
              <Input
                id="colorName"
                name="colorName"
                value={newColorOption.colorName}
                onChange={handleNewColorOptionChange}
              />
            </div>
            <div>
              <Label htmlFor="colorCode">Color Code</Label>
              <Input
                id="colorCode"
                name="colorCode"
                value={newColorOption.colorCode}
                onChange={handleNewColorOptionChange}
              />
            </div>
            <div>
              <Label htmlFor="additionalPrice">Additional Price</Label>
              <Input
                id="additionalPrice"
                name="additionalPrice"
                type="number"
                value={newColorOption.additionalPrice}
                onChange={handleNewColorOptionChange}
              />
            </div>
            <div>
              <Label htmlFor="colorImage">Color Image</Label>
              <ImageUploadField
                label="Select Color Image"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleImagePreview(
                    e,
                    (url) =>
                      setNewColorOption({ ...newColorOption, imageUrl: url }),
                    () => {}
                  )
                }
                preview={newColorOption.imageUrl}
                handleGallerySelect={handleGallerySelect}
                setProduct={setProduct}
              />
            </div>
          </div>
          <Button onClick={addColorOption} className="w-full mt-2">
            Add Color Option
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorOptionsTab;
