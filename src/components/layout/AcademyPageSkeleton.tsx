import { ScreenContainer } from "@/components/ui/screen-container";
import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";

export function AcademyPageSkeleton() {
  return (
    <ScreenContainer
      className="space-y-8 pb-10 pt-2"
      aria-busy
      aria-label="Загрузка"
    >
      <div className="space-y-3">
        <Skeleton variant="text" className="h-3 w-28" />
        <Skeleton variant="title" className="h-9 w-3/4 max-w-md" />
        <SkeletonGroup count={2} className="max-w-lg" />
      </div>
      <Skeleton variant="card" className="h-48" />
      <div className="space-y-4">
        <Skeleton variant="title" className="h-6 w-40" />
        <Skeleton variant="card" className="h-28" />
        <Skeleton variant="card" className="h-28" />
        <Skeleton variant="card" className="h-28" />
      </div>
    </ScreenContainer>
  );
}
