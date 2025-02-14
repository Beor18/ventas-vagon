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

  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const data = req.body;

      if (data.status && !["admin", "installer"].includes(token.role)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const request = await ServiceRequest.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }
      );

      if (!request) {
        return res.status(404).json({ error: "Not found" });
      }

      res.status(200).json(request);
    } catch (error) {
      console.error("Error updating service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      if (token.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const request = await ServiceRequest.findByIdAndDelete(id);
      if (!request) {
        return res.status(404).json({ error: "Not found" });
      }

      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      console.error("Error deleting service request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).end();
  }
}
