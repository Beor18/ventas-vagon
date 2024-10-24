/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { connectToDatabase } from "../lib/mongodb";
import Product from "../models/Product";
import Modal from "@/components/Modal";
import SelectComponent from "@/components/Select";
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
  Download,
  FileText,
  FileSpreadsheet,
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
import { OrderDetail } from "@/components/OrderDetails";
import InsurancePolicies from "@/components/Insurance";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
      });
      fetchOrders();
      fetchClients();
    }
  }, [session]);

  // const handleDownloadOrder = (order: any) => {
  //   const orderString = JSON.stringify(order, null, 2);
  //   const blob = new Blob([orderString], { type: "application/json" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = `order_${order._id}.json`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleExportToPDF = async (order: any) => {
    const doc = new jsPDF();
    let yOffset = 10;

    // Helper function to add text
    const addText = (text: string, y: number, fontSize = 12) => {
      doc.setFontSize(fontSize);
      doc.text(text, 10, y);
      return doc.getTextDimensions(text).h + 2;
    };

    // Helper function to add image
    const addImage = async (
      url: string,
      y: number,
      maxWidth = 180,
      maxHeight = 100
    ) => {
      try {
        const img = await loadImage(url);
        const imgProps = doc.getImageProperties(img);
        const width = Math.min(maxWidth, imgProps.width);
        const height = (imgProps.height * width) / imgProps.width;
        doc.addImage(img, "JPEG", 10, y, width, Math.min(height, maxHeight));
        return Math.min(height, maxHeight) + 5;
      } catch (error) {
        console.error("Error loading image:", error);
        return 0;
      }
    };

    // Helper function to load image
    const loadImage = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg"));
        };
        img.onerror = reject;
        img.src = url;
      });
    };

    // Title
    yOffset += addText(`Order Details: ${order.productName}`, yOffset, 18);
    yOffset += 10;

    // Order Information
    const orderInfo = [
      { label: "Total", value: `$${order.total}` },
      { label: "Discount", value: `$${order.discount}` },
      { label: "Tax", value: `${order.tax}%` },
      { label: "Status", value: order.status },
      { label: "Vendor", value: order.vendedorName },
      { label: "Vendor Email", value: order.vendedorEmail },
    ];

    autoTable(doc, {
      startY: yOffset,
      head: [["Field", "Value"]],
      body: orderInfo.map((info) => [info.label, info.value]),
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    yOffset = (doc as any).lastAutoTable.finalY + 10;

    // Client Information
    if (order.cliente) {
      yOffset += addText("Client Information", yOffset, 14);
      const clientInfo = [
        { label: "Name", value: order.cliente.nombre },
        { label: "Email", value: order.cliente.email },
        { label: "Phone", value: order.cliente.telefono },
        { label: "Address", value: order.cliente.direccion_residencial },
        { label: "Unit Address", value: order.cliente.direccion_unidad },
        { label: "Land Owner", value: order.cliente.propietario_terreno },
        { label: "Unit Purpose", value: order.cliente.proposito_unidad },
        { label: "Marital Status", value: order.cliente.estado_civil },
        { label: "Workplace", value: order.cliente.lugar_empleo },
        { label: "ID", value: order.cliente.identificacion },
        { label: "Payment Method", value: order.cliente.forma_pago },
        {
          label: "Reference Contact",
          value: order.cliente.contacto_referencia,
        },
        {
          label: "Insurance Purchased",
          value: order.cliente.seguro_comprado ? "Yes" : "No",
        },
      ];

      autoTable(doc, {
        startY: yOffset + 5,
        head: [["Field", "Value"]],
        body: clientInfo.map((info) => [info.label, info.value]),
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5 },
      });

      yOffset = (doc as any).lastAutoTable.finalY + 10;
    }

    // Options
    if (order.options && order.options.length > 0) {
      yOffset += addText("Options", yOffset, 14);
      for (const option of order.options) {
        autoTable(doc, {
          startY: yOffset + 5,
          head: [[option.name]],
          body: [
            ["Price", `$${option.price}`],
            ["Type", option.type],
            ["Specification", option.specification],
            ["Pieces", option.pcs.toString()],
          ],
          theme: "striped",
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          styles: { fontSize: 10, cellPadding: 5 },
        });

        yOffset = (doc as any).lastAutoTable.finalY + 5;

        if (option.imageUrl) {
          yOffset += await addImage(option.imageUrl, yOffset);
        }

        if (option.suboptions && option.suboptions.length > 0) {
          autoTable(doc, {
            startY: yOffset + 5,
            head: [["Suboption", "Code", "Price", "Details"]],
            body: option.suboptions.map((suboption: any) => [
              suboption.name,
              suboption.code,
              `$${suboption.price}`,
              suboption.details,
            ]),
            theme: "striped",
            headStyles: { fillColor: [52, 152, 219], textColor: 255 },
            styles: { fontSize: 9, cellPadding: 3 },
          });

          yOffset = (doc as any).lastAutoTable.finalY + 5;

          for (const suboption of option.suboptions) {
            if (suboption.imageUrl) {
              yOffset += await addImage(suboption.imageUrl, yOffset, 90, 50);
            }
          }
        }

        if (yOffset > 270) {
          doc.addPage();
          yOffset = 10;
        }
      }
    }

    // Designs
    if (order.designs && order.designs.length > 0) {
      yOffset += addText("Designs", yOffset, 14);
      autoTable(doc, {
        startY: yOffset + 5,
        head: [["Design Type", "Cost"]],
        body: order.designs.map((design: any) => [
          design.designType,
          `$${design.cost}`,
        ]),
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5 },
      });

      yOffset = (doc as any).lastAutoTable.finalY + 5;

      for (const design of order.designs) {
        if (design.imageUrl) {
          yOffset += await addImage(design.imageUrl, yOffset);
        }
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 10;
        }
      }
    }

    // Comments
    if (order.comentaries) {
      yOffset += addText("Comments", yOffset, 14);
      autoTable(doc, {
        startY: yOffset + 5,
        body: [[order.comentaries]],
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 5 },
      });
    }

    doc.save(`order_${order._id}.pdf`);
  };

  const handleExportToCSV = (order: any) => {
    const replacer = (key: string, value: any) => (value === null ? "" : value);
    const header = Object.keys(order);
    const csv = [
      header.join(","),
      Object.values(order)
        .map((v) =>
          typeof v === "object"
            ? JSON.stringify(v, replacer)
            : v !== null
            ? v
            : ""
        )
        .join(","),
    ].join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `order_${order._id}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const openClientFormModal = (client = null) => {
    setCurrentClient(client);
    setIsClientFormModalOpen(true);
  };

  const closeClientFormModal = () => {
    setIsClientFormModalOpen(false);
    setCurrentClient(null);
  };

  const editClient = (client: any) => {
    setCurrentClient(client);
    setIsClientFormModalOpen(true);
  };

  const handleOpenOrderDetail = (order) => {
    const product = products.find((p) => p._id === order.productId);
    setSelectedOrder({ ...order, product });
    setIsOrderDetailOpen(true);
  };

  const handleCloseOrderDetail = () => {
    setIsOrderDetailOpen(false);
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

  // const openOrderDetail = (order: any) => {
  //   const product = products.find((p) => p._id === order.productId);
  //   setSelectedOrder({ ...order, product });
  // };

  // const closeOrderDetail = () => {
  //   setSelectedOrder(null);
  // };

  const openFullScreenImage = (src: string) => {
    setFullScreenImage(src);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-12">
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
          <TabsTrigger value="insurance">Seguros</TabsTrigger>
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
                        <div className="flex space-x-2 mt-4">
                          <Button onClick={() => handleOpenOrderDetail(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </Button>
                          {/* <Button onClick={() => handleDownloadOrder(order)}>
                            <Download className="mr-2 h-4 w-4" />
                            Descargar
                          </Button> */}
                          <Button onClick={() => handleExportToPDF(order)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Exportar a PDF
                          </Button>
                          {/* <Button onClick={() => handleExportToCSV(order)}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Exportar a CSV
                          </Button> */}
                        </div>
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
              <Button onClick={() => openClientFormModal()}>
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
                            onClick={() => openClientFormModal(client)}
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
        <TabsContent value="insurance">
          <InsurancePolicies />
        </TabsContent>
      </Tabs>

      {selectedProduct && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <SelectComponent product={selectedProduct} onClose={closeModal} />
        </Modal>
      )}

      {isClientFormModalOpen && (
        <Modal isOpen={isClientFormModalOpen} onClose={closeClientFormModal}>
          <ClientForm
            onSubmit={currentClient ? handleUpdateClient : handleCreateClient}
            initialClientData={currentClient}
          />
        </Modal>
      )}

      <OrderDetail
        isOpen={isOrderDetailOpen}
        onClose={handleCloseOrderDetail}
        order={selectedOrder}
        openFullScreenImage={openFullScreenImage}
      />

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
