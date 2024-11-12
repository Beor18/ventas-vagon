import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "../../../lib/mongodb";
import { User } from "../../../models/User";

const secret = process.env.JWT_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  // Extraer el token del header
  const token = await getToken({ req, secret });

  // Verificar si el token es válido
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    // Filtrar solo usuarios con el rol "fabricante"
    const manufacturers = await User.find({ role: "Fabricante" }).lean();
    res.status(200).json(manufacturers);
  } else {
    res.status(405).end();
  }
}
