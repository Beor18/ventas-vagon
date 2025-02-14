import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "../../../lib/mongodb";
import Client from "../../../models/Client";
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

  // Obtener el usuario a partir del token
  const user = await User.findOne({ email: token.email });

  if (req.method === "GET") {
    try {
      const { vendedor } = req.query;
      const query = vendedor ? { vendedor } : {};
      const clients = await Client.find(query).lean();
      res.status(200).json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Error fetching clients" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        nombre,
        direccion_residencial,
        direccion_unidad,
        pin_localidad,
        informacion_terreno,
        propietario_terreno,
        proposito_unidad,
        estado_civil,
        lugar_empleo,
        email,
        identificacion,
        telefono,
        telefono_alterno,
        contrato_firmado,
        forma_pago,
        contacto_referencia,
        asegurador,
        seguro_comprado,
        vendedor,
      } = req.body;

      const userVendedor = await User.findOne({ email: vendedor });

      const newClient = new Client({
        nombre,
        direccion_residencial,
        direccion_unidad,
        pin_localidad,
        informacion_terreno,
        propietario_terreno,
        proposito_unidad,
        estado_civil,
        lugar_empleo,
        email,
        identificacion,
        telefono,
        telefono_alterno,
        contrato_firmado,
        forma_pago,
        contacto_referencia,
        asegurador,
        seguro_comprado,
        vendedor: userVendedor._id,
      });

      await newClient.save();
      res.status(201).json(newClient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const updatedData = req.body;

      const updatedClient = await Client.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      if (!updatedClient) {
        return res.status(404).json({ error: "Client not found" });
      }

      res.status(200).json(updatedClient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      const deletedClient = await Client.findByIdAndDelete(id);

      if (!deletedClient) {
        return res.status(404).json({ error: "Client not found" });
      }

      res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).end();
  }
}
