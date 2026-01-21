import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  getDeliverableById,
  createValidation,
  updateDeliverableStatus,
} from "@/lib/notion/queries";
import { sendDeliverableValidatedEmail } from "@/lib/email";

const validationSchema = z.object({
  statut: z.enum(["Approuvé", "Refusé", "À modifier"]),
  commentaire: z.string().optional(),
  urgence: z.enum(["Mineur", "Moyen", "Important", "Bloquant"]).optional(),
  noteSatisfaction: z.number().min(1).max(5).optional(),
  projectId: z.string(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validationResult = validationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if deliverable exists and belongs to the user
    const deliverable = await getDeliverableById(id, session.user.id);

    if (!deliverable) {
      return NextResponse.json(
        { error: "Livrable non trouvé" },
        { status: 404 }
      );
    }

    // Check if deliverable can be validated
    if (deliverable.statut !== "À valider") {
      return NextResponse.json(
        { error: "Ce livrable ne peut pas être validé dans son état actuel" },
        { status: 400 }
      );
    }

    // Create validation record in Notion
    await createValidation({
      deliverableId: id,
      projectId: data.projectId,
      clientId: session.user.id,
      statut: data.statut,
      commentaire: data.commentaire,
      noteSatisfaction: data.noteSatisfaction,
    });

    // Map validation status to deliverable status
    const newStatus =
      data.statut === "Approuvé"
        ? "Validé"
        : data.statut === "Refusé"
        ? "Refusé"
        : "En préparation"; // À modifier goes back to preparation

    // Update deliverable status in Notion
    await updateDeliverableStatus(id, newStatus, data.commentaire);

    // Send notification email to the agency (optional)
    try {
      await sendDeliverableValidatedEmail({
        deliverableName: deliverable.nom,
        clientName: session.user.name || "Client",
        status: data.statut,
        comment: data.commentaire,
        rating: data.noteSatisfaction,
      });
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error("Failed to send validation email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message:
        data.statut === "Approuvé"
          ? "Livrable validé avec succès"
          : data.statut === "Refusé"
          ? "Livrable refusé"
          : "Demande de modification envoyée",
      newStatus,
    });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la validation" },
      { status: 500 }
    );
  }
}
