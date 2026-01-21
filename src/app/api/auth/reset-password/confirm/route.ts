import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getClientByResetToken, updateClientPassword } from "@/lib/notion/queries";

const confirmSchema = z.object({
  token: z.string().uuid(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = confirmSchema.parse(body);

    // Get client by reset token
    const client = await getClientByResetToken(token);

    if (!client) {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (client.tokenResetExpiry) {
      const expiry = new Date(client.tokenResetExpiry);
      if (expiry < new Date()) {
        return NextResponse.json(
          { error: "Ce lien a expiré" },
          { status: 400 }
        );
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await updateClientPassword(client.id, hashedPassword);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirm password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
