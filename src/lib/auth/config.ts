import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getClientByEmail, updateClientLastLogin } from "@/lib/notion/queries";

// Schéma de validation des credentials
const credentialsSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Valider les credentials
          const parsedCredentials = credentialsSchema.safeParse(credentials);

          if (!parsedCredentials.success) {
            console.log("Invalid credentials format");
            return null;
          }

          const { email, password } = parsedCredentials.data;

          // Récupérer le client depuis Notion
          const client = await getClientByEmail(email);

          if (!client) {
            console.log("Client not found:", email);
            return null;
          }

          // Vérifier que le portail est actif
          if (!client.portailActif) {
            console.log("Portal access disabled for:", email);
            return null;
          }

          // Vérifier que le client a un mot de passe
          if (!client.motDePasseHash) {
            console.log("No password set for:", email);
            return null;
          }

          // Vérifier le mot de passe
          const passwordMatch = await bcrypt.compare(password, client.motDePasseHash);

          if (!passwordMatch) {
            console.log("Password mismatch for:", email);
            return null;
          }

          // Mettre à jour la dernière connexion
          await updateClientLastLogin(client.id);

          // Retourner l'utilisateur
          return {
            id: client.id,
            email: client.email,
            name: client.nom,
            entreprise: client.entreprise,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") ||
                           nextUrl.pathname.startsWith("/projets") ||
                           nextUrl.pathname.startsWith("/livrables") ||
                           nextUrl.pathname.startsWith("/factures") ||
                           nextUrl.pathname.startsWith("/profil");
      const isOnAuth = nextUrl.pathname.startsWith("/login") ||
                       nextUrl.pathname.startsWith("/reset-password");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.entreprise = (user as any).entreprise as string;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.entreprise = token.entreprise as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  trustHost: true,
};

export default authConfig;
