"use client";

import Link from "next/link";
import { format, differenceInDays, isPast } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  FileText,
  FolderKanban,
  Package,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Deadline } from "@/types";

const deadlineIcons = {
  facture: FileText,
  projet: FolderKanban,
  livrable: Package,
};

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
  className?: string;
}

export function UpcomingDeadlines({
  deadlines,
  className,
}: UpcomingDeadlinesProps) {
  if (deadlines.length === 0) {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-200 p-6 shadow-sm", className)}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Prochaines échéances
        </h2>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mb-3 text-gray-300" />
          <p className="text-sm">Aucune échéance à venir</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-6 shadow-sm", className)}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Prochaines échéances
      </h2>
      <div className="space-y-3">
        {deadlines.map((deadline) => {
          const Icon = deadlineIcons[deadline.type];
          const deadlineDate = new Date(deadline.date);
          const daysUntil = differenceInDays(deadlineDate, new Date());
          const isOverdue = isPast(deadlineDate);
          const isUrgent = daysUntil <= 3 && daysUntil >= 0;

          const linkHref =
            deadline.type === "facture"
              ? `/factures/${deadline.id}`
              : deadline.type === "projet"
              ? `/projets/${deadline.id}`
              : `/livrables/${deadline.id}`;

          return (
            <Link
              key={deadline.id}
              href={linkHref}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors hover:border-gray-300",
                isOverdue
                  ? "bg-red-50 border-red-200 hover:bg-red-100"
                  : isUrgent
                  ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg",
                  isOverdue
                    ? "bg-red-100 text-red-600"
                    : isUrgent
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {deadline.titre}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {format(deadlineDate, "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    En retard
                  </Badge>
                )}
                {isUrgent && !isOverdue && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  >
                    {daysUntil === 0
                      ? "Aujourd'hui"
                      : `${daysUntil} jour${daysUntil > 1 ? "s" : ""}`}
                  </Badge>
                )}
                {!isOverdue && !isUrgent && (
                  <span className="text-xs text-gray-500">
                    {daysUntil} jours
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default UpcomingDeadlines;
