"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FolderKanban, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { statutColors } from "@/config";
import type { Projet } from "@/types";

interface ProjectCardProps {
  project: Projet;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const statusColor =
    statutColors.projet[project.statut as keyof typeof statutColors.projet] ||
    "bg-gray-100 text-gray-800";

  return (
    <Link
      href={`/projets/${project.id}`}
      className={cn(
        "block bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {project.nom}
            </h3>
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <Badge className={cn("font-medium", statusColor)}>{project.statut}</Badge>
      </div>

      {project.descriptionPublique && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.descriptionPublique}
        </p>
      )}

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-500">Avancement</span>
          <span className="text-xs font-bold text-gray-700">
            {project.pourcentageAvancement}%
          </span>
        </div>
        <Progress value={project.pourcentageAvancement} className="h-2" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          {project.dateDebut ? (
            <span>
              Depuis le {format(new Date(project.dateDebut), "d MMM yyyy", { locale: fr })}
            </span>
          ) : (
            <span>Date non définie</span>
          )}
        </div>
        <span className="inline-flex items-center text-xs font-medium text-primary-600 group-hover:text-primary-700">
          Voir le projet
          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default ProjectCard;
