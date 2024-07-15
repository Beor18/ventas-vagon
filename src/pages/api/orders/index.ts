import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import { Order } from "../../../models/Order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method === "GET") {
    const { status } = req.query;
    let query = {};
    if (status) {
      query = { status: status };
    }

    const orders = await Order.find(query).lean();
    res.status(200).json(orders);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
