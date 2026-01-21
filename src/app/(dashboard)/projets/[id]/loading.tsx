import {
  ProjectHeaderSkeleton,
  DeliverablesListSkeleton,
  PageContentSkeleton,
  TimelineSkeleton,
  Skeleton,
} from "@/components/shared/skeletons";

export default function ProjectDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-32" />
      <ProjectHeaderSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PageContentSkeleton />
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <DeliverablesListSkeleton count={3} />
          </div>
        </div>
        <div className="space-y-6">
          <TimelineSkeleton />
        </div>
      </div>
    </div>
  );
}
