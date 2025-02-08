import { jsPDF } from "jspdf";
import { createCanvas, loadImage } from "canvas";

export async function generateInvoice(paymentData: any, receiptUrl: string) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("FACTURA", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text("Empresa S.A. de C.V.", 20, 40);
  doc.text("RFC: XXX010101XX1", 20, 50);
  doc.text("Dirección: Calle Principal #123", 20, 60);

  doc.text(`Cliente: ${paymentData.clientName}`, 20, 80);
  doc.text(`Orden #: ${paymentData.orderId}`, 20, 90);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 100);
  doc.text(`Monto: $${paymentData.amount}`, 20, 120);

  try {
    const img = await loadImage(receiptUrl);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imgData = canvas.toDataURL("image/jpeg");
    doc.addImage(imgData, "JPEG", 20, 140, 170, 100);
  } catch (error) {
    console.error("Error adding receipt to invoice:", error);
  }

  return doc.output("arraybuffer");
}
