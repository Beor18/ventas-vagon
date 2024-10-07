import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Client from "@/models/Client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const { identificacion, email } = req.query;

  if (identificacion) {
    const client = await Client.findOne({ identificacion });
    if (client) {
      return res.status(200).json({ exists: true });
    }
  }

  if (email) {
    const client = await Client.findOne({ email });
    if (client) {
      return res.status(200).json({ exists: true });
    }
  }

  res.status(200).json({ exists: false });
}
