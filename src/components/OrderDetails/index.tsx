/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OrderDetailProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  openFullScreenImage?: (imageUrl: string) => void;
}

export function OrderDetail({
  isOpen,
  onClose,
  order,
  openFullScreenImage,
}: OrderDetailProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalle de la Orden</DialogTitle>
          <DialogDescription>
            Información detallada de la orden seleccionada.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={order.product?.imageUrl || "/placeholder.png"}
                    alt={order.productName}
                    className="rounded-md object-cover w-full h-full cursor-pointer"
                    onClick={() =>
                      openFullScreenImage(
                        order.product?.imageUrl || "/placeholder.png"
                      )
                    }
                  />
                </div>
                <h3 className="text-xl font-semibold uppercase">
                  {order.productName}
                </h3>
                <p className="text-gray-600">{order.product?.description}</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Total precio:</p>
                    <p>${order.total}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Descuento:</p>
                    <p>{order.discount} USD</p>
                  </div>
                  <div>
                    <p className="font-semibold">Tax:</p>
                    <p>{order.tax}%</p>
                  </div>
                  <div>
                    <p className="font-semibold">Status:</p>
                    <p>{order.status}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Vendedor:</p>
                    <p>{order.vendedorName}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Cliente:</p>
                    <p>{order.cliente?.nombre || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Comentarios:</p>
                  <p>
                    {order.comentaries === "" ? (
                      <span className="italic">Todavía sin comentarios</span>
                    ) : (
                      order.comentaries
                    )}
                  </p>
                </div>
              </div>
            </div>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="options">
                <AccordionTrigger>Opciones seleccionadas</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    {order.options && order.options.length > 0 ? (
                      order.options.map((option: any, index: number) => (
                        <div key={index} className="mb-4 p-4 border rounded-md">
                          <h4 className="font-semibold text-lg mb-2">
                            {option.name}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            <p>
                              <span className="font-medium">Precio:</span> $
                              {option.price}
                            </p>
                            <p>
                              <span className="font-medium">Tipo:</span>{" "}
                              {option.type || "N/A"}
                            </p>
                            <p>
                              <span className="font-medium">
                                Especificación:
                              </span>
                              {option.specification || "N/A"}
                            </p>
                            <p>
                              <span className="font-medium">Piezas:</span>{" "}
                              {option.pcs || "N/A"}
                            </p>
                          </div>
                          {option.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={option.imageUrl}
                                alt={option.name}
                                className="rounded-md w-24 h-24 object-cover cursor-pointer"
                                onClick={() =>
                                  openFullScreenImage(option.imageUrl)
                                }
                              />
                            </div>
                          )}
                          {option.suboptions &&
                            option.suboptions.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-semibold mb-2">
                                  Subopciones:
                                </h5>
                                {option.suboptions.map(
                                  (suboption: any, subIndex: number) => (
                                    <div
                                      key={subIndex}
                                      className="ml-4 mb-2 p-2 border-l"
                                    >
                                      <p>
                                        <span className="font-medium">
                                          Nombre:
                                        </span>{" "}
                                        {suboption.name}
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Código:
                                        </span>{" "}
                                        {suboption.code}
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Precio:
                                        </span>{" "}
                                        ${suboption.price}
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Detalles:
                                        </span>{" "}
                                        {suboption.details || "N/A"}
                                      </p>
                                      {suboption.imageUrl && (
                                        <div className="mt-2">
                                          <img
                                            src={suboption.imageUrl}
                                            alt={suboption.name}
                                            className="rounded-md w-20 h-20 object-cover cursor-pointer"
                                            onClick={() =>
                                              openFullScreenImage(
                                                suboption.imageUrl
                                              )
                                            }
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      ))
                    ) : (
                      <p>No hay opciones seleccionadas para esta orden.</p>
                    )}
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="colorOptions">
                <AccordionTrigger>Opción de Color</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    {order.colorOptions && order.colorOptions.length > 0 ? (
                      order.colorOptions.map(
                        (colorOption: any, index: number) => (
                          <div
                            key={index}
                            className="mb-4 p-4 border rounded-md"
                          >
                            <h4 className="font-semibold text-lg mb-2">
                              {colorOption.colorName}
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              <p>
                                <span className="font-medium">
                                  Código de Color:
                                </span>{" "}
                                {colorOption.colorCode}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Precio Adicional:
                                </span>{" "}
                                ${colorOption.additionalPrice}
                              </p>
                            </div>
                            {colorOption.imageUrl && (
                              <div className="mt-2">
                                <img
                                  src={colorOption.imageUrl}
                                  alt={colorOption.colorName}
                                  className="rounded-md w-24 h-24 object-cover cursor-pointer"
                                  onClick={() =>
                                    openFullScreenImage(colorOption.imageUrl)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <p>
                        No hay opción de color seleccionada para esta orden.
                      </p>
                    )}
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="designs">
                <AccordionTrigger>Diseño de Casa</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    {order.designs && order.designs.length > 0 ? (
                      order.designs.map((design: any, index: number) => (
                        <div key={index} className="mb-4 p-4 border rounded-md">
                          <h4 className="font-semibold text-lg mb-2">
                            {design.designType}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            <p>
                              <span className="font-medium">Costo:</span> $
                              {design.cost}
                            </p>
                          </div>
                          {design.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={design.imageUrl}
                                alt={design.designType}
                                className="rounded-md w-24 h-24 object-cover cursor-pointer"
                                onClick={() =>
                                  openFullScreenImage(design.imageUrl)
                                }
                              />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No hay diseño de casa seleccionado para esta orden.</p>
                    )}
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div>
              {order.signatureImage ? (
                <img
                  src={order.signatureImage}
                  alt="Firma del cliente"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              ) : (
                <p>No hay firma disponible</p>
              )}
            </div>
          </div>
        </ScrollArea>
        <DialogClose asChild>
          <Button onClick={onClose} className="mt-4">
            <X className="mr-2 h-4 w-4" />
            Cerrar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
