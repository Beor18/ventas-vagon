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
    const { id, status, fabricanteEmail } = req.query;
    let query: any = {};

    // Filtrar por estado si está presente
    if (status) {
      query.status = status;
    }

    // Filtrar por fabricanteEmail si está presente en la consulta
    if (fabricanteEmail) {
      query.fabricanteEmail = fabricanteEmail;
    }

    if (id) {
      query.id = id;
    }

    // Obtener las órdenes filtradas y los datos del cliente
    const orders = await Order.find(query).lean();
    res.status(200).json(orders);
  } else if (req.method === "POST") {
    try {
      const {
        productId,
        productName,
        options,
        colorOptions,
        designs,
        total,
        discount,
        tax,
        vendedorEmail,
        vendedorName,
        fabricanteEmail,
        fabricanteName,
        comentaries,
        cliente,
        signatureImage,
      } = req.body;

      const newOrder = new Order({
        productId,
        productName,
        options,
        colorOptions,
        designs,
        total,
        discount,
        tax,
        status: "Pending",
        vendedorEmail,
        vendedorName,
        fabricanteEmail,
        fabricanteName,
        comentaries,
        cliente,
        signatureImage,
      });

      await newOrder.save();
      res.status(201).json(newOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
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
