import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { config } from "@/config";
import { createNotionClient, getClientByEmail } from "@/lib/notion/queries";
import { sendWelcomeEmail, generateSecurePassword } from "@/lib/email";

const createClientSchema = z.object({
  email: z.string().email("Email invalide"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  entreprise: z.string().min(1, "Entreprise requise"),
  sendWelcomeEmail: z.boolean().default(true),
});

// Middleware to verify admin API key
function verifyAdminApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === config.admin.apiKey && config.admin.apiKey !== "";
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin API key
    if (!verifyAdminApiKey(request)) {
      return NextResponse.json(
        { error: "Non autorisé - Clé API invalide" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = createClientSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if client already exists
    const existingClient = await getClientByEmail(data.email);
    if (existingClient) {
      return NextResponse.json(
        { error: "Un client avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Generate temporary password
    const tempPassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Create client in Notion
    const client = await createNotionClient({
      email: data.email,
      nom: data.nom,
      entreprise: data.entreprise,
      portailActif: true,
      motDePasseHash: hashedPassword,
    });

    // Send welcome email with temporary password
    if (data.sendWelcomeEmail) {
      try {
        await sendWelcomeEmail({
          to: data.email,
          nom: data.nom,
          email: data.email,
          tempPassword,
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail the request if email fails, but log it
      }
    }

    return NextResponse.json({
      success: true,
      message: "Client créé avec succès",
      client: {
        id: client.id,
        email: client.email,
        nom: client.nom,
        entreprise: client.entreprise,
      },
      // Only return temp password if email wasn't sent
      ...(data.sendWelcomeEmail ? {} : { tempPassword }),
    });
  } catch (error) {
    console.error("Client creation error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du client" },
      { status: 500 }
    );
  }
}

// Get all clients (for admin purposes)
export async function GET(request: NextRequest) {
  try {
    // Verify admin API key
    if (!verifyAdminApiKey(request)) {
      return NextResponse.json(
        { error: "Non autorisé - Clé API invalide" },
        { status: 401 }
      );
    }

    // For security, we don't implement a full client list here
    // This would require additional Notion queries and pagination
    return NextResponse.json({
      message: "Utilisez l'interface Notion pour gérer les clients",
    });
  } catch (error) {
    console.error("Get clients error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
