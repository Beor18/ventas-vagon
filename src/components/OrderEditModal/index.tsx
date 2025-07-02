/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "../ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface OrderEditModalProps {
  fabricante?: any;
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  editOrder: (orderId: string, updatedData: Partial<any>) => void;
  initialData: any;
}

export function OrderEditModal({
  fabricante,
  isOpen,
  onClose,
  orderId,
  editOrder,
  initialData,
}: OrderEditModalProps) {
  const [formData, setFormData] = useState<Partial<any>>(() => ({
    ...initialData,
    product: initialData?.product || {},
    options: initialData?.options || [],
    colorOptions: initialData?.colorOptions || [],
    designs: initialData?.designs || [],
    floorPlans: initialData?.floorPlans || [],
    cliente:
      typeof initialData?.cliente === "object"
        ? initialData.cliente.nombre
        : initialData?.cliente,
  }));

  // const [fabricante, setFabricante] = useState<any[]>([]);
  const [selectedFabricante, setSelectedFabricante] = useState(
    initialData?.fabricanteEmail || ""
  );

  useEffect(() => {
    setFormData({
      ...initialData,
      product: initialData?.product || {},
      options: initialData?.options || [],
      colorOptions: initialData?.colorOptions || [],
      designs: initialData?.designs || [],
      floorPlans: initialData?.floorPlans || [],
    });
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (optionIndex: number, suboptionIndex: number) => {
    setFormData((prev) => {
      const newOptions = [...(prev.options || [])];
      const productOption = prev.product?.options?.[optionIndex];
      const productSuboption = productOption?.suboptions?.[suboptionIndex];

      if (!productOption || !productSuboption) return prev;

      const existingOptionIndex = newOptions.findIndex(
        (o) => o.name === productOption.name
      );

      if (existingOptionIndex >= 0) {
        const existingSuboptionIndex = newOptions[
          existingOptionIndex
        ].suboptions.findIndex((s) => s._id === productSuboption._id);

        if (existingSuboptionIndex >= 0) {
          // Remover la subopción al deseleccionar
          newOptions[existingOptionIndex].suboptions.splice(
            existingSuboptionIndex,
            1
          );
          if (newOptions[existingOptionIndex].suboptions.length === 0) {
            newOptions.splice(existingOptionIndex, 1);
          }
        } else {
          // Agregar la subopción al seleccionar, incluyendo el campo comentarios
          newOptions[existingOptionIndex].suboptions.push({
            ...productSuboption,
            comentarios: "", // Inicializar comentarios vacío
          });
        }
      } else {
        // Agregar nueva opción con la subopción, incluyendo el campo comentarios
        newOptions.push({
          ...productOption,
          suboptions: [
            {
              ...productSuboption,
              comentarios: "", // Inicializar comentarios vacío
            },
          ],
        });
      }

      return { ...prev, options: newOptions };
    });
  };

  const handleColorChange = (color: any) => {
    setFormData((prev) => {
      const existingIndex = prev.colorOptions.findIndex(
        (c) => c._id === color._id
      );
      if (existingIndex >= 0) {
        // Remover el color al deseleccionar
        const newColorOptions = prev.colorOptions.filter(
          (c) => c._id !== color._id
        );
        return { ...prev, colorOptions: newColorOptions };
      } else {
        // Agregar el color al seleccionar
        return {
          ...prev,
          colorOptions: [...prev.colorOptions, color],
        };
      }
    });
  };

  const handleDesignChange = (design: any) => {
    setFormData((prev) => {
      const isCurrentlySelected = prev.designs?.some(
        (d) => d._id === design._id
      );

      if (isCurrentlySelected) {
        // Remover el diseño al deseleccionar
        return {
          ...prev,
          designs: [],
        };
      } else {
        // Establecer el nuevo diseño al seleccionar
        return {
          ...prev,
          designs: [design],
        };
      }
    });
  };

  const handleFloorPlanChange = (floorPlan: any) => {
    setFormData((prev) => {
      const isCurrentlySelected = prev.floorPlans?.some(
        (f) => f._id === floorPlan._id
      );

      if (isCurrentlySelected) {
        // Remover el floor plan al deseleccionar
        return {
          ...prev,
          floorPlans: [],
        };
      } else {
        // Establecer el nuevo floor plan al seleccionar
        return {
          ...prev,
          floorPlans: [floorPlan],
        };
      }
    });
  };

  const handleClose = () => {
    setFormData(initialData);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      options: formData.options,
      colorOptions: formData.colorOptions,
      designs: formData.designs,
      floorPlans: formData.floorPlans,
    };
    editOrder(orderId, updatedData);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Editar Orden: {formData.productName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-grow overflow-hidden">
          <Tabs defaultValue="basic" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Información Básica</TabsTrigger>
              <TabsTrigger value="options">Opciones</TabsTrigger>
              <TabsTrigger value="colors">Colores</TabsTrigger>
              <TabsTrigger value="designs">Diseños</TabsTrigger>
              <TabsTrigger value="floorplans">Floor Plans</TabsTrigger>
              <TabsTrigger value="customer">Fabricante</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
              <TabsContent value="basic" className="mt-0 space-y-4">
                <div className="p-4">
                  <div className="mb-8">
                    <CardTitle>Detalles del Producto</CardTitle>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4 mb-8">
                      <p>
                        <span className="font-semibold">Cliente:</span>{" "}
                        {typeof initialData?.cliente === "object"
                          ? initialData.cliente.nombre
                          : "N/A"}
                      </p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      {/* <div className="space-y-2">
                        <Label htmlFor="productName">Producto</Label>
                        <Input
                          id="productName"
                          name="productName"
                          value={formData.productName || ""}
                          onChange={handleInputChange}
                        />
                      </div> */}

                      <div className="space-y-2">
                        <Label htmlFor="status">Estado</Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("status", value)
                          }
                          defaultValue={formData.status}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Completed">
                              Completado
                            </SelectItem>
                            <SelectItem value="Pending">Pendiente</SelectItem>
                            <SelectItem value="Cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="total">Total</Label>
                        <Input
                          id="total"
                          name="total"
                          type="number"
                          value={formData.total}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount">Descuento</Label>
                        <Input
                          id="discount"
                          name="discount"
                          type="number"
                          value={formData.discount}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tax">Impuesto</Label>
                        <Input
                          id="tax"
                          name="tax"
                          type="number"
                          value={formData.tax}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <h2 className="font-semibold">Firma digital: </h2>
                        <img
                          src={formData.signatureImage}
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="options" className="mt-0 space-y-4">
                <div>
                  <CardHeader>
                    <CardTitle>Opciones</CardTitle>
                  </CardHeader>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(formData.product?.options || []).map(
                      (option: any, optionIndex: number) => (
                        <div key={optionIndex}>
                          <h3 className="font-semibold mb-2">{option.name}</h3>
                          {option.suboptions.map(
                            (suboption: any, suboptionIndex: number) => {
                              const isSelected = formData.options?.some(
                                (o) =>
                                  o.name === option.name &&
                                  o.suboptions.some(
                                    (s) => s._id === suboption._id
                                  )
                              );

                              return (
                                <div
                                  key={suboptionIndex}
                                  className="mb-4 p-4 border rounded-md"
                                >
                                  <div className="flex flex-col gap-2">
                                    <div className="aspect-square relative">
                                      <img
                                        src={suboption.imageUrl}
                                        alt={suboption.name}
                                        className="rounded-t-lg bg-cover"
                                      />
                                      {isSelected && (
                                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                                          Seleccionado
                                        </Badge>
                                      )}
                                    </div>
                                    <h4 className="font-medium">
                                      {suboption.name}
                                    </h4>
                                    {isSelected && (
                                      <Textarea
                                        placeholder="Agregar comentarios para esta opción..."
                                        value={
                                          formData.options
                                            ?.find(
                                              (o) => o.name === option.name
                                            )
                                            ?.suboptions?.find(
                                              (s) => s._id === suboption._id
                                            )?.comentarios || ""
                                        }
                                        onChange={(e) => {
                                          setFormData((prev) => {
                                            const newOptions = [
                                              ...(prev.options || []),
                                            ];
                                            const optionIndex =
                                              newOptions.findIndex(
                                                (o) => o.name === option.name
                                              );
                                            if (optionIndex >= 0) {
                                              const suboptionIndex = newOptions[
                                                optionIndex
                                              ].suboptions.findIndex(
                                                (s) => s._id === suboption._id
                                              );
                                              if (suboptionIndex >= 0) {
                                                newOptions[
                                                  optionIndex
                                                ].suboptions[suboptionIndex] = {
                                                  ...newOptions[optionIndex]
                                                    .suboptions[suboptionIndex],
                                                  comentarios: e.target.value,
                                                };
                                              }
                                            }
                                            return {
                                              ...prev,
                                              options: newOptions,
                                            };
                                          });
                                        }}
                                        className="min-h-[80px]"
                                      />
                                    )}
                                    <Button
                                      type="button"
                                      variant={
                                        isSelected ? "default" : "outline"
                                      }
                                      size="sm"
                                      className="w-full"
                                      onClick={() =>
                                        handleOptionChange(
                                          optionIndex,
                                          suboptionIndex
                                        )
                                      }
                                    >
                                      {isSelected
                                        ? "Deseleccionar"
                                        : "Seleccionar"}
                                    </Button>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="colors" className="mt-0 space-y-4">
                <div>
                  <CardHeader>
                    <CardTitle>Opciones de Color</CardTitle>
                  </CardHeader>
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {console.log("color", formData)}
                      {(
                        formData.product?.colorOptions ||
                        formData?.colorOptions ||
                        []
                      ).map((color: any, index: number) => {
                        const isSelected = formData.colorOptions?.some(
                          (c) => c._id === color._id
                        );
                        return (
                          <div
                            key={index}
                            className="relative rounded-lg overflow-hidden shadow-md border transition-all duration-300 hover:shadow-lg"
                          >
                            <div className="aspect-square relative">
                              <img
                                src={color.imageUrl}
                                alt={color.colorName}
                                className="rounded-t-lg bg-cover"
                              />
                              {isSelected && (
                                <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                                  Seleccionado
                                </Badge>
                              )}
                            </div>
                            <div className="p-4 bg-card">
                              <h3 className="font-semibold text-lg mb-3 text-center">
                                {color.colorName}
                              </h3>
                              <Button
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                className="w-full"
                                onClick={() => handleColorChange(color)}
                              >
                                {isSelected ? "Deseleccionar" : "Seleccionar"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="designs" className="mt-0 space-y-4">
                <div>
                  <CardHeader>
                    <CardTitle>Diseños</CardTitle>
                  </CardHeader>
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(
                        formData.product?.designs ||
                        formData?.designs ||
                        []
                      ).map((design: any, index: number) => {
                        const isSelected = formData.designs?.some(
                          (d) => d._id === design._id
                        );

                        return (
                          <div
                            key={index}
                            className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
                          >
                            <div className="aspect-square relative">
                              <img
                                src={design.imageUrl}
                                alt={design.designType}
                                className="rounded-t-lg bg-cover"
                              />
                              {isSelected && (
                                <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                                  Seleccionado
                                </Badge>
                              )}
                            </div>
                            <div className="p-4 bg-card">
                              <h3 className="font-semibold text-lg mb-3 text-center">
                                {design.designType}
                              </h3>
                              <Button
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                className="w-full"
                                onClick={() => handleDesignChange(design)}
                              >
                                {isSelected ? "Deseleccionar" : "Seleccionar"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="floorplans" className="mt-0 space-y-4">
                <div>
                  <CardHeader>
                    <CardTitle>Floor Plans</CardTitle>
                  </CardHeader>
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(
                        formData.product?.floorPlans ||
                        formData?.floorPlans ||
                        []
                      ).map((floorPlan: any, index: number) => {
                        const isSelected = formData.floorPlans?.some(
                          (f) => f._id === floorPlan._id
                        );

                        return (
                          <div
                            key={index}
                            className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
                          >
                            <div className="aspect-square relative">
                              <img
                                src={floorPlan.imageUrl}
                                alt={floorPlan.planName}
                                className="rounded-t-lg bg-cover"
                              />
                              {isSelected && (
                                <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                                  Seleccionado
                                </Badge>
                              )}
                            </div>
                            <div className="p-4 bg-card">
                              <h3 className="font-semibold text-lg mb-3 text-center">
                                {floorPlan.planName}
                              </h3>
                              <Button
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                className="w-full"
                                onClick={() => handleFloorPlanChange(floorPlan)}
                              >
                                {isSelected ? "Deseleccionar" : "Seleccionar"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="customer" className="mt-0 space-y-4">
                <div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="client">Fabricante</Label>
                    <Select
                      value={selectedFabricante}
                      onValueChange={setSelectedFabricante}
                    >
                      <SelectTrigger id="fabricante">
                        <SelectValue placeholder="Seleccione un fabricante" />
                      </SelectTrigger>
                      <SelectContent>
                        {fabricante?.map((client: any) => (
                          <SelectItem key={client._id} value={client.email}>
                            {typeof client === "object" && client
                              ? client.name || client.nombre
                              : "N/A"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
          <DialogFooter className="mt-4">
            <Button type="submit" className="w-full sm:w-auto">
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
