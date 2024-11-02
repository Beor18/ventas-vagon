import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { InputField, ImageUploadField } from "@/components/FormFields";
import { ProductType, DesignType } from "@/types/types";

interface DesignCardProps {
  design: DesignType;
  designIndex: number;
  handleDesignChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    designIndex: number
  ) => void;
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
  const handleGallerySelect = (url: any, designIndex: number) => {
    // Obtiene la URL de descarga
    const downloadUrl =
      typeof url === "object" && url.downloadUrl ? url.downloadUrl : url;

    // Extrae el nombre del archivo sin extensión
    let fileName = "";
    if (typeof downloadUrl === "string") {
      fileName = decodeURIComponent(downloadUrl.split("/").pop() || "");
    }

    // Procesa el nombre para dejar solo letras, números y espacios
    let nameWithoutExtension = fileName
      .substring(0, fileName.lastIndexOf("."))
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .split(" ")
      .slice(0, 3)
      .join(" ");

    // Actualiza el diseño correspondiente en el producto
    const updatedDesigns = [...product.designs];
    updatedDesigns[designIndex] = {
      ...updatedDesigns[designIndex],
      imageUrl: downloadUrl,
      designType: nameWithoutExtension,
    };

    setProduct({
      ...product,
      designs: updatedDesigns,
    });
  };

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
            name="designType"
            value={design.designType}
            onChange={(e) => {
              handleDesignChange(e, designIndex);
            }}
            placeholder="Enter design name"
          />
          <InputField
            label="Design Price"
            name="cost"
            type="number"
            value={design.cost}
            onChange={(e) => handleDesignChange(e, designIndex)}
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
            handleGallerySelect={(url: any) =>
              handleGallerySelect(url, designIndex)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignCard;
