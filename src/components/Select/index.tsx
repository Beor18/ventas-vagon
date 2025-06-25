/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

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

interface ColorOption {
  _id: string;
  colorName: string;
  colorCode: string;
  additionalPrice: number;
  imageUrl?: string;
}

interface HouseDesign {
  _id: string;
  designType: string;
  imageUrl: string;
  cost: number;
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
  const [selectedColorOption, setSelectedColorOption] =
    useState<ColorOption | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<HouseDesign | null>(
    null
  );
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [clients, setClients] = useState<any[]>([]);
  const [fabricante, setFabricante] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedFabricante, setSelectedFabricante] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [termsAccepted, setTermsAccepted] = useState(false);
  // const [clarification, setClarification] = useState("");
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const [subOptionComments, setSubOptionComments] = useState<{
    [optionId: string]: { [subOptionId: string]: string };
  }>({});
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
        fetchClients(token);
        fetchFabricante(token);
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

  const fetchFabricante = async (token: string) => {
    const response = await fetch("/api/fabricante", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setFabricante(data);
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
        ...(selectedSubOptions[optionId] || {}),
        [subOption._id]: subOption,
      },
    });

    setSubOptionComments({
      ...subOptionComments,
      [optionId]: {
        ...(subOptionComments[optionId] || {}),
        [subOption._id]: "",
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

  const handleCommentChange = (
    optionId: string,
    subOptionId: string,
    comment: string
  ) => {
    setSubOptionComments({
      ...subOptionComments,
      [optionId]: {
        ...(subOptionComments[optionId] || {}),
        [subOptionId]: comment,
      },
    });
  };

  const handleColorOptionSelect = (colorOption: ColorOption) => {
    setSelectedColorOption(colorOption);
  };

  const handleDesignSelect = (design: HouseDesign) => {
    setSelectedDesign(design);
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
    const colorPrice = selectedColorOption
      ? selectedColorOption.additionalPrice
      : 0;
    const designPrice = selectedDesign ? selectedDesign.cost : 0;
    const subtotal =
      basePrice + optionsPrice + subOptionsPrice + colorPrice + designPrice;
    const total = subtotal + subtotal * (tax / 100) - discount;
    return total.toFixed(2);
  };

  const clearSignature = () => {
    sigCanvasRef.current?.clear();
  };

  const exportOrder = async () => {
    if (!selectedClient) {
      alert("Por favor seleccione un cliente");
      return;
    }

    if (!termsAccepted) {
      alert("Debe aceptar los términos y condiciones");
      return;
    }

    if (sigCanvasRef.current?.isEmpty()) {
      alert("Debe firmar digitalmente");
      return;
    }

    const signatureImage = sigCanvasRef.current?.toDataURL();

    const preparedOptions = Object.values(selectedOptions).map((option) => ({
      ...option,
      suboptions: selectedSubOptions[option._id]
        ? Object.values(selectedSubOptions[option._id]).map((subOption) => ({
            ...subOption,
            comentarios: subOptionComments[option._id]?.[subOption._id] || "",
          }))
        : [],
    }));

    const order = {
      productId: product?._id,
      productName: product?.name,
      options: preparedOptions,
      colorOptions: selectedColorOption ? [selectedColorOption] : [],
      designs: selectedDesign ? [selectedDesign] : [],
      total: calculateTotal(),
      discount,
      tax,
      vendedorEmail: session?.user?.email,
      vendedorName: session?.user?.name,
      fabricanteEmail: selectedFabricante,
      cliente: selectedClient,
      signatureImage: signatureImage,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${accessToken}`,
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

  const openFullScreenImage = (imageUrl: string) => {
    setFullScreenImage(imageUrl);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  return (
    <>
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
                        {option.suboptions.map(
                          (subOption: ProductSubOption) => (
                            <div
                              key={subOption._id}
                              className="flex flex-col space-y-2 p-2 bg-muted rounded-md"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={subOption.imageUrl}
                                    alt={subOption.name}
                                    className="w-10 h-10 rounded-md object-cover cursor-pointer"
                                    onClick={() =>
                                      openFullScreenImage(
                                        subOption.imageUrl || ""
                                      )
                                    }
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
                                    selectedSubOptions[option._id]?.[
                                      subOption._id
                                    ]
                                      ? "destructive"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    selectedSubOptions[option._id]?.[
                                      subOption._id
                                    ]
                                      ? handleSubOptionDeselect(
                                          option._id,
                                          subOption._id
                                        )
                                      : handleSubOptionSelect(
                                          option._id,
                                          subOption
                                        )
                                  }
                                >
                                  {selectedSubOptions[option._id]?.[
                                    subOption._id
                                  ] ? (
                                    <X className="h-4 w-4" />
                                  ) : (
                                    <Plus className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>

                              {selectedSubOptions[option._id]?.[
                                subOption._id
                              ] && (
                                <Textarea
                                  placeholder="Agregar comentarios para esta opción..."
                                  value={
                                    subOptionComments[option._id]?.[
                                      subOption._id
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleCommentChange(
                                      option._id,
                                      subOption._id,
                                      e.target.value
                                    )
                                  }
                                  className="mt-2"
                                />
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Frame Color:</h3>
              <ScrollArea className="h-[200px] border rounded-md p-4">
                {product?.colorOptions?.map((colorOption: ColorOption) => (
                  <div
                    key={colorOption._id}
                    className="mb-2 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={colorOption.imageUrl}
                        alt={colorOption.colorName}
                        className="w-14 h-14 object-cover rounded-md border cursor-pointer"
                        onClick={() =>
                          openFullScreenImage(colorOption.imageUrl || "")
                        }
                      />
                      <span>{colorOption.colorName}</span>
                    </div>
                    <span className="text-muted-foreground">
                      +${colorOption.additionalPrice}
                    </span>
                    <Button
                      variant={
                        selectedColorOption?._id === colorOption._id
                          ? "destructive"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleColorOptionSelect(colorOption)}
                    >
                      {selectedColorOption?._id === colorOption._id
                        ? "Selected"
                        : "Select"}
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">House Designs:</h3>
              <ScrollArea className="h-[200px] border rounded-md p-4">
                {product?.designs?.map((design: HouseDesign) => (
                  <div
                    key={design._id}
                    className="mb-2 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={design.imageUrl}
                        alt={design.designType}
                        className="w-14 h-14 object-cover rounded-md cursor-pointer"
                        onClick={() =>
                          openFullScreenImage(design.imageUrl || "")
                        }
                      />
                      <span>{design.designType}</span>
                    </div>
                    <span className="text-muted-foreground">
                      +${design.cost}
                    </span>
                    <Button
                      variant={
                        selectedDesign?._id === design._id
                          ? "destructive"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleDesignSelect(design)}
                    >
                      {selectedDesign?._id === design._id
                        ? "Selected"
                        : "Select"}
                    </Button>
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
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                >
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
                    {fabricante.map((client: any) => (
                      <SelectItem key={client._id} value={client.email}>
                        {client.name}
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
            <Separator />
            {/* Casillero de términos y condiciones y firma digital */}
            <div className="space-y-4">
              <div className="flex flex-row gap-2 items-center">
                <Checkbox
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setTermsAccepted(checked === true)
                  }
                  id="terms"
                />
                <Label htmlFor="terms">Acepto los términos y condiciones</Label>
              </div>

              <div className="space-y-2">
                <Label>Firma digital</Label>
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="black"
                  canvasProps={{
                    width: 500,
                    height: 150,
                    className: "border rounded-md",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                  }}
                />
                <Button variant="outline" onClick={clearSignature}>
                  Limpiar firma
                </Button>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="clarification">Aclaración</Label>
                <Input
                  id="clarification"
                  type="text"
                  value={clarification}
                  onChange={(e) => setClarification(e.target.value)}
                  placeholder="Ingrese su nombre"
                />
              </div> */}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={exportOrder}>Crear Orden</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agregar el modal para imagen en pantalla completa */}
      <Dialog open={!!fullScreenImage} onOpenChange={closeFullScreenImage}>
        <DialogContent className="max-w-[80vw] max-h-[80vh] p-4">
          <DialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-white shadow-md">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {fullScreenImage && (
            <div className="flex items-center justify-center w-full h-full">
              <img
                src={fullScreenImage}
                alt="Full size image"
                className="max-w-full max-h-full object-contain rounded-md"
                style={{
                  maxWidth: "100%",
                  maxHeight: "calc(80vh - 2rem)",
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
