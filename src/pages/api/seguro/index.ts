import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Seguro from "@/models/Seguro";

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

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const seguros = await Seguro.find().lean();
        res.status(200).json(seguros);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    case "POST":
      try {
        const seguro = new Seguro(req.body);
        await seguro.save();
        res.status(201).json(seguro);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    case "PUT":
      try {
        const { id } = req.query;
        const seguro = await Seguro.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!seguro) {
          return res.status(404).json({ error: "Seguro not found" });
        }
        res.status(200).json(seguro);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.query;
        const seguro = await Seguro.findByIdAndDelete(id);
        if (!seguro) {
          return res.status(404).json({ error: "Seguro not found" });
        }
        res.status(200).json({ message: "Seguro deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
