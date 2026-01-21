import { DeliverablesListSkeleton, Skeleton } from "@/components/shared/skeletons";

export default function DeliverablesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      <DeliverablesListSkeleton count={6} />
    </div>
  );
}
