import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";

export default function LessonLoading() {
  return (
    <div
      className="mx-auto max-w-2xl space-y-8 px-5 py-10"
      aria-busy
      aria-label="Загрузка урока"
    >
      <div className="space-y-3">
        <Skeleton variant="text" className="h-3 w-28" />
        <Skeleton variant="title" className="h-10 w-4/5" />
        <SkeletonGroup count={3} />
      </div>
      <SkeletonGroup count={8} className="space-y-4" />
      <Skeleton variant="button" className="h-12 w-full" />
    </div>
  );
}
