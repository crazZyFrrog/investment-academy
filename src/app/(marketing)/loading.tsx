import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";

export default function MarketingLoading() {
  return (
    <main
      className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center px-6 py-20"
      aria-busy
      aria-label="Загрузка"
    >
      <div className="max-w-2xl space-y-6">
        <Skeleton variant="title" className="h-14 w-4/5" />
        <SkeletonGroup count={3} className="max-w-lg" />
        <div className="flex gap-3">
          <Skeleton variant="button" className="h-12 w-40" />
          <Skeleton variant="button" className="h-12 w-36" />
        </div>
      </div>
    </main>
  );
}
