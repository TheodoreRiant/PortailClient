import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getProjectById, getProjectDeliverables, getPageContent } from "@/lib/notion/cached-queries";
import { ProjectHeader, ProjectTimeline } from "@/components/projets";
import { DeliverableCard } from "@/components/livrables/deliverable-card";
import { EmptyState } from "@/components/shared/empty-state";
import { NotionContent } from "@/components/shared/notion-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return { title: "Projet" };
  }

  const project = await getProjectById(id, session.user.id);

  return {
    title: project ? project.nom : "Projet non trouvé",
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const clientId = session.user.id;

  // Fetch project, deliverables and page content in parallel
  const [project, deliverables, pageContent] = await Promise.all([
    getProjectById(id, clientId),
    getProjectDeliverables(id, clientId),
    getPageContent(id),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Project header */}
      <ProjectHeader project={project} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Documentation & Deliverables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notion page content (documentation) */}
          {pageContent && pageContent.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documentation du projet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NotionContent blocks={pageContent} />
              </CardContent>
            </Card>
          )}

          {/* Deliverables */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Livrables</h2>
              <span className="text-sm text-gray-500">
                {deliverables.length} livrable{deliverables.length !== 1 ? "s" : ""}
              </span>
            </div>

            {deliverables.length === 0 ? (
              <EmptyState
                icon="Package"
                title="Aucun livrable"
                description="Les livrables de ce projet apparaîtront ici dès qu'ils seront disponibles."
              />
            ) : (
              <div className="space-y-4">
                {deliverables.map((deliverable) => (
                  <DeliverableCard key={deliverable.id} deliverable={deliverable} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Timeline */}
        <div className="space-y-6">
          <ProjectTimeline project={project} deliverables={deliverables} />
        </div>
      </div>
    </div>
  );
}
