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
    const query = user.role === "Administrador" ? {} : { vendedor: user._id };

    const clients = await Client.find(query).lean();
    res.status(200).json(clients);
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
  } else {
    res.status(405).end();
  }
}
