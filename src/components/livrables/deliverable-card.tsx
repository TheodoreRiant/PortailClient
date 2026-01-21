"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Package,
  FileText,
  Palette,
  Code,
  ClipboardList,
  File,
  ExternalLink,
  Download,
  Clock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statutColors, livrableTypeIcons } from "@/config";
import type { Livrable, LivrableType } from "@/types";

const typeIcons: Record<LivrableType, any> = {
  Document: FileText,
  Maquette: Palette,
  Code: Code,
  Rapport: ClipboardList,
  Autre: File,
};

interface DeliverableCardProps {
  deliverable: Livrable;
  compact?: boolean;
  className?: string;
}

export function DeliverableCard({
  deliverable,
  compact = false,
  className,
}: DeliverableCardProps) {
  const statusColor =
    statutColors.livrable[deliverable.statut as keyof typeof statutColors.livrable] ||
    "bg-gray-100 text-gray-800";

  const TypeIcon = typeIcons[deliverable.type as LivrableType] || File;

  if (compact) {
    return (
      <Link
        href={`/livrables/${deliverable.id}`}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all group",
          className
        )}
      >
        <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
          <TypeIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {deliverable.nom}
          </p>
          <p className="text-xs text-gray-500">{deliverable.type}</p>
        </div>
        <Badge className={cn("text-xs", statusColor)}>{deliverable.statut}</Badge>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-primary-50 text-primary-600">
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{deliverable.nom}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{deliverable.type}</span>
              {deliverable.version && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">
                    v{deliverable.version}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <Badge className={cn("font-medium", statusColor)}>
          {deliverable.statut}
        </Badge>
      </div>

      {deliverable.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {deliverable.description}
        </p>
      )}

      {/* Files preview */}
      {deliverable.fichiers && deliverable.fichiers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {deliverable.fichiers.slice(0, 3).map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-lg text-xs text-gray-600"
            >
              <File className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{file.name}</span>
            </div>
          ))}
          {deliverable.fichiers.length > 3 && (
            <div className="flex items-center px-2.5 py-1.5 bg-gray-50 rounded-lg text-xs text-gray-500">
              +{deliverable.fichiers.length - 3} fichier(s)
            </div>
          )}
        </div>
      )}

      {/* External link */}
      {deliverable.lienExterne && (
        <a
          href={deliverable.lienExterne}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 mb-4"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Voir sur {new URL(deliverable.lienExterne).hostname}
        </a>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          {format(new Date(deliverable.dateCreation), "d MMM yyyy", {
            locale: fr,
          })}
        </div>
        <Link href={`/livrables/${deliverable.id}`}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-primary-600 hover:text-primary-700">
            {deliverable.statut === "À valider" ? "Valider" : "Voir détails"}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default DeliverableCard;
