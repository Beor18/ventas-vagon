import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import { Product } from "../../models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method === "POST") {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } else {
    res.status(405).end();
  }
}
