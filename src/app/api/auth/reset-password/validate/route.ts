import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientByResetToken } from "@/lib/notion/queries";

const validateSchema = z.object({
  token: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = validateSchema.parse(body);

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

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Validate token error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
