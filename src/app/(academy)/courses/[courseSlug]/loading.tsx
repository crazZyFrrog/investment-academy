import { ScreenContainer } from "@/components/ui/screen-container";
import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";

export default function CourseDetailLoading() {
  return (
    <ScreenContainer className="space-y-8 pb-10" aria-busy aria-label="Загрузка курса">
      <Skeleton variant="text" className="h-4 w-24" />
      <Skeleton variant="card" className="h-52" />
      <div className="space-y-3">
        <Skeleton variant="button" className="w-40" />
        <SkeletonGroup count={2} className="max-w-md" />
      </div>
      <div className="space-y-3">
        <Skeleton variant="title" className="h-6 w-36" />
        <Skeleton variant="card" className="h-20" />
        <Skeleton variant="card" className="h-20" />
        <Skeleton variant="card" className="h-20" />
      </div>
    </ScreenContainer>
  );
}
