/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Ruler, House } from "lucide-react";

export function ProductDetails({ product }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    if (product.colorOptions && product.colorOptions.length > 0) {
      setSelectedColor(product.colorOptions[0]);
    }
  }, [product.colorOptions]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleOptionSelect = (optionName, suboption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: suboption,
    }));
  };

  const calculateTotalPrice = () => {
    let total = product.basePrice;
    if (selectedColor) {
      total += selectedColor.additionalPrice;
    }
    Object.values(selectedOptions).forEach((option: any) => {
      total += option.price;
    });
    return total.toFixed(2);
  };

  return (
    <div className="w-full mx-auto px-4 py-4 sm:py-4">
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={selectedColor?.imageUrl || product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          {product.colorOptions && product.colorOptions.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
              {product.colorOptions.map((color) => (
                <button
                  key={color.colorCode}
                  onClick={() => handleColorSelect(color)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex-shrink-0 ${
                    selectedColor?.colorCode === color.colorCode
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.colorCode }}
                >
                  <span className="sr-only">{color.colorName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold">USD {calculateTotalPrice()}</p>
          <p className="text-sm sm:text-base text-gray-600">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="text-xs sm:text-sm flex items-center"
            >
              <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Material: {product.material}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs sm:text-sm flex items-center"
            >
              <Ruler className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Weight: {product.totalWeight} kg
            </Badge>
            <Badge
              variant="outline"
              className="text-xs sm:text-sm flex items-center"
            >
              <House className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Folding State: {product.foldingState || "N/A"}
            </Badge>
          </div>

          <Separator />

          <div className="text-sm sm:text-base">
            <h3 className="font-semibold mb-2">Dimensions:</h3>
            <p>
              <span className="font-medium">External:</span>{" "}
              {product.externalDimensions || "N/A"}
            </p>
            <p>
              <span className="font-medium">Internal:</span>{" "}
              {product.internalDimensions || "N/A"}
            </p>
          </div>

          <Separator />

          {selectedColor && (
            <div className="text-sm sm:text-base">
              <h3 className="font-semibold mb-2">
                Color: {selectedColor.colorName}
              </h3>
              <div className="flex items-center space-x-2">
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border"
                  style={{ backgroundColor: selectedColor.colorCode }}
                />
                <span>
                  {selectedColor.additionalPrice > 0
                    ? `+$${selectedColor.additionalPrice}`
                    : "No additional cost"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {product.options && product.options.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <Tabs defaultValue={product.options[0]?.name}>
            <TabsList className="max-w-[350px] overflow-x-auto items-center justify-start">
              {product.options.map((option) => (
                <TabsTrigger
                  key={option.name}
                  value={option.name}
                  className="px-3 py-1 text-sm whitespace-nowrap"
                >
                  {option.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {product.options.map((option) => (
              <TabsContent key={option.name} value={option.name}>
                <Card>
                  <CardContent className="space-y-4 pt-4">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {option.name}
                    </h3>
                    <p className="text-xs sm:text-sm">{option.specification}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                      {option.suboptions.map((suboption) => (
                        <Button
                          key={suboption.code}
                          variant={
                            selectedOptions[option.name]?.code ===
                            suboption.code
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            handleOptionSelect(option.name, suboption)
                          }
                          className="w-full text-xs sm:text-sm py-1 sm:py-2"
                        >
                          {suboption.name}
                          {suboption.price > 0 && (
                            <span className="ml-1">+${suboption.price}</span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
}
