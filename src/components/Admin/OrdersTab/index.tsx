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
