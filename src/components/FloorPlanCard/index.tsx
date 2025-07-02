import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { InputField, ImageUploadField } from "@/components/FormFields";
import { ProductType, FloorPlanType } from "@/types/types";

interface FloorPlanCardProps {
  floorPlan: FloorPlanType;
  floorPlanIndex: number;
  handleFloorPlanChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    floorPlanIndex: number
  ) => void;
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
  setProduct: (product: ProductType) => void;
  product: ProductType;
  removeFloorPlan: (floorPlanIndex: number) => void;
  galleryImages: any[];
  isUploading: boolean;
  loadGalleryImages: () => Promise<void>;
}

const FloorPlanCard: React.FC<FloorPlanCardProps> = ({
  floorPlan,
  floorPlanIndex,
  handleFloorPlanChange,
  handleImagePreview,
  setProduct,
  product,
  removeFloorPlan,
  galleryImages,
  isUploading,
  loadGalleryImages,
}) => {
  const handleGallerySelect = (url: any, floorPlanIndex: number) => {
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

    // Actualiza el floor plan correspondiente en el producto
    const updatedFloorPlans = [...product.floorPlans];
    updatedFloorPlans[floorPlanIndex] = {
      ...updatedFloorPlans[floorPlanIndex],
      imageUrl: downloadUrl,
      planName: nameWithoutExtension,
    };

    setProduct({
      ...product,
      floorPlans: updatedFloorPlans,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Floor Plan {floorPlanIndex + 1}</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeFloorPlan(floorPlanIndex)}
          >
            <Minus className="mr-2 h-4 w-4" /> Remove Floor Plan
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Plan Name"
            name="planName"
            value={floorPlan.planName}
            onChange={(e) => {
              handleFloorPlanChange(e, floorPlanIndex);
            }}
            placeholder="Enter floor plan name"
          />
          <InputField
            label="Plan Price"
            name="cost"
            type="number"
            value={floorPlan.cost}
            onChange={(e) => handleFloorPlanChange(e, floorPlanIndex)}
            placeholder="Enter floor plan price"
          />
          <ImageUploadField
            label="Floor Plan Image"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleImagePreview(
                e,
                (url: string) => {
                  const updatedFloorPlans = [...product.floorPlans];
                  updatedFloorPlans[floorPlanIndex] = {
                    ...updatedFloorPlans[floorPlanIndex],
                    imageUrl: url,
                  };
                  setProduct({
                    ...product,
                    floorPlans: updatedFloorPlans,
                  });
                },
                (url: string) => {
                  const updatedFloorPlans = [...product.floorPlans];
                  updatedFloorPlans[floorPlanIndex].imageUrl = url;
                  setProduct({
                    ...product,
                    floorPlans: updatedFloorPlans,
                  });
                }
              )
            }
            preview={floorPlan.imageUrl}
            handleGallerySelect={(url: any) =>
              handleGallerySelect(url, floorPlanIndex)
            }
            galleryImages={galleryImages}
            isUploading={isUploading}
            loadGalleryImages={loadGalleryImages}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FloorPlanCard;
