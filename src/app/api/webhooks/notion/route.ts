import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { config } from "@/config";
import {
  getClientById,
  getDeliverableById,
  getProjectById,
} from "@/lib/notion/queries";
import { sendNewDeliverableEmail, sendNewInvoiceEmail } from "@/lib/email";

// Webhook payload schemas
const deliverableWebhookSchema = z.object({
  type: z.literal("new_deliverable"),
  deliverableId: z.string(),
  clientId: z.string(),
  projectId: z.string(),
});

const invoiceWebhookSchema = z.object({
  type: z.literal("new_invoice"),
  invoiceId: z.string(),
  clientId: z.string(),
  invoiceNumber: z.string(),
  amount: z.number(),
  dueDate: z.string(),
});

const webhookSchema = z.discriminatedUnion("type", [
  deliverableWebhookSchema,
  invoiceWebhookSchema,
]);

// Verify webhook secret
function verifyWebhookSecret(request: NextRequest): boolean {
  const secret = request.headers.get("x-webhook-secret");
  return secret === config.admin.apiKey && config.admin.apiKey !== "";
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    if (!verifyWebhookSecret(request)) {
      return NextResponse.json(
        { error: "Non autorisé - Secret invalide" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate webhook payload
    const validationResult = webhookSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Payload invalide", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Handle new deliverable notification
    if (data.type === "new_deliverable") {
      const client = await getClientById(data.clientId);
      if (!client || !client.portailActif) {
        return NextResponse.json({
          success: false,
          message: "Client non trouvé ou inactif",
        });
      }

      const deliverable = await getDeliverableById(data.deliverableId, data.clientId);
      const project = await getProjectById(data.projectId, data.clientId);

      if (!deliverable || !project) {
        return NextResponse.json({
          success: false,
          message: "Livrable ou projet non trouvé",
        });
      }

      // Send email notification
      await sendNewDeliverableEmail({
        to: client.email,
        clientName: client.nom,
        deliverableName: deliverable.nom,
        projectName: project.nom,
        deliverableId: deliverable.id,
        deliverableType: deliverable.type,
      });

      return NextResponse.json({
        success: true,
        message: "Notification envoyée pour le nouveau livrable",
      });
    }

    // Handle new invoice notification
    if (data.type === "new_invoice") {
      const client = await getClientById(data.clientId);
      if (!client || !client.portailActif) {
        return NextResponse.json({
          success: false,
          message: "Client non trouvé ou inactif",
        });
      }

      // Send email notification
      await sendNewInvoiceEmail({
        to: client.email,
        clientName: client.nom,
        invoiceNumber: data.invoiceNumber,
        amount: data.amount,
        dueDate: data.dueDate,
        invoiceId: data.invoiceId,
      });

      return NextResponse.json({
        success: true,
        message: "Notification envoyée pour la nouvelle facture",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Type de webhook non géré",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement du webhook" },
      { status: 500 }
    );
  }
}
