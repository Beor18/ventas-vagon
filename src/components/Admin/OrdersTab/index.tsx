import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderType {
  _id: string;
  productName: string;
  total: number;
  discount: number;
  tax: number;
  status: string;
  vendedorName: string;
  cliente?: {
    nombre: string;
  };
  comentaries: string;
}

interface OrdersTabProps {
  orders: OrderType[];
  deleteOrder: (id: string) => void;
}

declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

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
    maxHeight = 140 // Limit to half of the page height
  ) => {
    try {
      const img = await loadImage(url);
      const imgProps = doc.getImageProperties(img);

      // Calculate width and height to maintain aspect ratio within max dimensions
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

      // Ensure image won't be cut off at the bottom of the page
      if (y + height > doc.internal.pageSize.height - 10) {
        doc.addPage();
        y = 10;
      }

      // Center image horizontally
      const xOffset = (doc.internal.pageSize.width - width) / 2;
      doc.addImage(img, "JPEG", xOffset, y, width, height);
      return height + 5;
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
  yOffset += addText(
    `Order Details: ${order.productName || "NA"}`,
    yOffset,
    18
  );
  yOffset += 10;

  // Order Information
  const orderInfo = [
    { label: "Status", value: order.status || "NA" },
    { label: "Vendor", value: order.vendedorName || "NA" },
    { label: "Vendor Email", value: order.vendedorEmail || "NA" },
  ];

  autoTable(doc, {
    startY: yOffset,
    head: [["Field", "Value"]],
    body: orderInfo.map((info) => [info.label, info.value]),
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 5 },
  });

  yOffset = (doc as any).lastAutoTable.finalY + 5;

  // Client Information
  if (order.cliente) {
    yOffset += addText("Client Information", yOffset, 14);
    const clientInfo = [
      { label: "Name", value: order.cliente.nombre || "NA" },
      { label: "Email", value: order.cliente.email || "NA" },
      { label: "Phone", value: order.cliente.telefono || "NA" },
      { label: "Address", value: order.cliente.direccion_residencial || "NA" },
      { label: "Unit Address", value: order.cliente.direccion_unidad || "NA" },
      { label: "Land Owner", value: order.cliente.propietario_terreno || "NA" },
      { label: "Unit Purpose", value: order.cliente.proposito_unidad || "NA" },
      { label: "Marital Status", value: order.cliente.estado_civil || "NA" },
      { label: "Workplace", value: order.cliente.lugar_empleo || "NA" },
      { label: "Payment Method", value: order.cliente.forma_pago || "NA" },
      {
        label: "Reference Contact",
        value: order.cliente.contacto_referencia || "NA",
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

    yOffset = (doc as any).lastAutoTable.finalY + 5;
  }

  // Options
  if (order.options && order.options.length > 0) {
    yOffset += addText("Options", yOffset, 14);
    for (const option of order.options) {
      autoTable(doc, {
        startY: yOffset + 5,
        head: [[option.name || "NA"]],
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5 },
      });

      yOffset = (doc as any).lastAutoTable.finalY + 5;

      if (option.suboptions && option.suboptions.length > 0) {
        autoTable(doc, {
          startY: yOffset + 5,
          head: [["Suboption", "Code", "Details"]],
          body: option.suboptions.map((suboption: any) => [
            suboption.name || "NA",
            suboption.code || "NA",
            suboption.details || "NA",
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
      head: [["Design Type"]],
      body: order.designs.map((design: any) => [design.designType || "NA"]),
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    yOffset = (doc as any).lastAutoTable.finalY + 5;

    for (const design of order.designs) {
      if (design.imageUrl) {
        yOffset += await addImage(design.imageUrl, yOffset, 180, 140);
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
      body: [[order.comentaries || "NA"]],
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 5 },
    });
    yOffset = (doc as any).lastAutoTable.finalY + 5;
  }

  // Signature
  if (order.signatureImage) {
    yOffset += addText("Signature", yOffset, 14);
    doc.addImage(order.signatureImage, "PNG", 10, yOffset, 150, 50);
    yOffset += 55; // Adjust space after signature
  }

  doc.save(`order_${order._id}.pdf`);
};

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  deleteOrder,
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">All Orders ({orders.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {orders.map((order: OrderType) => (
          <Card key={order._id}>
            <CardHeader>
              <CardTitle>{order.productName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-semibold">
                Total price: ${order.total}
              </p>
              <p>Discount: {order.discount}%</p>
              <p>Tax: {order.tax}%</p>
              <p>Status: {order.status}</p>
              <p className="border-t pt-4 mt-4">Seller: {order.vendedorName}</p>
              <p>Client: {order.cliente?.nombre || "N/A"}</p>
              <p>
                Comments:{" "}
                {order.comentaries === "" ? (
                  <span className="font-bold">No comments yet!</span>
                ) : (
                  order.comentaries
                )}
              </p>
              <div className="flex flex-row gap-4">
                <Button onClick={() => handleExportToPDF(order)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar a PDF
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteOrder(order._id)}
                >
                  Delete Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
