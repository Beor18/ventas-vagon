import { list } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const blobs = await list({
      limit: 100,
    });

    return res.status(200).json(blobs);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
