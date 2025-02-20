import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const installers = await User.find({ role: "Instalador" }).select(
      "name email _id"
    );

    return res.status(200).json(installers);
  } catch (error) {
    console.error("Error fetching installers:", error);
    return res.status(500).json({ message: "Error fetching installers" });
  }
}
