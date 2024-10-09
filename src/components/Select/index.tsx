/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, X } from "lucide-react";

interface ProductOption {
  _id: string;
  name: string;
  price: number;
  suboptions?: ProductSubOption[];
}

interface ProductSubOption {
  _id: string;
  name: string;
  price: number;
  code?: string;
  details?: string;
  imageUrl?: string;
}

interface SelectedOptions {
  [key: string]: ProductOption;
}

interface SelectedSubOptions {
  [key: string]: {
    [key: string]: ProductSubOption;
  };
}

export default function SelectComponent({ product, onClose }: any) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [selectedSubOptions, setSelectedSubOptions] =
    useState<SelectedSubOptions>({});
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
        fetchClients(token);
      });
    }
  }, [session]);

  const fetchAccessToken = async () => {
    const response = await fetch("/api/jwt");
    const data = await response.json();
    return data.accessToken;
  };

  const fetchClients = async (token: string) => {
    const response = await fetch("/api/client", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setClients(data);
  };

  const handleOptionSelect = (option: ProductOption) => {
    setSelectedOptions({ ...selectedOptions, [option._id]: option });
  };

  const handleOptionDeselect = (optionId: string) => {
    const newSelectedOptions = { ...selectedOptions };
    delete newSelectedOptions[optionId];
    setSelectedOptions(newSelectedOptions);

    const newSelectedSubOptions = { ...selectedSubOptions };
    delete newSelectedSubOptions[optionId];
    setSelectedSubOptions(newSelectedSubOptions);
  };

  const handleSubOptionSelect = (
    optionId: string,
    subOption: ProductSubOption
  ) => {
    setSelectedSubOptions({
      ...selectedSubOptions,
      [optionId]: {
        ...selectedSubOptions[optionId],
        [subOption._id]: subOption,
      },
    });
  };

  const handleSubOptionDeselect = (optionId: string, subOptionId: string) => {
    const newSelectedSubOptions = { ...selectedSubOptions };
    if (newSelectedSubOptions[optionId]) {
      delete newSelectedSubOptions[optionId][subOptionId];
      if (Object.keys(newSelectedSubOptions[optionId]).length === 0) {
        delete newSelectedSubOptions[optionId];
      }
    }
    setSelectedSubOptions(newSelectedSubOptions);
  };

  const calculateTotal = () => {
    const basePrice = product?.basePrice || 0;
    const optionsPrice = Object.values(selectedOptions).reduce(
      (sum, option) => sum + option.price,
      0
    );
    const subOptionsPrice = Object.values(selectedSubOptions).reduce(
      (sum, subOptions) =>
        sum +
        Object.values(subOptions).reduce(
          (subSum, subOption) => subSum + subOption.price,
          0
        ),
      0
    );
    const subtotal = basePrice + optionsPrice + subOptionsPrice;
    const total = subtotal + subtotal * (tax / 100) - discount;
    return total.toFixed(2);
  };

  const exportOrder = async () => {
    if (!selectedClient) {
      alert("Por favor seleccione un cliente");
      return;
    }

    const preparedOptions = Object.values(selectedOptions).map((option) => ({
      ...option,
      suboptions: selectedSubOptions[option._id]
        ? Object.values(selectedSubOptions[option._id])
        : [],
    }));

    const order = {
      productId: product?._id,
      productName: product?.name,
      options: preparedOptions,
      total: calculateTotal(),
      discount,
      tax,
      vendedorEmail: session?.user?.email,
      vendedorName: session?.user?.name,
      cliente: selectedClient,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la orden");
      }

      alert("Orden guardada exitosamente");

      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la orden");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{product?.name}</CardTitle>
        <p className="text-muted-foreground">
          Precio Base: ${product?.basePrice}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Opciones:</h3>
            <ScrollArea className="h-[400px] border rounded-md p-4">
              {product?.options.map((option: ProductOption) => (
                <div key={option._id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.name}</span>
                    <span className="text-muted-foreground">
                      ${option.price}
                    </span>
                    <Button
                      variant={
                        selectedOptions[option._id]
                          ? "destructive"
                          : "secondary"
                      }
                      size="sm"
                      onClick={() =>
                        selectedOptions[option._id]
                          ? handleOptionDeselect(option._id)
                          : handleOptionSelect(option)
                      }
                    >
                      {selectedOptions[option._id] ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {selectedOptions[option._id] && option.suboptions && (
                    <div className="ml-4 mt-2 space-y-2">
                      {option.suboptions.map((subOption: ProductSubOption) => (
                        <div
                          key={subOption._id}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div className="flex items-center space-x-2">
                            <img
                              src={subOption.imageUrl}
                              alt={subOption.name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                            <span className="font-medium">
                              {subOption.name}
                            </span>
                          </div>
                          <span className="text-muted-foreground">
                            ${subOption.price}
                          </span>
                          <Button
                            variant={
                              selectedSubOptions[option._id]?.[subOption._id]
                                ? "destructive"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              selectedSubOptions[option._id]?.[subOption._id]
                                ? handleSubOptionDeselect(
                                    option._id,
                                    subOption._id
                                  )
                                : handleSubOptionSelect(option._id, subOption)
                            }
                          >
                            {selectedSubOptions[option._id]?.[subOption._id] ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax">Impuesto (%)</Label>
              <Input
                id="tax"
                type="number"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                placeholder="Impuesto (%)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Descuento</Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="Descuento"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="client">Cliente</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Seleccione un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: any) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold">${calculateTotal()}</span>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={exportOrder}>Crear Orden</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
