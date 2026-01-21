import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getDashboardStats,
  getRecentActivity,
  getUpcomingDeadlines,
} from "@/lib/notion/cached-queries";
import {
  StatCard,
  RecentActivity,
  UpcomingDeadlines,
  QuickActions,
} from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const clientId = session.user.id;

  // Fetch dashboard data in parallel
  const [stats, activities, deadlines] = await Promise.all([
    getDashboardStats(clientId),
    getRecentActivity(clientId, 5),
    getUpcomingDeadlines(clientId, 5),
  ]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {session.user.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Bienvenue sur votre espace client. Voici un résumé de vos projets.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Projets actifs"
          value={stats.projetsActifs}
          icon="FolderKanban"
          variant="primary"
        />
        <StatCard
          title="À valider"
          value={stats.livrablesAValider}
          icon="Package"
          variant={stats.livrablesAValider > 0 ? "warning" : "default"}
          description={
            stats.livrablesAValider > 0
              ? "Livrables en attente de validation"
              : undefined
          }
        />
        <StatCard
          title="Factures impayées"
          value={stats.facturesImpayees}
          icon="FileText"
          variant={stats.facturesImpayees > 0 ? "danger" : "success"}
        />
        <StatCard
          title="Montant dû"
          value={`${stats.montantDu.toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} €`}
          icon="CreditCard"
          variant={stats.montantDu > 0 ? "danger" : "success"}
        />
      </div>

      {/* Quick actions */}
      <QuickActions />

      {/* Activity and deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={activities} />
        <UpcomingDeadlines deadlines={deadlines} />
      </div>
    </div>
  );
}
