/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import withAuth from "@/lib/withAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { FileText } from "lucide-react";

import { format } from "date-fns";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

function Manufacture() {
  const [orders, setOrders] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const openDialog = (order: any) => {
    handleViewOrder(order);
  };

  const closeDialog = () => {
    setSelectedOrder(null);
    setShowDialog(false);
    setShowCommentInput(false);
    setComment("");
  };

  useEffect(() => {
    if (session) {
      fetchAccessToken().then((token) => {
        setAccessToken(token);
      });
    }
  }, [session]);

  useEffect(() => {
    if (accessToken && session?.user?.email) {
      fetch(`/api/orders?fabricanteEmail=${session?.user?.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setOrders(data)); // `data` será un array filtrado de órdenes
    }
  }, [accessToken, session?.user?.email]);

  const fetchProductDetails = async (productId: string) => {
    const res = await fetch(`/api/products/${productId}`);
    const product = await res.json();
    return product;
  };

  const handleExportToPDF = async (order: any) => {
    const doc = new jsPDF();
    let yOffset = 10;

    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;

    // Helper function to add text
    const addText = (
      text: string,
      y: number,
      fontSize = 12,
      align: "left" | "center" | "right" = "left",
      color = "#000000"
    ) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color);
      doc.text(
        text,
        align === "center" ? doc.internal.pageSize.width / 2 : 10,
        y,
        { align }
      );
      return doc.getTextDimensions(text).h + 2;
    };

    // Helper function to check if there's enough space on the current page
    const checkSpace = (height: number) => {
      if (yOffset + height > pageHeight - margin) {
        doc.addPage();
        yOffset = margin;
        return true;
      }
      return false;
    };

    // Helper function to add image
    const addImage = async (
      url: string,
      y: number,
      maxWidth = 180,
      maxHeight = 140
    ) => {
      try {
        const img = await loadImage(url);
        const imgProps = doc.getImageProperties(img);

        let width = imgProps.width;
        let height = imgProps.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }

        // Check if image fits on current page, if not, add a new page
        if (checkSpace(height + 10)) {
          y = yOffset;
        }

        const xOffset = (doc.internal.pageSize.width - width) / 2;
        doc.addImage(img, "JPEG", xOffset, y, width, height);
        return height + 10;
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

    // Add header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");
    yOffset += addText("Order Details", 25, 24, "center", "#FFFFFF");
    yOffset += addText(`Order ID: ${order._id}`, 35, 12, "center", "#FFFFFF");
    yOffset += 20;

    // Add order information
    yOffset += addText("Order Information", yOffset, 18, "left", "#2980b9");
    yOffset += 5;

    const orderInfo = [
      { label: "Product Name", value: order.productName || "N/A" },
      { label: "Status", value: order.status || "N/A" },
      { label: "Vendor", value: order.vendedorName || "N/A" },
      { label: "Vendor Email", value: order.vendedorEmail || "N/A" },
      {
        label: "Order Date",
        value: format(new Date(order.createdAt), "PPpp") || "N/A",
      },
    ];

    autoTable(doc, {
      startY: yOffset,
      head: [["Field", "Value"]],
      body: orderInfo.map((info) => [info.label, info.value]),
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { fillColor: [245, 245, 245] },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 5 },
      didDrawPage: (data) => {
        yOffset = data.cursor.y + 10;
      },
    });

    // Add client information
    // if (order.cliente) {
    //   checkSpace(30);
    //   yOffset += addText("Client Information", yOffset, 18, "left", "#2980b9");
    //   yOffset += 5;

    //   const clientInfo = [
    //     { label: "Name", value: order.cliente.nombre || "N/A" },
    //     { label: "Email", value: order.cliente.email || "N/A" },
    //     { label: "Phone", value: order.cliente.telefono || "N/A" },
    //     {
    //       label: "Address",
    //       value: order.cliente.direccion_residencial || "N/A",
    //     },
    //     {
    //       label: "Unit Address",
    //       value: order.cliente.direccion_unidad || "N/A",
    //     },
    //     {
    //       label: "Land Owner",
    //       value: order.cliente.propietario_terreno || "N/A",
    //     },
    //     {
    //       label: "Unit Purpose",
    //       value: order.cliente.proposito_unidad || "N/A",
    //     },
    //     { label: "Marital Status", value: order.cliente.estado_civil || "N/A" },
    //     { label: "Workplace", value: order.cliente.lugar_empleo || "N/A" },
    //     { label: "Payment Method", value: order.cliente.forma_pago || "N/A" },
    //     {
    //       label: "Reference Contact",
    //       value: order.cliente.contacto_referencia || "N/A",
    //     },
    //     {
    //       label: "Insurance Purchased",
    //       value: order.cliente.seguro_comprado ? "Yes" : "No",
    //     },
    //   ];

    //   autoTable(doc, {
    //     startY: yOffset,
    //     head: [["Field", "Value"]],
    //     body: clientInfo.map((info) => [info.label, info.value]),
    //     theme: "striped",
    //     headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    //     bodyStyles: { fillColor: [245, 245, 245] },
    //     alternateRowStyles: { fillColor: [255, 255, 255] },
    //     styles: { fontSize: 10, cellPadding: 5 },
    //     didDrawPage: (data) => {
    //       yOffset = data.cursor.y + 10;
    //     },
    //   });
    // }

    // Add options
    if (order.options && order.options.length > 0) {
      checkSpace(30);
      yOffset += addText("Options", yOffset, 18, "left", "#2980b9");
      yOffset += 5;

      for (const option of order.options) {
        checkSpace(20);
        autoTable(doc, {
          startY: yOffset,
          head: [[option.name || "N/A"]],
          theme: "striped",
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          styles: { fontSize: 10, cellPadding: 5 },
          didDrawPage: (data) => {
            yOffset = data.cursor.y + 5;
          },
        });

        if (option.suboptions && option.suboptions.length > 0) {
          checkSpace(20);
          autoTable(doc, {
            startY: yOffset,
            head: [["Suboption", "Code", "Details"]],
            body: option.suboptions.map((suboption: any) => [
              suboption.name || "N/A",
              suboption.code || "N/A",
              suboption.details || "N/A",
            ]),
            theme: "striped",
            headStyles: { fillColor: [52, 152, 219], textColor: 255 },
            bodyStyles: { fillColor: [245, 245, 245] },
            alternateRowStyles: { fillColor: [255, 255, 255] },
            styles: { fontSize: 9, cellPadding: 3 },
            didDrawPage: (data) => {
              yOffset = data.cursor.y + 5;
            },
          });

          for (const suboption of option.suboptions) {
            if (suboption.imageUrl) {
              checkSpace(60);
              yOffset += await addImage(suboption.imageUrl, yOffset, 90, 50);
            }
          }
        }
      }
    }

    // Add designs
    if (order.designs && order.designs.length > 0) {
      checkSpace(30);
      yOffset += addText("Designs", yOffset, 18, "left", "#2980b9");
      yOffset += 5;

      autoTable(doc, {
        startY: yOffset,
        head: [["Design Type"]],
        body: order.designs.map((design: any) => [design.designType || "N/A"]),
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        bodyStyles: { fillColor: [245, 245, 245] },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 5 },
        didDrawPage: (data) => {
          yOffset = data.cursor.y + 5;
        },
      });

      for (const design of order.designs) {
        if (design.imageUrl) {
          checkSpace(150);
          yOffset += await addImage(design.imageUrl, yOffset, 180, 140);
        }
      }
    }

    // Add comments
    if (order.comentaries) {
      checkSpace(30);
      yOffset += addText("Comments", yOffset, 18, "left", "#2980b9");
      yOffset += 5;

      autoTable(doc, {
        startY: yOffset,
        body: [[order.comentaries || "N/A"]],
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 5 },
        didDrawPage: (data) => {
          yOffset = data.cursor.y + 10;
        },
      });
    }

    // Add signature
    if (order.signatureImage) {
      checkSpace(70);
      yOffset += addText("Signature", yOffset, 18, "left", "#2980b9");
      yOffset += 5;
      doc.addImage(order.signatureImage, "PNG", 10, yOffset, 150, 50);
      yOffset += 55;
    }

    // Add footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(41, 128, 185);
      doc.rect(0, pageHeight - 20, doc.internal.pageSize.width, 20, "F");
      addText(
        `Generated on ${format(
          new Date(),
          "PPpp"
        )} - Page ${i} of ${pageCount}`,
        pageHeight - 10,
        10,
        "center",
        "#FFFFFF"
      );
    }

    doc.save(`order_${order._id}.pdf`);
  };

  const markAsRead = (orderId: any) => {
    if (accessToken) {
      fetch(`/api/orders/${orderId}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((updatedOrder) => {
          setOrders(
            orders.map((order: any) =>
              order._id === orderId ? updatedOrder : order
            )
          );
        });
    }
  };

  const approveOrder = (orderId: any) => {
    if (accessToken) {
      fetch(`/api/orders/${orderId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((updatedOrder) => {
          setOrders(
            orders.map((order: any) =>
              order._id === orderId ? updatedOrder : order
            )
          );
          closeDialog();
        });
    }
  };

  const rejectOrder = (orderId: any) => {
    if (accessToken) {
      fetch(`/api/orders/${orderId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ comentaries: comment }),
      })
        .then((res) => res.json())
        .then((updatedOrder) => {
          setOrders(
            orders.map((order: any) =>
              order._id === orderId ? updatedOrder : order
            )
          );
          closeDialog();
        });
    }
  };

  const handleViewOrder = async (order: any) => {
    const productDetails = await fetchProductDetails(order.productId);
    setSelectedOrder({ ...order, productDetails });
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto py-4 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Manufacture Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{order.productName}</h2>
              <p>Status: {order.status}</p>
              <p>Customer: {order.vendedorName}</p>
              <div className="flex flex-row gap-4 items-center mt-4">
                <Button
                  className="flex items-center"
                  onClick={() => openDialog(order)}
                >
                  Ver Orden
                </Button>

                <Button
                  className="flex items-center"
                  onClick={() => handleExportToPDF(order)}
                >
                  <FileText className="h-4 w-4" />
                  Exportar a PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Orden: {selectedOrder?._id}</DialogTitle>
            <DialogDescription>Detalles de la orden</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell>{selectedOrder.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer</TableCell>
                    <TableCell>{selectedOrder.vendedorName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{selectedOrder.vendedorEmail}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Comentarios</TableCell>
                    <TableCell>
                      {selectedOrder.comentaries ||
                        "No hay comentarios disponibles"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Producto</TableCell>
                    <TableCell>
                      <img
                        src={selectedOrder.productDetails.imageUrl}
                        alt={selectedOrder.productDetails.name}
                        width={320}
                        height={240}
                        className="w-[320px] h-auto mb-4"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Nombre</TableCell>
                    <TableCell>{selectedOrder.productDetails.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Descripción</TableCell>
                    <TableCell>
                      {selectedOrder.productDetails.description ||
                        "No hay descripción disponible"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Dimensiones externas
                    </TableCell>
                    <TableCell>
                      {selectedOrder.productDetails.externalDimensions ||
                        "No hay dimensiones externas disponibles"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Dimensiones internas
                    </TableCell>
                    <TableCell>
                      {selectedOrder.productDetails.internalDimensions ||
                        "No hay dimensiones internas disponibles"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex gap-4 mt-4">
                <Button onClick={() => approveOrder(selectedOrder._id)}>
                  Aprobar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowCommentInput((prev) => !prev)}
                >
                  Cancelar orden
                </Button>
              </div>
              {showCommentInput && (
                <div className="mt-4">
                  <Textarea
                    className="w-full p-2 border rounded-md"
                    placeholder="Añadir comentarios"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    variant="destructive"
                    className="mt-2"
                    onClick={() => rejectOrder(selectedOrder._id)}
                  >
                    Confirmar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

async function fetchAccessToken() {
  const response = await fetch("/api/jwt");
  const data = await response.json();
  return data.accessToken;
}

export default withAuth(Manufacture, ["Administrador", "Fabricante"]);
