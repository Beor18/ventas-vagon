import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { InputField, ImageUploadField } from "@/components/FormFields";
import { ProductType, OptionType, SubOptionType } from "@/types/types";

interface OptionCardProps {
  option: OptionType;
  optionIndex: number;
  handleOptionChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number
  ) => void;
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
  setProduct: (product: ProductType) => void;
  product: ProductType;
  addSubOption: (optionIndex: number) => void;
  removeOption: (optionIndex: number) => void;
  handleSubOptionChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number,
    subOptionIndex: number
  ) => void;
  removeSubOption: (optionIndex: number, subOptionIndex: number) => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  optionIndex,
  handleOptionChange,
  handleImagePreview,
  setProduct,
  product,
  addSubOption,
  removeOption,
  handleSubOptionChange,
  removeSubOption,
}) => {
  const handleGallerySelect = (
    url: any,
    isSubOption = false,
    subOptionIndex = 0
  ) => {
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

    const updatedOptions = [...product.options];

    if (isSubOption) {
      // Actualiza solo la suboption específica
      updatedOptions[optionIndex].suboptions[subOptionIndex] = {
        ...updatedOptions[optionIndex].suboptions[subOptionIndex],
        imageUrl: downloadUrl,
        name:
          nameWithoutExtension ||
          updatedOptions[optionIndex].suboptions[subOptionIndex].name,
      };
    } else {
      // Actualiza la opción principal
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        imageUrl: downloadUrl,
        name: nameWithoutExtension || updatedOptions[optionIndex].name,
      };
    }

    // Aplica los cambios al producto
    setProduct({
      ...product,
      options: updatedOptions,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Option {optionIndex + 1}</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeOption(optionIndex)}
          >
            <Minus className="mr-2 h-4 w-4" /> Remove Option
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Option Name"
            name="name"
            value={option.name}
            onChange={(e) => handleOptionChange(e, optionIndex)}
            placeholder="Enter option name"
          />
          <InputField
            label="Option Price"
            name="price"
            type="number"
            value={option.price}
            onChange={(e) => handleOptionChange(e, optionIndex)}
            placeholder="Enter option price"
          />
          <ImageUploadField
            label="Option Image"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleImagePreview(
                e,
                (url: string) => {
                  const updatedOptions = [...product.options];
                  updatedOptions[optionIndex] = {
                    ...updatedOptions[optionIndex],
                    imageUrl: url,
                  };
                  setProduct({
                    ...product,
                    options: updatedOptions,
                  });
                },
                (url: string) => {
                  const updatedOptions = [...product.options];
                  updatedOptions[optionIndex].imageUrl = url;
                  setProduct({
                    ...product,
                    options: updatedOptions,
                  });
                }
              )
            }
            preview={option.imageUrl}
            handleGallerySelect={(url: any) =>
              handleGallerySelect(url, false, optionIndex)
            }
          />
          <InputField
            label="Option Type"
            name="type"
            value={option.type}
            onChange={(e) => handleOptionChange(e, optionIndex)}
            placeholder="Enter option type"
          />
          <InputField
            label="Specification"
            name="specification"
            value={option.specification}
            onChange={(e) => handleOptionChange(e, optionIndex)}
            placeholder="Enter specification"
          />
          <InputField
            label="PCS"
            name="pcs"
            type="number"
            value={option.pcs}
            onChange={(e) => handleOptionChange(e, optionIndex)}
            placeholder="Enter PCS"
          />
        </div>
        <div className="space-y-4">
          <h6 className="text-lg font-semibold">Suboptions</h6>
          {option.suboptions.map(
            (suboption: SubOptionType, subOptionIndex: number) => (
              <SuboptionCard
                key={subOptionIndex}
                suboption={suboption}
                optionIndex={optionIndex}
                subOptionIndex={subOptionIndex}
                handleSubOptionChange={handleSubOptionChange}
                removeSubOption={removeSubOption}
                handleImagePreview={handleImagePreview}
                setProduct={setProduct}
                product={product}
                handleGallerySelect={handleGallerySelect}
              />
            )
          )}
          <Button
            onClick={() => addSubOption(optionIndex)}
            variant="outline"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Suboption
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SuboptionCard: React.FC<{
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
    url: any,
    isSubOption: boolean,
    optionIndex: number,
    subOptionIndex: number
  ) => void;
}> = ({
  suboption,
  optionIndex,
  subOptionIndex,
  handleSubOptionChange,
  removeSubOption,
  handleImagePreview,
  setProduct,
  product,
  handleGallerySelect,
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
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          handleGallerySelect={(url: any) => {
            // Extrae la URL de descarga si está presente como propiedad
            const downloadUrl =
              typeof url === "object" && url.downloadUrl
                ? url.downloadUrl
                : url;

            // Decodifica y extrae el nombre del archivo
            let fileName =
              typeof downloadUrl === "string"
                ? decodeURIComponent(downloadUrl.split("/").pop() || "")
                : "";

            // Procesa el nombre para eliminar la extensión y limpiar caracteres
            let nameWithoutExtension = fileName
              .substring(0, fileName.lastIndexOf("."))
              .replace(/[^\w\s]/g, " ")
              .replace(/\s+/g, " ")
              .split(" ")
              .slice(0, 3)
              .join(" ");

            const updatedOptions = [...product.options];

            // Actualiza el suboption con el nombre procesado y la URL de imagen
            updatedOptions[optionIndex].suboptions[subOptionIndex] = {
              ...updatedOptions[optionIndex].suboptions[subOptionIndex],
              name: nameWithoutExtension, // Usa el nombre procesado
              imageUrl: downloadUrl,
            };

            setProduct({
              ...product,
              options: updatedOptions,
            });
          }}
          setProduct={(updatedProduct) => {
            const updatedOptions = [...product.options];
            if (updatedProduct.imageUrl) {
              updatedOptions[optionIndex].suboptions[subOptionIndex] = {
                ...updatedOptions[optionIndex].suboptions[subOptionIndex],
                imageUrl: updatedProduct.imageUrl,
                name:
                  updatedProduct.name ||
                  updatedOptions[optionIndex].suboptions[subOptionIndex].name,
              };
              setProduct({
                ...product,
                options: updatedOptions,
              });
            }
          }}
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

export default OptionCard;
