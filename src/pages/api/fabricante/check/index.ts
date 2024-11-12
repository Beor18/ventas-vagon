import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const { role, email } = req.query;

  if (role === "fabricante") {
    const client = await User.findOne({ role });
    if (client) {
      return res.status(200).json({ exists: true });
    }
  }

  if (email) {
    const client = await User.findOne({ email });
    if (client) {
      return res.status(200).json({ exists: true });
    }
  }

  res.status(200).json({ exists: false });
}
