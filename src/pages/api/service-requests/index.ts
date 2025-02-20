import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";

const secret = process.env.JWT_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const token = await getToken({ req, secret });
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      let query = {};
      if (token.role === "Vendedor") {
        query = { seller: token.id };
      } else if (token.role === "Instalador") {
        query = { installer: token.id };
      }

      const requests = await ServiceRequest.find(query)
        .populate("client", "nombre email telefono")
        .populate("installer", "name email")
        .populate("product", "name")
        .populate("seller", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      if (token.role !== "Vendedor") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const data = req.body;
      const request = await ServiceRequest.create({
        ...data,
        seller: token.id,
      });

      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).end();
  }
}
