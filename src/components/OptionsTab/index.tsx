import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InputField } from "@/components/FormFields";
import OptionCard from "@/components/OptionCard";
import { ProductType, OptionType } from "@/types/types";

interface OptionsTabProps {
  product: ProductType;
  setProduct: (product: ProductType) => void;
  newOption: OptionType;
  setNewOption: (option: OptionType) => void;
  handleOptionChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number
  ) => void;
  handleSubOptionChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number,
    subOptionIndex: number
  ) => void;
  handleNewOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addOption: () => void;
  addSubOption: (optionIndex: number) => void;
  removeOption: (optionIndex: number) => void;
  removeSubOption: (optionIndex: number, subOptionIndex: number) => void;
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
}

const OptionsTab: React.FC<OptionsTabProps> = ({
  product,
  setProduct,
  newOption,
  handleOptionChange,
  handleSubOptionChange,
  handleNewOptionChange,
  addOption,
  addSubOption,
  removeOption,
  removeSubOption,
  handleImagePreview,
}) => {
  return (
    <div className="space-y-6">
      {product.options.map((option, optionIndex) => (
        <OptionCard
          key={optionIndex}
          option={option}
          optionIndex={optionIndex}
          handleOptionChange={handleOptionChange}
          handleImagePreview={handleImagePreview}
          setProduct={setProduct}
          product={product}
          addSubOption={addSubOption}
          removeOption={removeOption}
          handleSubOptionChange={handleSubOptionChange}
          removeSubOption={removeSubOption}
        />
      ))}
      <div className="space-y-4">
        <h6 className="text-lg font-semibold">New Option</h6>
        <Button onClick={addOption} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Option
        </Button>
      </div>
    </div>
  );
};

export default OptionsTab;
