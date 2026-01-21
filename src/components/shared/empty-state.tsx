"use client";

import { cn } from "@/lib/utils";
import {
  FolderOpen,
  FolderKanban,
  Package,
  FileText,
  CreditCard,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Inbox,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Map of icon names to components
const iconMap: Record<string, LucideIcon> = {
  FolderOpen,
  FolderKanban,
  Package,
  FileText,
  CreditCard,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Inbox,
};

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon = "FolderOpen",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[icon] || FolderOpen;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-4",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-md mb-4">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}

export default EmptyState;
