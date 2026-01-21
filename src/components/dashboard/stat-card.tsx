"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "warning" | "danger" | "success";
  className?: string;
}

const variantStyles = {
  default: {
    icon: "bg-gray-100 text-gray-600",
    trend: { positive: "text-green-600", negative: "text-red-600" },
  },
  primary: {
    icon: "bg-blue-100 text-blue-600",
    trend: { positive: "text-green-600", negative: "text-red-600" },
  },
  warning: {
    icon: "bg-yellow-100 text-yellow-600",
    trend: { positive: "text-green-600", negative: "text-red-600" },
  },
  danger: {
    icon: "bg-red-100 text-red-600",
    trend: { positive: "text-green-600", negative: "text-red-600" },
  },
  success: {
    icon: "bg-green-100 text-green-600",
    trend: { positive: "text-green-600", negative: "text-red-600" },
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {typeof value === "number"
              ? value.toLocaleString("fr-FR")
              : value}
          </p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                trend.isPositive ? styles.trend.positive : styles.trend.negative
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
              <span className="text-gray-500 ml-1">vs mois dernier</span>
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", styles.icon)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
