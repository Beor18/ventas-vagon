import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InputField, ImageUploadField } from "@/components/FormFields";
import FloorPlanCard from "@/components/FloorPlanCard";
import { ProductType, FloorPlanType } from "@/types/types";

interface FloorPlansTabProps {
  product: ProductType;
  setProduct: (product: ProductType) => void;
  newFloorPlan: FloorPlanType;
  setNewFloorPlan: (floorPlan: FloorPlanType) => void;
  handleNewFloorPlanChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addFloorPlan: () => void;
  removeFloorPlan: (floorPlanIndex: number) => void;
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
  galleryImages: any[];
  loadGalleryImages: () => Promise<void>;
  isUploading: boolean;
}

const FloorPlansTab: React.FC<FloorPlansTabProps> = ({
  product,
  setProduct,
  newFloorPlan,
  setNewFloorPlan,
  handleNewFloorPlanChange,
  addFloorPlan,
  removeFloorPlan,
  handleImagePreview,
  galleryImages,
  loadGalleryImages,
  isUploading,
}) => {
  useEffect(() => {
    loadGalleryImages();
  }, []);

  return (
    <div className="space-y-6">
      {product.floorPlans &&
        product.floorPlans.map((floorPlan, floorPlanIndex) => (
          <FloorPlanCard
            key={floorPlanIndex}
            floorPlan={floorPlan}
            floorPlanIndex={floorPlanIndex}
            handleFloorPlanChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const updatedFloorPlans = [...product.floorPlans];
              updatedFloorPlans[floorPlanIndex] = {
                ...updatedFloorPlans[floorPlanIndex],
                [e.target.name]: e.target.value,
              };
              setProduct({
                ...product,
                floorPlans: updatedFloorPlans,
              });
            }}
            handleImagePreview={handleImagePreview}
            setProduct={setProduct}
            product={product}
            removeFloorPlan={removeFloorPlan}
            galleryImages={galleryImages}
            isUploading={isUploading}
            loadGalleryImages={loadGalleryImages}
          />
        ))}
      <div className="space-y-4">
        <h6 className="text-lg font-semibold">New Floor Plan</h6>
        <Button onClick={addFloorPlan} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Floor Plan
        </Button>
      </div>
      <ImageUploadField
        label="Floor Plan Image"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleImagePreview(
            e,
            (url: string) =>
              setNewFloorPlan({ ...newFloorPlan, imageUrl: url }),
            (url: string) => setNewFloorPlan({ ...newFloorPlan, imageUrl: url })
          )
        }
        preview={newFloorPlan.imageUrl}
        handleGallerySelect={(url: string) => {
          setNewFloorPlan({ ...newFloorPlan, imageUrl: url });
        }}
        galleryImages={galleryImages}
        isUploading={isUploading}
        loadGalleryImages={loadGalleryImages}
      />
    </div>
  );
};

export default FloorPlansTab;
