import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export const handleExportToPDFSeller = async (order: any) => {
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
    { label: "Name Client", value: order.cliente.nombre || "N/A" },
    // { label: "Status", value: order.status || "N/A" },
    { label: "Vendor", value: order.vendedorName || "N/A" },
    // { label: "Vendor Email", value: order.vendedorEmail || "N/A" },
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
    didDrawPage: (data: any) => {
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
  //     didDrawPage: (data: any) => {
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

      if (option.suboptions && option.suboptions.length > 0) {
        // Unified table with option name first, then header, then suboptions
        autoTable(doc, {
          startY: yOffset,
          body: [
            // First row: option name spanning all columns
            [
              {
                content: option.name || "N/A",
                colSpan: 4,
                styles: {
                  fillColor: [46, 125, 50],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  fontSize: 11,
                  halign: "center",
                  cellPadding: 6,
                },
              },
            ],
            // Second row: header for suboptions
            [
              {
                content: "Suboption",
                styles: {
                  fillColor: [41, 128, 185],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  fontSize: 10,
                  cellPadding: 5,
                },
              },
              {
                content: "Code",
                styles: {
                  fillColor: [41, 128, 185],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  fontSize: 10,
                  cellPadding: 5,
                },
              },
              {
                content: "Details",
                styles: {
                  fillColor: [41, 128, 185],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  fontSize: 10,
                  cellPadding: 5,
                },
              },
              {
                content: "Comments",
                styles: {
                  fillColor: [41, 128, 185],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  fontSize: 10,
                  cellPadding: 5,
                },
              },
            ],
            // Suboptions rows with alternating colors
            ...option.suboptions.map((suboption: any, index: number) => [
              {
                content: suboption.name || "N/A",
                styles: {
                  fillColor:
                    index % 2 === 0 ? [245, 245, 245] : [255, 255, 255],
                  textColor: [80, 80, 80],
                  fontSize: 9,
                  cellPadding: 4,
                },
              },
              {
                content: suboption.code || "N/A",
                styles: {
                  fillColor:
                    index % 2 === 0 ? [245, 245, 245] : [255, 255, 255],
                  textColor: [80, 80, 80],
                  fontSize: 9,
                  cellPadding: 4,
                },
              },
              {
                content: suboption.details || "N/A",
                styles: {
                  fillColor:
                    index % 2 === 0 ? [245, 245, 245] : [255, 255, 255],
                  textColor: [80, 80, 80],
                  fontSize: 9,
                  cellPadding: 4,
                },
              },
              {
                content: suboption.comentarios || "N/A",
                styles: {
                  fillColor:
                    index % 2 === 0 ? [245, 245, 245] : [255, 255, 255],
                  textColor: [80, 80, 80],
                  fontSize: 9,
                  cellPadding: 4,
                },
              },
            ]),
          ],
          styles: {
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
          },
          columnStyles: {
            0: { cellWidth: "auto" },
            1: { cellWidth: 25 },
            2: { cellWidth: "auto" },
            3: { cellWidth: "auto" },
          },
          didDrawPage: (data: any) => {
            yOffset = data.cursor.y + 8;
          },
        });

        for (const suboption of option.suboptions) {
          if (suboption.imageUrl) {
            checkSpace(60);
            yOffset += await addImage(suboption.imageUrl, yOffset, 90, 50);
          }
        }
      } else {
        // If no suboptions, just show the option name
        autoTable(doc, {
          startY: yOffset,
          head: [["Option"]],
          body: [[option.name || "N/A"]],
          theme: "striped",
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          bodyStyles: { fillColor: [245, 245, 245] },
          styles: { fontSize: 10, cellPadding: 5 },
          didDrawPage: (data: any) => {
            yOffset = data.cursor.y + 5;
          },
        });
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
      didDrawPage: (data: any) => {
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
      didDrawPage: (data: any) => {
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
  // const pageCount = doc.getNumberOfPages();
  // for (let i = 1; i <= pageCount; i++) {
  //   doc.setPage(i);
  //   doc.setFillColor(41, 128, 185);
  //   doc.rect(0, pageHeight - 20, doc.internal.pageSize.width, 20, "F");
  //   addText(
  //     `Generated on ${format(new Date(), "PPpp")} - Page ${i} of ${pageCount}`,
  //     pageHeight - 10,
  //     10,
  //     "center",
  //     "#FFFFFF"
  //   );
  // }

  doc.save(`order_${order._id}.pdf`);
};

export const handleExportToPDFAdmin = async (order: any) => {
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
    // { label: "Vendor Email", value: order.vendedorEmail || "N/A" },
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
    didDrawPage: (data: any) => {
      yOffset = data.cursor.y + 10;
    },
  });

  // Add client information
  if (order.cliente) {
    checkSpace(30);
    yOffset += addText("Client Information", yOffset, 18, "left", "#2980b9");
    yOffset += 5;

    const clientInfo = [
      { label: "Name", value: order.cliente.nombre || "N/A" },
      { label: "Email", value: order.cliente.email || "N/A" },
      { label: "Phone", value: order.cliente.telefono || "N/A" },
      {
        label: "Address",
        value: order.cliente.direccion_residencial || "N/A",
      },
      {
        label: "Unit Address",
        value: order.cliente.direccion_unidad || "N/A",
      },
      {
        label: "Land Owner",
        value: order.cliente.propietario_terreno || "N/A",
      },
      {
        label: "Unit Purpose",
        value: order.cliente.proposito_unidad || "N/A",
      },
      { label: "Marital Status", value: order.cliente.estado_civil || "N/A" },
      { label: "Workplace", value: order.cliente.lugar_empleo || "N/A" },
      { label: "Payment Method", value: order.cliente.forma_pago || "N/A" },
      {
        label: "Reference Contact",
        value: order.cliente.contacto_referencia || "N/A",
      },
      {
        label: "Insurance Purchased",
        value: order.cliente.seguro_comprado ? "Yes" : "No",
      },
    ];

    autoTable(doc, {
      startY: yOffset,
      head: [["Field", "Value"]],
      body: clientInfo.map((info) => [info.label, info.value]),
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { fillColor: [245, 245, 245] },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 5 },
      didDrawPage: (data: any) => {
        yOffset = data.cursor.y + 10;
      },
    });
  }

  // Add color options
  if (order.colorOptions && order.colorOptions.length > 0) {
    checkSpace(30);
    yOffset += addText("Frame color", yOffset, 18, "left", "#2980b9");
    yOffset += 5;

    autoTable(doc, {
      startY: yOffset,
      head: [["Color Name", "Color Code", "Additional Price"]],
      body: order.colorOptions.map((color: any) => [
        color.colorName || "N/A",
        color.colorCode || "N/A",
        `$${color.additionalPrice || 0}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { fillColor: [245, 245, 245] },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 5 },
      didDrawPage: (data: any) => {
        yOffset = data.cursor.y + 5;
      },
    });

    for (const color of order.colorOptions) {
      if (color.imageUrl) {
        checkSpace(60);
        yOffset += addText(
          color.colorName || "N/A",
          yOffset,
          12,
          "left",
          "#555555"
        );
        yOffset += await addImage(color.imageUrl, yOffset, 90, 50);
      }
    }
  }

  // Add options
  if (order.options && order.options.length > 0) {
    checkSpace(30);
    yOffset += addText("Options", yOffset, 18, "left", "#2980b9");
    yOffset += 5;

    for (const option of order.options) {
      checkSpace(20);

      if (option.suboptions && option.suboptions.length > 0) {
        // Unified table with option name first, then header, then suboptions
        autoTable(doc, {
          startY: yOffset,
          body: [
            // First row: option name spanning all columns
            [
              {
                content: option.name || "N/A",
                colSpan: 4,
                styles: {
                  fillColor: [46, 125, 50],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  fontSize: 11,
                  halign: "center",
                  cellPadding: 6,
                },
              },
            ],
            // Second row: header for suboptions
            [
              {
                content: "Suboption",
                styles: {
                  fillColor: [41, 128, 185],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  fontSize: 10,
                  cellPadding: 5,
                },
              },
              {
                content: "Code",
                styles: {
                  fillColor: [41, 128, 185],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  fontSize: 10,
                  cellPadding: 5,
                },
              },
              {
                content: "Details",
                styles: {
                  fillColor: [41, 128, 185],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  fontSize: 10,
                  cellPadding: 5,
                },
              },
              {
                content: "Comments",
                styles: {
                  fillColor: [41, 128, 185],
                  textColor: [255, 255, 255],
                  fontStyle: "bold",
                  fontSize: 10,
                  cellPadding: 5,
                },
              },
            ],
            // Suboptions rows with alternating colors
            ...option.suboptions.map((suboption: any, index: number) => [
              {
                content: suboption.name || "N/A",
                styles: {
                  fillColor:
                    index % 2 === 0 ? [245, 245, 245] : [255, 255, 255],
                  textColor: [80, 80, 80],
                  fontSize: 9,
                  cellPadding: 4,
                },
              },
              {
                content: suboption.code || "N/A",
                styles: {
                  fillColor:
                    index % 2 === 0 ? [245, 245, 245] : [255, 255, 255],
                  textColor: [80, 80, 80],
                  fontSize: 9,
                  cellPadding: 4,
                },
              },
              {
                content: suboption.details || "N/A",
                styles: {
                  fillColor:
                    index % 2 === 0 ? [245, 245, 245] : [255, 255, 255],
                  textColor: [80, 80, 80],
                  fontSize: 9,
                  cellPadding: 4,
                },
              },
              {
                content: suboption.comentarios || "N/A",
                styles: {
                  fillColor:
                    index % 2 === 0 ? [245, 245, 245] : [255, 255, 255],
                  textColor: [80, 80, 80],
                  fontSize: 9,
                  cellPadding: 4,
                },
              },
            ]),
          ],
          styles: {
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
          },
          columnStyles: {
            0: { cellWidth: "auto" },
            1: { cellWidth: 25 },
            2: { cellWidth: "auto" },
            3: { cellWidth: "auto" },
          },
          didDrawPage: (data: any) => {
            yOffset = data.cursor.y + 8;
          },
        });

        for (const suboption of option.suboptions) {
          if (suboption.imageUrl) {
            checkSpace(60);
            yOffset += await addImage(suboption.imageUrl, yOffset, 90, 50);
          }
        }
      } else {
        // If no suboptions, just show the option name
        autoTable(doc, {
          startY: yOffset,
          head: [["Option"]],
          body: [[option.name || "N/A"]],
          theme: "striped",
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          bodyStyles: { fillColor: [245, 245, 245] },
          styles: { fontSize: 10, cellPadding: 5 },
          didDrawPage: (data: any) => {
            yOffset = data.cursor.y + 5;
          },
        });
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
      didDrawPage: (data: any) => {
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
      didDrawPage: (data: any) => {
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
      `Generated on ${format(new Date(), "PPpp")} - Page ${i} of ${pageCount}`,
      pageHeight - 10,
      10,
      "center",
      "#FFFFFF"
    );
  }

  doc.save(`order_${order._id}.pdf`);
};
