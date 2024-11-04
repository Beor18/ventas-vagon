"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductInfo from "@/components/ProductInfo";
import DesignsTab from "@/components/DesignsTab";
import OptionsTab from "@/components/OptionsTab";
import ColorOptionsTab from "@/components/ColorOptionsTab";
import {
  ProductType,
  OptionType,
  SubOptionType,
  DesignType,
  ColorOptionType,
} from "@/types/types";

interface ProductFormProps {
  product: ProductType;
  setProduct: (product: ProductType) => void;
  newOption: OptionType;
  setNewOption: (option: OptionType) => void;
  newSubOption: SubOptionType;
  setNewSubOption: (subOption: SubOptionType) => void;
  newDesign: DesignType;
  setNewDesign: (design: DesignType) => void;
  newColorOption: ColorOptionType;
  setNewColorOption: (colorOption: ColorOptionType) => void;
  handleProductChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
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
  handleNewSubOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewDesignChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewColorOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addOption: () => void;
  addSubOption: (optionIndex: number) => void;
  addDesign: () => void;
  addColorOption: () => void;
  removeOption: (optionIndex: number) => void;
  removeSubOption: (optionIndex: number, subOptionIndex: number) => void;
  removeDesign: (designIndex: number) => void;
  removeColorOption: (colorOptionIndex: number) => void;
  handleImagePreview: (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrlCallback: (url: string) => void,
    setPreviewCallback: (url: string) => void
  ) => void;
  handleGallerySelect: any;
  saveProduct: () => void;
  setModalOpen: (open: boolean) => void;
  loading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  setProduct,
  newOption,
  setNewOption,
  newSubOption,
  setNewSubOption,
  newDesign,
  setNewDesign,
  newColorOption,
  setNewColorOption,
  handleProductChange,
  handleOptionChange,
  handleSubOptionChange,
  handleNewOptionChange,
  handleNewSubOptionChange,
  handleNewDesignChange,
  handleNewColorOptionChange,
  addOption,
  addSubOption,
  addDesign,
  addColorOption,
  removeOption,
  removeSubOption,
  removeDesign,
  removeColorOption,
  handleImagePreview,
  handleGallerySelect,
  saveProduct,
  setModalOpen,
  loading,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Información de producto", value: "product-info" },
    { title: "Agregar tipo de estructura", value: "designs" },
    { title: "Frame color", value: "color-options" },
    { title: "Opciones", value: "options" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-y-auto">
      <Card className="w-full max-w-full mx-4 max-h-[100vh] flex flex-col p-0">
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
              <TabsContent value="product-info">
                <ProductInfo
                  product={product}
                  handleProductChange={handleProductChange}
                  handleImagePreview={handleImagePreview}
                  setProduct={setProduct}
                />
              </TabsContent>
              <TabsContent value="designs">
                <DesignsTab
                  product={product}
                  setProduct={setProduct}
                  newDesign={newDesign}
                  setNewDesign={setNewDesign}
                  handleNewDesignChange={handleNewDesignChange}
                  addDesign={addDesign}
                  removeDesign={removeDesign}
                  handleImagePreview={handleImagePreview}
                />
              </TabsContent>
              <TabsContent value="options">
                <OptionsTab
                  product={product}
                  setProduct={setProduct}
                  newOption={newOption}
                  setNewOption={setNewOption}
                  handleOptionChange={handleOptionChange}
                  handleSubOptionChange={handleSubOptionChange}
                  handleNewOptionChange={handleNewOptionChange}
                  addOption={addOption}
                  addSubOption={addSubOption}
                  removeOption={removeOption}
                  removeSubOption={removeSubOption}
                  handleImagePreview={handleImagePreview}
                  handleGallerySelect={handleGallerySelect}
                />
              </TabsContent>
              <TabsContent value="color-options">
                <ColorOptionsTab
                  product={product}
                  setProduct={setProduct}
                  newColorOption={newColorOption}
                  setNewColorOption={setNewColorOption}
                  handleNewColorOptionChange={handleNewColorOptionChange}
                  addColorOption={addColorOption}
                  removeColorOption={removeColorOption}
                  handleImagePreview={handleImagePreview}
                />
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

export default ProductForm;
