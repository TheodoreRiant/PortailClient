import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientByEmail, setResetToken } from "@/lib/notion/queries";
import { sendResetPasswordEmail } from "@/lib/email";
import crypto from "crypto";

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = resetPasswordSchema.parse(body);

    // Get client by email
    const client = await getClientByEmail(email);

    // Always return success to prevent email enumeration
    if (!client || !client.portailActif) {
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const resetToken = crypto.randomUUID();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token in Notion
    await setResetToken(client.id, resetToken, resetExpiry);

    // Send reset email
    await sendResetPasswordEmail({
      to: client.email,
      nom: client.nom,
      resetToken,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
