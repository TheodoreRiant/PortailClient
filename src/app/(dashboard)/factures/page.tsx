import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClientInvoices } from "@/lib/notion/cached-queries";
import { InvoiceCard, InvoiceSummary } from "@/components/factures";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Factures",
};

export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const invoices = await getClientInvoices(session.user.id);

  // Group invoices by status
  const pendingInvoices = invoices.filter(
    (f) => f.statut === "Envoyée" || f.statut === "En retard"
  );
  const paidInvoices = invoices.filter((f) => f.statut === "Payée");
  const overdueInvoices = invoices.filter((f) => f.statut === "En retard");

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes factures</h1>
        <p className="text-gray-500 mt-1">
          Consultez et téléchargez vos factures
        </p>
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          icon="FileText"
          title="Aucune facture"
          description="Vous n'avez pas encore de facture. Elles apparaîtront ici dès qu'elles seront disponibles."
        />
      ) : (
        <>
          {/* Summary cards */}
          <InvoiceSummary invoices={invoices} />

          {/* Invoices tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="all" className="gap-2">
                Toutes
                <Badge variant="secondary" className="ml-1">
                  {invoices.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                En attente
                {pendingInvoices.length > 0 && (
                  <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {pendingInvoices.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="overdue" className="gap-2">
                En retard
                {overdueInvoices.length > 0 && (
                  <Badge className="ml-1 bg-red-100 text-red-800 hover:bg-red-100">
                    {overdueInvoices.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="paid" className="gap-2">
                Payées
                <Badge variant="secondary" className="ml-1">
                  {paidInvoices.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {invoices.map((invoice) => (
                  <InvoiceCard key={invoice.id} invoice={invoice} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingInvoices.length === 0 ? (
                <EmptyState
                  icon="FileText"
                  title="Aucune facture en attente"
                  description="Toutes vos factures ont été réglées."
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pendingInvoices.map((invoice) => (
                    <InvoiceCard key={invoice.id} invoice={invoice} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="overdue" className="space-y-4">
              {overdueInvoices.length === 0 ? (
                <EmptyState
                  icon="FileText"
                  title="Aucune facture en retard"
                  description="Bravo ! Vous n'avez aucune facture en retard de paiement."
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {overdueInvoices.map((invoice) => (
                    <InvoiceCard key={invoice.id} invoice={invoice} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="paid" className="space-y-4">
              {paidInvoices.length === 0 ? (
                <EmptyState
                  icon="FileText"
                  title="Aucune facture payée"
                  description="Vos factures payées apparaîtront ici."
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {paidInvoices.map((invoice) => (
                    <InvoiceCard key={invoice.id} invoice={invoice} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
