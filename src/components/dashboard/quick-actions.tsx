"use client";

import Link from "next/link";
import { CheckCircle, FileText, Mail, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

const defaultActions: QuickAction[] = [
  {
    title: "Valider un livrable",
    description: "Consultez et validez vos livrables en attente",
    href: "/livrables?status=a-valider",
    icon: CheckCircle,
    color: "text-green-600 bg-green-100",
  },
  {
    title: "Voir mes factures",
    description: "Consultez et téléchargez vos factures",
    href: "/factures",
    icon: FileText,
    color: "text-purple-600 bg-purple-100",
  },
  {
    title: "Contacter l'agence",
    description: "Envoyez-nous un message",
    href: "mailto:contact@example.com",
    icon: Mail,
    color: "text-blue-600 bg-blue-100",
  },
];

interface QuickActionsProps {
  actions?: QuickAction[];
  className?: string;
}

export function QuickActions({
  actions = defaultActions,
  className,
}: QuickActionsProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {actions.map((action) => (
        <Link
          key={action.title}
          href={action.href}
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
        >
          <div className={cn("p-3 rounded-lg", action.color)}>
            <action.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {action.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default QuickActions;
