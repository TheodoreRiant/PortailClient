"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statutColors } from "@/config";
import type { Facture } from "@/types";

interface InvoiceCardProps {
  invoice: Facture;
  compact?: boolean;
  className?: string;
}

export function InvoiceCard({
  invoice,
  compact = false,
  className,
}: InvoiceCardProps) {
  const statusColor =
    statutColors.facture[invoice.statut as keyof typeof statutColors.facture] ||
    "bg-gray-100 text-gray-800";

  const isOverdue =
    invoice.statut === "En retard" ||
    (invoice.statut === "Envoyée" &&
      invoice.dateEcheance &&
      new Date(invoice.dateEcheance) < new Date());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (compact) {
    return (
      <Link
        href={`/factures/${invoice.id}`}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all group",
          isOverdue && "border-red-200 bg-red-50 hover:bg-red-100",
          className
        )}
      >
        <div
          className={cn(
            "p-2 rounded-lg",
            isOverdue ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
          )}
        >
          <FileText className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {invoice.numero}
          </p>
          <p className="text-xs text-gray-500">
            {formatCurrency(invoice.montantTTC)}
          </p>
        </div>
        <Badge className={cn("text-xs", statusColor)}>{invoice.statut}</Badge>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all",
        isOverdue && "border-red-200",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2.5 rounded-lg",
              isOverdue
                ? "bg-red-50 text-red-600"
                : invoice.statut === "Payée"
                ? "bg-green-50 text-green-600"
                : "bg-primary-50 text-primary-600"
            )}
          >
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{invoice.numero}</h3>
            {invoice.projetNom && (
              <p className="text-sm text-gray-500 mt-0.5">{invoice.projetNom}</p>
            )}
          </div>
        </div>
        <Badge className={cn("font-medium", statusColor)}>
          {isOverdue && invoice.statut !== "En retard" ? "En retard" : invoice.statut}
        </Badge>
      </div>

      {/* Amounts */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Montant HT</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(invoice.montantHT)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">TVA ({invoice.tauxTVA}%)</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(invoice.montantTVA)}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-3 pt-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-600">Total TTC</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(invoice.montantTTC)}
            </p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex flex-wrap gap-4 mb-4">
        {invoice.dateEmission && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Émise le {format(new Date(invoice.dateEmission), "d MMM yyyy", { locale: fr })}</span>
          </div>
        )}
        {invoice.dateEcheance && (
          <div
            className={cn(
              "flex items-center gap-1.5 text-sm",
              isOverdue ? "text-red-600" : "text-gray-500"
            )}
          >
            {isOverdue ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
            <span>
              Échéance le {format(new Date(invoice.dateEcheance), "d MMM yyyy", { locale: fr })}
            </span>
          </div>
        )}
        {invoice.datePaiement && (
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>
              Payée le {format(new Date(invoice.datePaiement), "d MMM yyyy", { locale: fr })}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {invoice.fichierPDF && (
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href={invoice.fichierPDF} download>
              <Download className="w-4 h-4" />
              Télécharger PDF
            </a>
          </Button>
        )}
        {!invoice.fichierPDF && <div />}
        <Link href={`/factures/${invoice.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-primary-600 hover:text-primary-700"
          >
            Voir détails
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InvoiceCard;
