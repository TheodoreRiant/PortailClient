import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { updateClientProfile } from "@/lib/notion/queries";

const profileSchema = z.object({
  nom: z.string().min(2).optional(),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = profileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Update profile in Notion
    await updateClientProfile(session.user.id, {
      nom: data.nom,
      telephone: data.telephone,
      adresse: data.adresse,
    });

    return NextResponse.json({
      success: true,
      message: "Profil mis à jour avec succès",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}
