"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  FolderKanban,
  Calendar,
  Clock,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { statutColors } from "@/config";
import type { Projet } from "@/types";

interface ProjectHeaderProps {
  project: Projet;
  className?: string;
}

export function ProjectHeader({ project, className }: ProjectHeaderProps) {
  const statusColor =
    statutColors.projet[project.statut as keyof typeof statutColors.projet] ||
    "bg-gray-100 text-gray-800";

  return (
    <div className={cn("space-y-6", className)}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/projets" className="hover:text-gray-900 transition-colors">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour aux projets
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
              <FolderKanban className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {project.nom}
                </h1>
                <Badge className={cn("font-medium", statusColor)}>
                  {project.statut}
                </Badge>
              </div>
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {project.descriptionPublique && (
                <p className="text-gray-600 max-w-2xl">
                  {project.descriptionPublique}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 lg:gap-6">
            {project.dateDebut && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Début</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(project.dateDebut), "d MMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            )}
            {project.dateFinEstimee && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fin estimée</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(project.dateFinEstimee), "d MMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            )}
            {project.montantTotal > 0 && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gray-100">
                  <DollarSign className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-sm font-medium text-gray-900">
                    {project.montantTotal.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Avancement du projet
            </span>
            <span className="text-sm font-bold text-gray-900">
              {project.pourcentageAvancement}%
            </span>
          </div>
          <Progress value={project.pourcentageAvancement} className="h-3" />
        </div>
      </div>
    </div>
  );
}

export default ProjectHeader;
