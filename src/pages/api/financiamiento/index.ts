import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Financiamiento from "@/models/Financiamiento";
import Client from "@/models/Client";
import { User } from "../../../models/User";

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

  const user = await User.findOne({ email: token.email });

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const query =
          user.role === "Administrador" ? {} : { vendedor: user._id };
        const finances = await Financiamiento.find(query)
          .populate("cliente")
          .lean();
        res.status(200).json(finances);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case "POST":
      try {
        const { cliente, ...data } = req.body;

        // Verificar que el cliente exista
        const clientExists = await Client.findById(cliente);
        if (!clientExists) {
          return res.status(404).json({ error: "Client not found" });
        }

        // Crear Financiamiento con cliente asociado
        const finance = new Financiamiento({ ...data, cliente });
        await finance.save();
        res.status(201).json(finance);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case "PUT":
      try {
        const { id } = req.query;
        const { cliente, ...data } = req.body;

        // Verificar que el cliente exista
        if (cliente) {
          const clientExists = await Client.findById(cliente);
          if (!clientExists) {
            return res.status(404).json({ error: "Client not found" });
          }
        }

        // Actualizar Financiamiento
        const finance = await Financiamiento.findByIdAndUpdate(
          id,
          { ...data, cliente },
          { new: true }
        );
        if (!finance) {
          return res.status(404).json({ error: "Finance not found" });
        }
        res.status(200).json(finance);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.query;
        const finance = await Financiamiento.findByIdAndDelete(id);
        if (!finance) {
          return res.status(404).json({ error: "Finance not found" });
        }
        res.status(200).json({ message: "Finance deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
