import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClientProjects } from "@/lib/notion/queries";
import { ProjectCard } from "@/components/projets";
import { EmptyState } from "@/components/shared/empty-state";
import { FolderKanban } from "lucide-react";

export const metadata: Metadata = {
  title: "Projets",
};

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const projects = await getClientProjects(session.user.id);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes projets</h1>
        <p className="text-gray-500 mt-1">
          Consultez l&apos;avancement de vos projets en cours
        </p>
      </div>

      {/* Projects grid */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Aucun projet"
          description="Vous n'avez pas encore de projet en cours. Contactez-nous pour démarrer un nouveau projet."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
