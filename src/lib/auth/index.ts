import NextAuth from "next-auth";
import authConfig from "./config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

// Helper pour vérifier l'authentification côté serveur
export async function getSession() {
  return await auth();
}

// Helper pour obtenir l'ID du client connecté
export async function getClientId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id || null;
}

// Helper pour vérifier si l'utilisateur est connecté
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}
