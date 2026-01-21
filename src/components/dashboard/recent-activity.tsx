"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Package,
  FileText,
  CheckCircle,
  FolderKanban,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/types";

const activityIcons = {
  livrable: Package,
  validation: CheckCircle,
  facture: FileText,
  projet: FolderKanban,
  commentaire: MessageCircle,
};

const activityColors = {
  livrable: "text-blue-500 bg-blue-100",
  validation: "text-green-500 bg-green-100",
  facture: "text-purple-500 bg-purple-100",
  projet: "text-orange-500 bg-orange-100",
  commentaire: "text-gray-500 bg-gray-100",
};

interface RecentActivityProps {
  activities: ActivityItem[];
  className?: string;
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-200 p-6 shadow-sm", className)}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Activité récente
        </h2>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
          <p className="text-sm">Aucune activité récente</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-6 shadow-sm", className)}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Activité récente
      </h2>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];

          const content = (
            <div className="flex items-start gap-3 group">
              <div className={cn("p-2 rounded-lg flex-shrink-0", colorClass)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {activity.titre}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(activity.date), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>
            </div>
          );

          if (activity.lien) {
            return (
              <Link
                key={activity.id}
                href={activity.lien}
                className="block hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                {content}
              </Link>
            );
          }

          return (
            <div key={activity.id} className="py-1">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivity;
