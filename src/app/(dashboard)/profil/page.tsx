import { Metadata } from "next";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { auth } from "@/lib/auth";
import { getClientById } from "@/lib/notion/queries";
import { ProfileForm, PasswordForm } from "@/components/profil";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const client = await getClientById(session.user.id);

  if (!client) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-500 mt-1">
          Gérez vos informations personnelles et vos paramètres de sécurité
        </p>
      </div>

      {/* Profile overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-600">
                  {client.nom
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {client.nom}
                </h2>
                <Badge
                  className={
                    client.portailActif
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {client.portailActif ? "Compte actif" : "Compte inactif"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {client.entreprise && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4 text-gray-400" />
                    {client.entreprise}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {client.email}
                </div>
                {client.telephone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {client.telephone}
                  </div>
                )}
                {client.adresse && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {client.adresse}
                  </div>
                )}
              </div>

              {client.derniereConnexion && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    Dernière connexion :{" "}
                    {format(
                      new Date(client.derniereConnexion),
                      "d MMMM yyyy 'à' HH:mm",
                      { locale: fr }
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile form */}
        <ProfileForm client={client} />

        {/* Password form */}
        <PasswordForm />
      </div>

      {/* Company info (read-only) */}
      {(client.siret || client.numeroTVA) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Informations entreprise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {client.entreprise && (
                <div>
                  <p className="text-sm text-gray-500">Raison sociale</p>
                  <p className="font-medium text-gray-900">{client.entreprise}</p>
                </div>
              )}
              {client.siret && (
                <div>
                  <p className="text-sm text-gray-500">SIRET</p>
                  <p className="font-medium text-gray-900">{client.siret}</p>
                </div>
              )}
              {client.numeroTVA && (
                <div>
                  <p className="text-sm text-gray-500">Numéro de TVA</p>
                  <p className="font-medium text-gray-900">{client.numeroTVA}</p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Pour modifier ces informations, veuillez nous contacter.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Security info */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-gray-200 text-gray-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Sécurité de votre compte
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Votre compte est protégé par un mot de passe. Pour une sécurité
                optimale, nous vous recommandons de changer régulièrement votre
                mot de passe et de ne jamais le partager.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Utilisez un mot de passe unique pour ce compte
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Évitez les mots de passe faciles à deviner
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Ne partagez jamais vos identifiants
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
