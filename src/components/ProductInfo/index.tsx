import React, { useEffect } from "react";
import {
  InputField,
  TextAreaField,
  ImageUploadField,
} from "@/components/FormFields";
import { ProductType } from "@/types/types";

interface ProductInfoProps {
  product: ProductType;
  handleProductChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
  handleGallerySelect: any;
  galleryImages: any[];
  isUploading: boolean;
  loadGalleryImages: () => Promise<void>;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  handleProductChange,
  handleImagePreview,
  handleGallerySelect,
  galleryImages,
  isUploading,
  loadGalleryImages,
}) => {
  useEffect(() => {
    // loadGalleryImages();
  }, []);

  const handleGallerySelection = (url: any) => {
    // Asegura que usamos la URL de descarga
    const downloadUrl =
      typeof url === "object" && url.downloadUrl ? url.downloadUrl : url;

    // Extrae y decodifica el nombre del archivo
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

    handleGallerySelect({
      ...product,
      imageUrl: downloadUrl,
      name: nameWithoutExtension || product.name,
    });
  };

  return (
    <div className="space-y-4">
      <InputField
        label="Product Name"
        name="name"
        value={product.name}
        onChange={handleProductChange}
        placeholder="Enter product name"
      />
      <TextAreaField
        label="Description"
        name="description"
        value={product.description}
        onChange={handleProductChange}
        placeholder="Enter product description"
      />
      <ImageUploadField
        label="Product Image"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleImagePreview(
            e,
            (url: string) =>
              handleGallerySelection({ ...product, imageUrl: url }),
            (url: string) =>
              handleGallerySelection({ ...product, imageUrl: url })
          )
        }
        preview={product.imageUrl}
        handleGallerySelect={handleGallerySelection}
        galleryImages={galleryImages}
        isUploading={isUploading}
        loadGalleryImages={loadGalleryImages}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Quantity"
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleProductChange}
          placeholder="Enter quantity"
        />
        <InputField
          label="Material"
          name="material"
          value={product.material}
          onChange={handleProductChange}
          placeholder="Enter material"
        />
        <InputField
          label="External Dimensions"
          name="externalDimensions"
          value={product.externalDimensions}
          onChange={handleProductChange}
          placeholder="Enter external dimensions"
        />
        <InputField
          label="Internal Dimensions"
          name="internalDimensions"
          value={product.internalDimensions}
          onChange={handleProductChange}
          placeholder="Enter internal dimensions"
        />
        <InputField
          label="Folding State"
          name="foldingState"
          value={product.foldingState}
          onChange={handleProductChange}
          placeholder="Enter folding state"
        />
        <InputField
          label="Total Weight"
          name="totalWeight"
          type="number"
          value={product.totalWeight}
          onChange={handleProductChange}
          placeholder="Enter total weight"
        />
        <InputField
          label="Base Price"
          name="basePrice"
          type="number"
          value={product.basePrice}
          onChange={handleProductChange}
          placeholder="Enter base price"
        />
      </div>
    </div>
  );
};

export default ProductInfo;
