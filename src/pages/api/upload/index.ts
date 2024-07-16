import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Configurar formidable para manejar la subida de archivos
const form = formidable({
  multiples: false,
  uploadDir: path.join(process.cwd(), "public/uploads"),
  keepExtensions: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  filename: (name, ext, part, form) => {
    return `${Date.now()}-${part.originalFilename}`;
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  try {
    // Crear el directorio si no existe
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Error uploading file" });
      }

      // Obtener el archivo del array
      const fileArray = files.file as formidable.File[];
      const file = fileArray[0];

      // Verificar que el archivo exista y tenga una propiedad filepath
      if (!file || !file.filepath) {
        return res.status(500).json({ message: "File upload failed" });
      }

      const filePath = path.join("/uploads", path.basename(file.filepath));
      return res.status(200).json({ filePath });
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export default upload;
