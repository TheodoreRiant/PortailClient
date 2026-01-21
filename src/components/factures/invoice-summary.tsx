"use client";

import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Facture } from "@/types";

interface InvoiceSummaryProps {
  invoices: Facture[];
  className?: string;
}

export function InvoiceSummary({ invoices, className }: InvoiceSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const pendingInvoices = invoices.filter(
    (f) => f.statut === "Envoyée" || f.statut === "En retard"
  );
  const paidInvoices = invoices.filter((f) => f.statut === "Payée");
  const overdueInvoices = invoices.filter((f) => f.statut === "En retard");

  const totalPending = pendingInvoices.reduce((sum, f) => sum + f.montantTTC, 0);
  const totalPaid = paidInvoices.reduce((sum, f) => sum + f.montantTTC, 0);
  const totalOverdue = overdueInvoices.reduce((sum, f) => sum + f.montantTTC, 0);

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {/* Total factures */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total factures</p>
            <p className="text-xl font-bold text-gray-900">{invoices.length}</p>
          </div>
        </div>
      </div>

      {/* En attente */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">En attente</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(totalPending)}
            </p>
            <p className="text-xs text-gray-400">
              {pendingInvoices.length} facture(s)
            </p>
          </div>
        </div>
      </div>

      {/* Payées */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100 text-green-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Payées</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(totalPaid)}
            </p>
            <p className="text-xs text-gray-400">
              {paidInvoices.length} facture(s)
            </p>
          </div>
        </div>
      </div>

      {/* En retard */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100 text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">En retard</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(totalOverdue)}
            </p>
            <p className="text-xs text-gray-400">
              {overdueInvoices.length} facture(s)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceSummary;
