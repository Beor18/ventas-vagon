/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { connectToDatabase } from "../lib/mongodb";
import Product from "../models/Product";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import withAuth from "../lib/withAuth";
import ClientForm from "@/components/ClientForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Users,
  ClipboardList,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
} from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface FullScreenImageProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({
  src,
  alt,
  onClose,
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[50vw] max-h-[90vh] p-0 overflow-hidden bg-opacity-90">
        <div className="relative w-full h-full flex items-center justify-center">
          <DialogClose className="absolute top-2 right-2 z-10">
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

function Seller({ products }: { products: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("orders");
  const [isClientFormModalOpen, setIsClientFormModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
      });
      fetchOrders();
      fetchClients();
    }
  }, [session]);

  const fetchAccessToken = async () => {
    const response = await fetch("/api/jwt");
    const data = await response.json();
    return data.accessToken;
  };

  const fetchOrders = async () => {
    const response = await fetch("/api/orders", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setOrders(data);
  };

  const fetchClients = async () => {
    const response = await fetch("/api/client", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setClients(data);
  };

  const handleCreateClient = async (client: any) => {
    try {
      const response = await fetch("/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...client, vendedor: session?.user?.email }),
      });

      if (response.ok) {
        fetchClients();
        setIsClientFormModalOpen(false);
      } else {
        console.error("Failed to create client");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const response = await fetch(`/api/client?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        fetchClients();
      } else {
        console.error("Failed to delete client");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (product: any) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const editClient = (client: any) => {
    setCurrentClient(client);
    setIsClientFormModalOpen(true);
  };

  const handleUpdateClient = async (client: any) => {
    try {
      const response = await fetch(`/api/client?id=${client._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(client),
      });

      if (response.ok) {
        fetchClients();
        setIsClientFormModalOpen(false);
        setCurrentClient(null);
      } else {
        console.error("Failed to update client");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openOrderDetail = (order: any) => {
    const product = products.find((p) => p._id === order.productId);
    setSelectedOrder({ ...order, product });
  };

  const closeOrderDetail = () => {
    setSelectedOrder(null);
  };

  const openFullScreenImage = (src: string) => {
    setFullScreenImage(src);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">
            <ClipboardList className="mr-2 h-4 w-4" />
            Mis Órdenes
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="mr-2 h-4 w-4" />
            Lista de Productos
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="mr-2 h-4 w-4" />
            Mis Clientes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Mis Órdenes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter(
                    (order: any) => order.vendedorEmail === session?.user?.email
                  )
                  .map((order: any) => (
                    <Card key={order._id}>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold uppercase mb-2">
                          {order.productName}
                        </h3>
                        <p>Total precio: ${order.total}</p>
                        <p>Descuento: {order.discount}%</p>
                        <p>Tax: {order.tax}%</p>
                        <p>Status: {order.status}</p>
                        <p className="mt-2 pt-2 border-t">
                          Vendedor: {order.vendedorName}
                        </p>
                        <p>Cliente: {order.cliente?.nombre || "N/A"}</p>
                        <p>
                          Comentarios:{" "}
                          {order.comentaries === "" ? (
                            <span className="font-bold">
                              Todavía sin comentarios!
                            </span>
                          ) : (
                            order.comentaries
                          )}
                        </p>
                        <Button
                          className="mt-4"
                          onClick={() => openOrderDetail(order)}
                        >
                          Ver detalle de la orden
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product: any) => (
                  <Card key={product._id}>
                    <CardContent className="p-6">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="rounded-md object-cover w-full h-full"
                        />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {product.description}
                      </p>
                      <p className="text-sm font-semibold mb-4">
                        USD {product.basePrice}
                      </p>
                      <Button
                        onClick={() => openModal(product)}
                        className="w-full"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Producto
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clients">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mis Clientes</CardTitle>
              <Button onClick={() => setIsClientFormModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Nuevo Cliente
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.map((client: any) => (
                  <Card key={client._id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            {client.nombre}
                          </h3>
                          <p>Email: {client.email}</p>
                          <p>Teléfono: {client.telefono}</p>
                          <p>Dirección: {client.direccion_residencial}</p>
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editClient(client)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClient(client._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedProduct && (
        <Modal onClose={closeModal}>
          <Select product={selectedProduct} onClose={closeModal} />
        </Modal>
      )}

      {isClientFormModalOpen && (
        <Modal onClose={() => setIsClientFormModalOpen(false)}>
          <ClientForm
            onSubmit={currentClient ? handleUpdateClient : handleCreateClient}
            initialClientData={currentClient}
          />
        </Modal>
      )}

      <Dialog open={!!selectedOrder} onOpenChange={closeOrderDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Detalle de la Orden</DialogTitle>
            <DialogDescription>
              Información detallada de la orden seleccionada.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <ScrollArea className="flex-grow">
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={
                        selectedOrder.product?.imageUrl || "/placeholder.png"
                      }
                      alt={selectedOrder.productName}
                      className="rounded-md object-cover w-full h-full cursor-pointer"
                      onClick={() =>
                        openFullScreenImage(
                          selectedOrder.product?.imageUrl || "/placeholder.png"
                        )
                      }
                    />
                  </div>
                  <h3 className="text-xl font-semibold uppercase">
                    {selectedOrder.productName}
                  </h3>
                  <p className="text-gray-600">
                    {selectedOrder.product?.description}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Total precio:</p>
                      <p>${selectedOrder.total}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Descuento:</p>
                      <p>{selectedOrder.discount}%</p>
                    </div>
                    <div>
                      <p className="font-semibold">Tax:</p>
                      <p>{selectedOrder.tax}%</p>
                    </div>
                    <div>
                      <p className="font-semibold">Status:</p>
                      <p>{selectedOrder.status}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Vendedor:</p>
                      <p>{selectedOrder.vendedorName}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Cliente:</p>
                      <p>{selectedOrder.cliente?.nombre || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Comentarios:</p>
                    <p>
                      {selectedOrder.comentaries === "" ? (
                        <span className="italic">Todavía sin comentarios</span>
                      ) : (
                        selectedOrder.comentaries
                      )}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="options">
                      <AccordionTrigger>
                        Opciones seleccionadas
                      </AccordionTrigger>
                      <AccordionContent>
                        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                          {selectedOrder.options &&
                          selectedOrder.options.length > 0 ? (
                            selectedOrder.options.map(
                              (option: any, index: number) => (
                                <div
                                  key={index}
                                  className="mb-4 p-4 border rounded-md"
                                >
                                  <h4 className="font-semibold text-lg mb-2">
                                    {option.name}
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    <p>
                                      <span className="font-medium">
                                        Precio:
                                      </span>{" "}
                                      ${option.price}
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
                                      <span className="font-medium">
                                        Piezas:
                                      </span>{" "}
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
                                          (
                                            suboption: any,
                                            subIndex: number
                                          ) => (
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
                              )
                            )
                          ) : (
                            <p>
                              No hay opciones seleccionadas para esta orden.
                            </p>
                          )}
                        </ScrollArea>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogClose asChild>
            <Button className="mt-4">
              <X className="mr-2 h-4 w-4" />
              Cerrar
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {fullScreenImage && (
        <FullScreenImage
          src={fullScreenImage}
          alt="Full screen image"
          onClose={closeFullScreenImage}
        />
      )}
    </div>
  );
}

export async function getServerSideProps() {
  await connectToDatabase();
  const products = await Product.find().lean();
  return { props: { products: JSON.parse(JSON.stringify(products)) } };
}

export default withAuth(Seller, ["Administrador", "Vendedor"]);
