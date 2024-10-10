/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ProductType, ColorOptionType } from "@/types/types";

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
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Color Options</h3>
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
          <h4 className="font-semibold">Add New Color Option</h4>
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
              <Input
                id="colorImage"
                name="colorImage"
                type="file"
                onChange={(e) =>
                  handleImagePreview(
                    e,
                    (url) =>
                      setNewColorOption({ ...newColorOption, imageUrl: url }),
                    () => {}
                  )
                }
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
