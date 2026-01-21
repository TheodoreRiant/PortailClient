"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Play,
  Package,
  CheckCircle,
  Flag,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Projet, Livrable } from "@/types";

interface TimelineEvent {
  id: string;
  type: "start" | "deliverable" | "validation" | "end";
  label: string;
  date: string;
  status?: string;
}

interface ProjectTimelineProps {
  project: Projet;
  deliverables?: Livrable[];
  className?: string;
}

const eventIcons = {
  start: Play,
  deliverable: Package,
  validation: CheckCircle,
  end: Flag,
};

const eventColors = {
  start: "bg-blue-500",
  deliverable: "bg-purple-500",
  validation: "bg-green-500",
  end: "bg-gray-800",
};

export function ProjectTimeline({
  project,
  deliverables = [],
  className,
}: ProjectTimelineProps) {
  // Build timeline events
  const events: TimelineEvent[] = [];

  // Start event
  if (project.dateDebut) {
    events.push({
      id: "start",
      type: "start",
      label: "Début du projet",
      date: project.dateDebut,
    });
  }

  // Deliverable events
  deliverables.forEach((deliverable) => {
    if (deliverable.dateCreation) {
      events.push({
        id: deliverable.id,
        type: "deliverable",
        label: deliverable.nom,
        date: deliverable.dateCreation,
        status: deliverable.statut,
      });
    }
  });

  // End event (if project is completed)
  if (project.dateFin) {
    events.push({
      id: "end",
      type: "end",
      label: "Projet terminé",
      date: project.dateFin,
    });
  } else if (project.dateFinEstimee) {
    events.push({
      id: "end-estimated",
      type: "end",
      label: "Fin estimée",
      date: project.dateFinEstimee,
    });
  }

  // Sort by date
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (events.length === 0) {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-200 p-6 shadow-sm", className)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mb-3 text-gray-300" />
          <p className="text-sm">Aucun événement</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-6 shadow-sm", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = eventIcons[event.type];
            const dotColor = eventColors[event.type];
            const isLast = index === events.length - 1;

            return (
              <div key={event.id} className="relative flex gap-4">
                {/* Dot and icon */}
                <div
                  className={cn(
                    "relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white",
                    dotColor
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                  <p className="text-xs text-gray-500 mb-1">
                    {format(new Date(event.date), "d MMMM yyyy", { locale: fr })}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {event.label}
                  </p>
                  {event.status && (
                    <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      {event.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProjectTimeline;
