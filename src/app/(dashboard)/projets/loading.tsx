import { ProjectsListSkeleton, Skeleton } from "@/components/shared/skeletons";

export default function ProjectsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>
      <ProjectsListSkeleton count={6} />
    </div>
  );
}
