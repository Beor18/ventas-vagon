import { InsurancePolicy } from "@/components/Financiamiento/types";

export async function sendPolicyEmail(
  policy: InsurancePolicy,
  isNew: boolean
): Promise<void> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "ventas@vagonpuertorico.com",
        subject: isNew ? "Nuevo Prestamo Creado" : "Prestamo Actualizado",
        policy,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send policy email");
  }
}
