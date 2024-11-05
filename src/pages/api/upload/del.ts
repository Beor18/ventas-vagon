import type { NextApiRequest, NextApiResponse } from "next";
import { del } from "@vercel/blob";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { urls } = req.body; // Asegúrate de que `urls` sea un array de strings

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: "No URLs provided" });
    }

    // Elimina las URLs usando la función `del`
    await del(urls);

    return res.status(200).json({ message: "Borrado con éxito!" });
  } catch (error) {
    console.error("Error deleting images:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
