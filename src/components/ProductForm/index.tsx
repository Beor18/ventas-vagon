/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

interface ProductType {
  _id?: string;
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
  material: string;
  externalDimensions: string;
  internalDimensions: string;
  foldingState: string;
  totalWeight: number;
  basePrice: number;
  options: OptionType[];
}

interface OptionType {
  name: string;
  price: number;
  imageUrl: string;
  type: string;
  specification: string;
  pcs: number;
  suboptions: SubOptionType[];
}

interface SubOptionType {
  code: string;
  price: number;
  imageUrl: string;
  details: string;
  name: string;
}

interface ProductFormProps {
  product: ProductType;
  setProduct: (product: ProductType) => void;
  imagePreview: string;
  setImagePreview: (url: string) => void;
  newOption: OptionType;
  setNewOption: (option: OptionType) => void;
  newSubOption: SubOptionType;
  setNewSubOption: (subOption: SubOptionType) => void;
  handleProductChange: (e: any) => void;
  handleOptionChange: (e: any, optionIndex: number) => void;
  handleSubOptionChange: (
    e: any,
    optionIndex: number,
    subOptionIndex: number
  ) => void;
  handleNewOptionChange: (e: any) => void;
  handleNewSubOptionChange: (e: any) => void;
  addOption: () => void;
  addSubOption: (optionIndex: number) => void;
  removeOption: (optionIndex: number) => void;
  removeSubOption: (optionIndex: number, subOptionIndex: number) => void;
  handleImagePreview: (
    e: any,
    setImageUrlCallback: any,
    setPreviewCallback: any
  ) => void;
  saveProduct: () => void;
  setModalOpen: (open: boolean) => void;
  loading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  setProduct,
  imagePreview,
  setImagePreview,
  newOption,
  setNewOption,
  newSubOption,
  setNewSubOption,
  handleProductChange,
  handleOptionChange,
  handleSubOptionChange,
  handleNewOptionChange,
  handleNewSubOptionChange,
  addOption,
  addSubOption,
  removeOption,
  removeSubOption,
  handleImagePreview,
  saveProduct,
  setModalOpen,
  loading,
}: any) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const inputFileRefOption = useRef<HTMLInputElement>(null);
  const inputFileRefSubOption = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Product Information", value: "product-info" },
    { title: "Options", value: "options" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-y-auto">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{product._id ? "Edit Product" : "New Product"}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setModalOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={steps[currentStep].value} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                {steps.map((step, index) => (
                  <TabsTrigger
                    key={step.value}
                    value={step.value}
                    //disabled={index > currentStep}
                    onClick={() => setCurrentStep(index)}
                  >
                    {step.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="h-2 w-full bg-secondary mb-8">
              <div
                className="h-2 bg-primary transition-all duration-300 ease-in-out"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
            <ScrollArea className="h-[calc(90vh-16rem)]">
              <TabsContent value="product-info" className="space-y-4">
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
                  inputRef={inputFileRef}
                  onChange={(e: any) =>
                    handleImagePreview(
                      e,
                      (url: string) =>
                        setProduct({ ...product, imageUrl: url }),
                      setImagePreview
                    )
                  }
                  preview={imagePreview}
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
              </TabsContent>
              <TabsContent value="options" className="space-y-6">
                {product.options.map((option, optionIndex) => (
                  <OptionCard
                    key={optionIndex}
                    option={option}
                    optionIndex={optionIndex}
                    handleOptionChange={handleOptionChange}
                    inputFileRefOption={inputFileRefOption}
                    handleImagePreview={handleImagePreview}
                    setProduct={setProduct}
                    product={product}
                    addSubOption={addSubOption}
                    removeOption={removeOption}
                    handleSubOptionChange={handleSubOptionChange}
                    removeSubOption={removeSubOption}
                    inputFileRefSubOption={inputFileRefSubOption}
                  />
                ))}
                <div className="space-y-4">
                  <h6 className="text-lg font-semibold">New Option</h6>
                  <InputField
                    label="Option Name"
                    name="name"
                    value={newOption.name}
                    onChange={handleNewOptionChange}
                    placeholder="Enter new option name"
                  />
                  <InputField
                    label="Option Price"
                    name="price"
                    type="number"
                    value={newOption.price}
                    onChange={handleNewOptionChange}
                    placeholder="Enter new option price"
                  />
                  <Button onClick={addOption} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Option
                  </Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
        <div className="flex justify-between items-center p-6 bg-muted/40 rounded-b-lg">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={saveProduct} className="ml-auto">
              Save Product
            </Button>
          )}
        </div>
      </Card>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <Card>
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
              <CardTitle>Uploading...</CardTitle>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: any) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder }: any) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
    />
  </div>
);

const ImageUploadField = ({ label, inputRef, onChange, preview }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="flex items-center">
      <Input
        type="file"
        ref={inputRef}
        onChange={onChange}
        className="hidden"
        accept="image/*"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" /> Choose Image
      </Button>
      {preview && (
        <div className="relative h-20 w-20">
          <img
            src={preview}
            alt="Preview"
            //fill
            className="object-cover rounded-md"
          />
        </div>
      )}
    </div>
  </div>
);

const OptionCard = ({
  option,
  optionIndex,
  handleOptionChange,
  inputFileRefOption,
  handleImagePreview,
  setProduct,
  product,
  addSubOption,
  removeOption,
  handleSubOptionChange,
  removeSubOption,
  inputFileRefSubOption,
}: any) => (
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
          onChange={(e: any) => handleOptionChange(e, optionIndex)}
          placeholder="Enter option name"
        />
        <InputField
          label="Option Price"
          name="price"
          type="number"
          value={option.price}
          onChange={(e: any) => handleOptionChange(e, optionIndex)}
          placeholder="Enter option price"
        />
        <ImageUploadField
          label="Option Image"
          inputRef={inputFileRefOption}
          onChange={(e: any) =>
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
        />
        <InputField
          label="Option Type"
          name="type"
          value={option.type}
          onChange={(e: any) => handleOptionChange(e, optionIndex)}
          placeholder="Enter option type"
        />
        <InputField
          label="Specification"
          name="specification"
          value={option.specification}
          onChange={(e: any) => handleOptionChange(e, optionIndex)}
          placeholder="Enter specification"
        />
        <InputField
          label="PCS"
          name="pcs"
          type="number"
          value={option.pcs}
          onChange={(e: any) => handleOptionChange(e, optionIndex)}
          placeholder="Enter PCS"
        />
      </div>
      <div className="space-y-4">
        <h6 className="text-lg font-semibold">Suboptions</h6>
        {option.suboptions.map((suboption: any, subOptionIndex: any) => (
          <SuboptionCard
            key={subOptionIndex}
            suboption={suboption}
            optionIndex={optionIndex}
            subOptionIndex={subOptionIndex}
            handleSubOptionChange={handleSubOptionChange}
            removeSubOption={removeSubOption}
            inputFileRefSubOption={inputFileRefSubOption}
            handleImagePreview={handleImagePreview}
            setProduct={setProduct}
            product={product}
          />
        ))}
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

const SuboptionCard = ({
  suboption,
  optionIndex,
  subOptionIndex,
  handleSubOptionChange,
  removeSubOption,
  inputFileRefSubOption,
  handleImagePreview,
  setProduct,
  product,
}: any) => (
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
          onChange={(e: any) =>
            handleSubOptionChange(e, optionIndex, subOptionIndex)
          }
          placeholder="Enter suboption name"
        />
        <InputField
          label="Suboption Price"
          name="price"
          type="number"
          value={suboption.price}
          onChange={(e: any) =>
            handleSubOptionChange(e, optionIndex, subOptionIndex)
          }
          placeholder="Enter suboption price"
        />
        <ImageUploadField
          label="Suboption Image"
          inputRef={inputFileRefSubOption}
          onChange={(e: any) =>
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
        />
        <InputField
          label="Suboption Code"
          name="code"
          value={suboption.code}
          onChange={(e: any) =>
            handleSubOptionChange(e, optionIndex, subOptionIndex)
          }
          placeholder="Enter suboption code"
        />
        <InputField
          label="Details"
          name="details"
          value={suboption.details}
          onChange={(e: any) =>
            handleSubOptionChange(e, optionIndex, subOptionIndex)
          }
          placeholder="Enter details"
        />
      </div>
    </CardContent>
  </Card>
);

export default ProductForm;
