import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InputField, ImageUploadField } from "@/components/FormFields";
import DesignCard from "@/components/DesignCard";
import { ProductType, DesignType } from "@/types/types";

interface DesignsTabProps {
  product: ProductType;
  setProduct: (product: ProductType) => void;
  newDesign: DesignType;
  setNewDesign: (design: DesignType) => void;
  handleNewDesignChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addDesign: () => void;
  removeDesign: (designIndex: number) => void;
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
}

const DesignsTab: React.FC<DesignsTabProps> = ({
  product,
  setProduct,
  newDesign,
  setNewDesign,
  handleNewDesignChange,
  addDesign,
  removeDesign,
  handleImagePreview,
}) => {
  return (
    <div className="space-y-6">
      {product.designs &&
        product.designs.map((design, designIndex) => (
          <DesignCard
            key={designIndex}
            design={design}
            designIndex={designIndex}
            handleDesignChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const updatedDesigns = [...product.designs];
              updatedDesigns[designIndex] = {
                ...updatedDesigns[designIndex],
                [e.target.name]: e.target.value,
              };
              setProduct({
                ...product,
                designs: updatedDesigns,
              });
            }}
            handleImagePreview={handleImagePreview}
            setProduct={setProduct}
            product={product}
            removeDesign={removeDesign}
          />
        ))}
      <div className="space-y-4">
        <h6 className="text-lg font-semibold">New Design</h6>
        <InputField
          label="Design Name"
          name="name"
          value={newDesign.name}
          onChange={handleNewDesignChange}
          placeholder="Enter new design name"
        />
        <InputField
          label="Design Price"
          name="price"
          type="number"
          value={newDesign.price}
          onChange={handleNewDesignChange}
          placeholder="Enter new design price"
        />
        <ImageUploadField
          label="Design Image"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleImagePreview(
              e,
              (url: string) => setNewDesign({ ...newDesign, imageUrl: url }),
              (url: string) => setNewDesign({ ...newDesign, imageUrl: url })
            )
          }
          preview={newDesign.imageUrl}
        />
        <Button onClick={addDesign} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Design
        </Button>
      </div>
    </div>
  );
};

export default DesignsTab;
