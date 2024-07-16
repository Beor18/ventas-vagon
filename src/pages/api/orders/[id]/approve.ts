import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "POST") {
    const order = await Order.findById(id);
    if (order) {
      order.status = "approve";
      await order.save();
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
