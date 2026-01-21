import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { auth } from "@/lib/auth";
import { getInvoiceById, getProjectById } from "@/lib/notion/cached-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { statutColors } from "@/config";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building,
  FolderOpen,
  CreditCard,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Détail de la facture",
};

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const invoice = await getInvoiceById(id, session.user.id);

  if (!invoice) {
    notFound();
  }

  const project = invoice.projetId
    ? await getProjectById(invoice.projetId, session.user.id)
    : null;

  const statusColor =
    statutColors.facture[invoice.statut as keyof typeof statutColors.facture] ||
    "bg-gray-100 text-gray-800";

  const isOverdue =
    invoice.statut === "En retard" ||
    (invoice.statut === "Envoyée" &&
      invoice.dateEcheance &&
      new Date(invoice.dateEcheance) < new Date());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/factures"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux factures
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "p-3 rounded-xl",
                isOverdue
                  ? "bg-red-50 text-red-600"
                  : invoice.statut === "Payée"
                  ? "bg-green-50 text-green-600"
                  : "bg-primary-50 text-primary-600"
              )}
            >
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  Facture {invoice.numero}
                </h1>
                <Badge className={cn("font-medium", statusColor)}>
                  {isOverdue && invoice.statut !== "En retard"
                    ? "En retard"
                    : invoice.statut}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                {invoice.dateEmission && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Émise le{" "}
                    {format(new Date(invoice.dateEmission), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </span>
                )}
                {project && (
                  <Link
                    href={`/projets/${project.id}`}
                    className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700"
                  >
                    <FolderOpen className="w-4 h-4" />
                    {project.nom}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            {invoice.fichierPDF && (
              <Button asChild>
                <a href={invoice.fichierPDF} download>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Détails de la facture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Amounts breakdown */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-600">Montant HT</td>
                        <td className="py-3 text-right font-medium text-gray-900">
                          {formatCurrency(invoice.montantHT)}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-gray-600">
                          TVA ({invoice.tauxTVA}%)
                        </td>
                        <td className="py-3 text-right font-medium text-gray-900">
                          {formatCurrency(invoice.montantTVA)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 text-lg font-semibold text-gray-900">
                          Total TTC
                        </td>
                        <td className="py-4 text-right text-2xl font-bold text-gray-900">
                          {formatCurrency(invoice.montantTTC)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {invoice.dateEmission && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Date d&apos;émission</p>
                        <p className="font-medium text-gray-900">
                          {format(new Date(invoice.dateEmission), "d MMMM yyyy", {
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  {invoice.dateEcheance && (
                    <div
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg",
                        isOverdue ? "bg-red-50" : "bg-gray-50"
                      )}
                    >
                      {isOverdue ? (
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      )}
                      <div>
                        <p
                          className={cn(
                            "text-sm",
                            isOverdue ? "text-red-600" : "text-gray-500"
                          )}
                        >
                          Date d&apos;échéance
                        </p>
                        <p
                          className={cn(
                            "font-medium",
                            isOverdue ? "text-red-700" : "text-gray-900"
                          )}
                        >
                          {format(new Date(invoice.dateEcheance), "d MMMM yyyy", {
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment date if paid */}
                {invoice.datePaiement && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-600">Payée le</p>
                      <p className="font-medium text-green-700">
                        {format(new Date(invoice.datePaiement), "d MMMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statut du paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {invoice.statut === "Payée" && (
                    <div className="p-2 rounded-full bg-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  {(invoice.statut === "Envoyée" && !isOverdue) && (
                    <div className="p-2 rounded-full bg-blue-100">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  {isOverdue && (
                    <div className="p-2 rounded-full bg-red-100">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {isOverdue && invoice.statut !== "En retard"
                        ? "En retard"
                        : invoice.statut}
                    </p>
                    <p className="text-xs text-gray-500">
                      {invoice.statut === "Payée" && "Merci pour votre paiement"}
                      {invoice.statut === "Envoyée" &&
                        !isOverdue &&
                        "En attente de paiement"}
                      {isOverdue && "Merci de régulariser cette facture"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project info */}
          {project && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Projet associé</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/projets/${project.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all"
                >
                  <p className="font-medium text-gray-900">{project.nom}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {project.pourcentageAvancement}% complété
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-primary-600 h-1.5 rounded-full"
                      style={{ width: `${project.pourcentageAvancement}%` }}
                    />
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Payment instructions */}
          {(invoice.statut === "Envoyée" || isOverdue) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-medium text-blue-900 mb-2">
                  Modalités de paiement
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  Vous pouvez régler cette facture par virement bancaire. Les
                  coordonnées bancaires figurent sur le PDF de la facture.
                </p>
                {invoice.fichierPDF && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                    asChild
                  >
                    <a href={invoice.fichierPDF} download>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger la facture
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Help card */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-6">
              <h3 className="font-medium text-gray-900 mb-2">
                Besoin d&apos;aide ?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Une question concernant cette facture ? N&apos;hésitez pas à nous
                contacter.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="mailto:comptabilite@agence.com">Nous contacter</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
