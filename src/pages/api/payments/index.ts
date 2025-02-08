import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Order from "@/models/Order";
import { generateInvoice } from "@/lib/generateInvoice";
import { put } from "@vercel/blob";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      await connectToDatabase();
      const payments = await Payment.find()
        .populate("orderId")
        .populate("clientId")
        .sort({ paymentDate: -1 }); // Ordenar por fecha, más recientes primero

      res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Error fetching payments" });
    }
  } else if (req.method === "POST") {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      await connectToDatabase();
      const { orderId, amount, notes, receiptUrl, createdBy } = req.body;

      const order = await Order.findById(orderId).populate("cliente");
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Generar y subir la factura
      const invoicePdfBuffer = await generateInvoice(
        {
          orderId,
          clientName: order.cliente.nombre,
          amount,
        },
        receiptUrl
      );

      const invoiceBlob = await put(
        `invoices/${order._id}_${Date.now()}.pdf`,
        invoicePdfBuffer,
        { access: "public" }
      );

      // Crear el registro de pago
      const payment = new Payment({
        orderId,
        clientId: order.cliente._id,
        amount,
        receiptUrl,
        invoiceUrl: invoiceBlob.url,
        createdBy,
        notes,
      });

      await payment.save();
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "Error processing payment" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
