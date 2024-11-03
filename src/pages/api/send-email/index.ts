import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { to, subject, policy } = req.body;

  console.log("process.env.EMAIL_USER: ", process.env.EMAIL_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define the formatted HTML content of the email
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px; color: #333;">
      <h2 style="color: #555;">${subject}</h2>
      <div style="font-size: 16px; line-height: 1.5;">
        <p><strong>Nombre:</strong> ${policy.nombre}</p>
        <p><strong>Dirección Postal:</strong> ${policy.direccion_postal}</p>
        <p><strong>Dirección Física:</strong> ${policy.direccion_fisica}</p>
        <p><strong>Fecha de Nacimiento:</strong> ${policy.fecha_nacimiento}</p>
        <p><strong>Teléfono de Contacto:</strong> ${
          policy.telefono_contacto
        }</p>
        <p><strong>Costo de Propiedad:</strong> ${policy.costo_propiedad}</p>
        <p><strong>Modelo de Propiedad:</strong> ${policy.modelo_propiedad}</p>
        <p><strong>Uso de Propiedad:</strong> ${policy.uso_propiedad}</p>
        <p><strong>Vendedor:</strong> ${policy.vendedor}</p>
        <p><strong>Comentarios:</strong> ${policy.comentarios}</p>
        <p><strong>Documentos:</strong> ${policy.documentos.join(", ")}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <footer style="text-align: center; color: #888; font-size: 12px;">
        <p>Thank you for your attention.</p>
        <p>&copy; ${new Date().getFullYear()} Vagón Puerto Rico. All rights reserved.</p>
      </footer>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: [to, "jgarciaseguros@hotmail.com"].filter(Boolean).join(", "),
      subject,
      html: htmlContent,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
}
