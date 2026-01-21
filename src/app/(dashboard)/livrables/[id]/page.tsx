import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { auth } from "@/lib/auth";
import { getDeliverableById, getProjectById, getPageContent } from "@/lib/notion/queries";
import { ValidationForm, FileList } from "@/components/livrables";
import { NotionContent } from "@/components/shared/notion-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { statutColors } from "@/config";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  FileText,
  Palette,
  Code,
  ClipboardList,
  File,
  ExternalLink,
  Calendar,
  Clock,
  User,
  FolderOpen,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import type { LivrableType } from "@/types";

export const metadata: Metadata = {
  title: "Détail du livrable",
};

const typeIcons: Record<LivrableType, any> = {
  Document: FileText,
  Maquette: Palette,
  Code: Code,
  Rapport: ClipboardList,
  Autre: File,
};

interface DeliverablePageProps {
  params: Promise<{ id: string }>;
}

export default async function DeliverablePage({ params }: DeliverablePageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const deliverable = await getDeliverableById(id, session.user.id);

  if (!deliverable) {
    notFound();
  }

  const project = deliverable.projetId
    ? await getProjectById(deliverable.projetId, session.user.id)
    : null;

  // Fetch Notion page content (blocks) for this deliverable
  const pageContent = await getPageContent(id);

  const statusColor =
    statutColors.livrable[deliverable.statut as keyof typeof statutColors.livrable] ||
    "bg-gray-100 text-gray-800";

  const TypeIcon = typeIcons[deliverable.type as LivrableType] || File;

  const canValidate = deliverable.statut === "À valider";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/livrables"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux livrables
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
              <TypeIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {deliverable.nom}
                </h1>
                <Badge className={cn("font-medium", statusColor)}>
                  {deliverable.statut}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <File className="w-4 h-4" />
                  {deliverable.type}
                </span>
                {deliverable.lot && (
                  <Badge variant="outline" className="text-xs">
                    {deliverable.lot}
                  </Badge>
                )}
                {deliverable.version && (
                  <span className="flex items-center gap-1.5">
                    Version {deliverable.version}
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
          {deliverable.lienExterne && (
            <Button asChild variant="outline">
              <a
                href={deliverable.lienExterne}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ouvrir le lien externe
              </a>
            </Button>
          )}
        </div>

        {deliverable.description && (
          <p className="mt-4 text-gray-600">{deliverable.description}</p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Créé le</span>
            <span className="font-medium text-gray-900">
              {format(new Date(deliverable.dateCreation), "d MMMM yyyy", {
                locale: fr,
              })}
            </span>
          </div>
          {deliverable.dateValidation && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-500">Validé le</span>
              <span className="font-medium text-gray-900">
                {format(new Date(deliverable.dateValidation), "d MMMM yyyy", {
                  locale: fr,
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Files */}
          {deliverable.fichiers && deliverable.fichiers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="w-5 h-5" />
                  Fichiers ({deliverable.fichiers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileList files={deliverable.fichiers} />
              </CardContent>
            </Card>
          )}

          {/* Notion page content (markdown-like) */}
          {pageContent && pageContent.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NotionContent blocks={pageContent} />
              </CardContent>
            </Card>
          )}

          {/* Validation form */}
          {canValidate && (
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="w-5 h-5" />
                  Validation requise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700 mb-6">
                  Ce livrable nécessite votre validation. Veuillez l&apos;examiner
                  attentivement avant de donner votre avis.
                </p>
                <div className="bg-white rounded-lg p-6 border border-yellow-200">
                  <ValidationForm
                    deliverableId={deliverable.id}
                    projectId={deliverable.projetId || ""}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validation history */}
          {deliverable.validations && deliverable.validations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Historique des validations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliverable.validations.map((validation, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border",
                        validation.statut === "Approuvé" &&
                          "bg-green-50 border-green-200",
                        validation.statut === "Refusé" &&
                          "bg-red-50 border-red-200",
                        validation.statut === "À modifier" &&
                          "bg-orange-50 border-orange-200"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {validation.statut === "Approuvé" && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {validation.statut === "Refusé" && (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          {validation.statut === "À modifier" && (
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                          )}
                          <span className="font-medium text-gray-900">
                            {validation.statut}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(
                            new Date(validation.dateValidation || validation.dateCreation),
                            "d MMM yyyy 'à' HH:mm",
                            { locale: fr }
                          )}
                        </span>
                      </div>
                      {validation.commentaire && (
                        <p className="text-sm text-gray-600 mt-2">
                          {validation.commentaire}
                        </p>
                      )}
                      {validation.noteSatisfaction && (
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={cn(
                                "w-4 h-4",
                                star <= validation.noteSatisfaction!
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              )}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statut actuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {deliverable.statut === "Validé" && (
                    <div className="p-2 rounded-full bg-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  {deliverable.statut === "À valider" && (
                    <div className="p-2 rounded-full bg-yellow-100">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                  )}
                  {deliverable.statut === "Refusé" && (
                    <div className="p-2 rounded-full bg-red-100">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                  )}
                  {deliverable.statut === "En préparation" && (
                    <div className="p-2 rounded-full bg-gray-100">
                      <Clock className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                  {deliverable.statut === "Livré" && (
                    <div className="p-2 rounded-full bg-blue-100">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {deliverable.statut}
                    </p>
                    <p className="text-xs text-gray-500">
                      {deliverable.statut === "À valider" &&
                        "En attente de votre validation"}
                      {deliverable.statut === "Validé" && "Vous avez validé ce livrable"}
                      {deliverable.statut === "Refusé" &&
                        "Vous avez refusé ce livrable"}
                      {deliverable.statut === "En préparation" &&
                        "En cours de préparation"}
                      {deliverable.statut === "Livré" && "Livrable livré"}
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

          {/* Help card */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-6">
              <h3 className="font-medium text-gray-900 mb-2">
                Besoin d&apos;aide ?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Si vous avez des questions concernant ce livrable, n&apos;hésitez
                pas à nous contacter.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="mailto:support@agence.com">Nous contacter</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
