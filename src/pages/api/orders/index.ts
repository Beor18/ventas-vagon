import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "../../../lib/mongodb";
import Order from "../../../models/Order";

const secret = process.env.JWT_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  // Extraer el token del header
  // const token = await getToken({ req, secret });

  // // Verificar si el token es válido
  // if (!token) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  if (req.method === "GET") {
    const { id, status, fabricanteEmail, vendedorEmail } = req.query;
    let query: any = {};

    // Filtrar por estado si está presente
    if (status) {
      query.status = status;
    }

    // Filtrar por fabricanteEmail si está presente
    if (fabricanteEmail) {
      query.fabricanteEmail = fabricanteEmail;
    }

    // Filtrar por vendedorEmail si está presente
    if (vendedorEmail) {
      query.vendedorEmail = vendedorEmail;
    }

    if (id) {
      query.id = id;
    }

    // Obtener las órdenes filtradas y popular el campo cliente
    const orders = await Order.find(query).populate("cliente").lean();
    res.status(200).json(orders);
  } else if (req.method === "POST") {
    try {
      const orderData = req.body;

      // Debug: Ver qué datos llegan al API
      console.log("API - Order data received:", orderData);
      console.log("API - Floor plans received:", orderData.floorPlans);

      // Asegurarnos que las opciones incluyan los comentarios
      const processedOptions = orderData.options.map((option: any) => ({
        ...option,
        suboptions: option.suboptions.map((suboption: any) => ({
          ...suboption,
          comentarios: suboption.comentarios || "", // Asegurar que siempre haya un valor
        })),
      }));

      // Procesar floor plans para asegurar que se guarden correctamente
      const processedFloorPlans = orderData.floorPlans || [];

      const order = new Order({
        productId: orderData.productId,
        productName: orderData.productName,
        options: processedOptions,
        colorOptions: orderData.colorOptions || [],
        designs: orderData.designs || [],
        floorPlans: processedFloorPlans,
        total: orderData.total,
        discount: orderData.discount || 0,
        tax: orderData.tax || 0,
        vendedorEmail: orderData.vendedorEmail,
        vendedorName: orderData.vendedorName,
        fabricanteEmail: orderData.fabricanteEmail,
        cliente: orderData.cliente,
        signatureImage: orderData.signatureImage,
      });

      console.log("API - Order before save:", order);
      console.log("API - Order floor plans before save:", order.floorPlans);

      await order.save();

      console.log("API - Order after save:", order);
      console.log("API - Order floor plans after save:", order.floorPlans);

      res.status(201).json(order);
    } catch (error) {
      console.error("API - Error creating order:", error);
      res.status(500).json({ error: "Error creating order" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Order ID is required" });
      }

      const updates = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
        new: true, // Devuelve el documento actualizado
        runValidators: true, // Ejecuta validadores de esquema
      });

      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Order ID is required" });
      }

      const deletedOrder = await Order.findByIdAndDelete(id);

      if (!deletedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      res
        .status(200)
        .json({ message: "Order deleted successfully", deletedOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
