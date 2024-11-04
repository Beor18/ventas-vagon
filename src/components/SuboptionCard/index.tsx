import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { InputField, ImageUploadField } from "@/components/FormFields";
import { ProductType, OptionType, SubOptionType } from "@/types/types";

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
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
            const downloadUrl =
              typeof url === "object" && url.downloadUrl
                ? url.downloadUrl
                : url;

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

            updatedOptions[optionIndex].suboptions[subOptionIndex] = {
              ...updatedOptions[optionIndex].suboptions[subOptionIndex],
              name: nameWithoutExtension,
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

export default SuboptionCard;
