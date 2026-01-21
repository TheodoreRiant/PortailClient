import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClientDeliverables } from "@/lib/notion/cached-queries";
import { DeliverableCard } from "@/components/livrables";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Livrables",
};

export default async function DeliverablesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const deliverables = await getClientDeliverables(session.user.id);

  // Group deliverables by status
  const pendingValidation = deliverables.filter((d) => d.statut === "À valider");
  const validated = deliverables.filter((d) => d.statut === "Validé" || d.statut === "Livré");
  const rejected = deliverables.filter((d) => d.statut === "Refusé");
  const inPreparation = deliverables.filter((d) => d.statut === "En préparation");

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes livrables</h1>
        <p className="text-gray-500 mt-1">
          Consultez et validez vos livrables
        </p>
      </div>

      {deliverables.length === 0 ? (
        <EmptyState
          icon="Package"
          title="Aucun livrable"
          description="Vous n'avez pas encore de livrable. Ils apparaîtront ici dès qu'ils seront disponibles."
        />
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="all" className="gap-2">
              Tous
              <Badge variant="secondary" className="ml-1">
                {deliverables.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              À valider
              {pendingValidation.length > 0 && (
                <Badge className="ml-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  {pendingValidation.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="validated" className="gap-2">
              Validés
              <Badge variant="secondary" className="ml-1">
                {validated.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              Refusés
              {rejected.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {rejected.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {deliverables.map((deliverable) => (
              <DeliverableCard key={deliverable.id} deliverable={deliverable} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingValidation.length === 0 ? (
              <EmptyState
                icon="Package"
                title="Aucun livrable à valider"
                description="Tous vos livrables ont été validés."
              />
            ) : (
              pendingValidation.map((deliverable) => (
                <DeliverableCard key={deliverable.id} deliverable={deliverable} />
              ))
            )}
          </TabsContent>

          <TabsContent value="validated" className="space-y-4">
            {validated.length === 0 ? (
              <EmptyState
                icon="Package"
                title="Aucun livrable validé"
                description="Vos livrables validés apparaîtront ici."
              />
            ) : (
              validated.map((deliverable) => (
                <DeliverableCard key={deliverable.id} deliverable={deliverable} />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejected.length === 0 ? (
              <EmptyState
                icon="Package"
                title="Aucun livrable refusé"
                description="Aucun livrable n'a été refusé."
              />
            ) : (
              rejected.map((deliverable) => (
                <DeliverableCard key={deliverable.id} deliverable={deliverable} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
