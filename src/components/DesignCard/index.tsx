import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { InputField, ImageUploadField } from "@/components/FormFields";
import { ProductType, DesignType } from "@/types/types";

interface DesignCardProps {
  design: DesignType;
  designIndex: number;
  handleDesignChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
  setProduct: (product: ProductType) => void;
  product: ProductType;
  removeDesign: (designIndex: number) => void;
}

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  designIndex,
  handleDesignChange,
  handleImagePreview,
  setProduct,
  product,
  removeDesign,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Design {designIndex + 1}</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeDesign(designIndex)}
          >
            <Minus className="mr-2 h-4 w-4" /> Remove Design
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Design Name"
            name="name"
            value={design.name}
            onChange={(e) => handleDesignChange(e)}
            placeholder="Enter design name"
          />
          <InputField
            label="Design Price"
            name="price"
            type="number"
            value={design.price}
            onChange={(e) => handleDesignChange(e)}
            placeholder="Enter design price"
          />
          <ImageUploadField
            label="Design Image"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleImagePreview(
                e,
                (url: string) => {
                  const updatedDesigns = [...product.designs];
                  updatedDesigns[designIndex] = {
                    ...updatedDesigns[designIndex],
                    imageUrl: url,
                  };
                  setProduct({
                    ...product,
                    designs: updatedDesigns,
                  });
                },
                (url: string) => {
                  const updatedDesigns = [...product.designs];
                  updatedDesigns[designIndex].imageUrl = url;
                  setProduct({
                    ...product,
                    designs: updatedDesigns,
                  });
                }
              )
            }
            preview={design.imageUrl}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignCard;
