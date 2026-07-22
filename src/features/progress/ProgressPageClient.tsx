"use client";

import type { CourseSummary } from "@/domain/course/types";
import { useProgressSnapshot } from "@/queries/progress";
import { useUserId } from "@/hooks/use-user-id";
import { OverallProgress } from "@/components/progress/OverallProgress";
import { FadeIn } from "@/components/motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ScreenContainer } from "@/components/ui/screen-container";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";

export function ProgressPageClient({
  courses,
}: {
  courses: CourseSummary[];
}) {
  const userId = useUserId();
  const { data, isLoading } = useProgressSnapshot(userId);

  return (
    <div className="relative min-h-full">
      <ScreenAtmosphere
        src="/images/screens/progress.jpg"
        intensity="strong"
      />
      <ScreenContainer className="relative z-10 pb-8">
        <FadeIn className="space-y-8">
          <div className="space-y-2 pt-2">
            <h1 className="font-display text-3xl tracking-tight">Прогресс</h1>
            <p className="max-w-lg text-muted-foreground">
              Общая картина по курсам. Данные сохраняются локально и
              синхронизируются при входе в аккаунт.
            </p>
          </div>
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-40 w-full rounded-[var(--radius-xl)]" />
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-24 w-full rounded-[var(--radius-xl)]" />
            </div>
          ) : data ? (
            <OverallProgress snapshot={data} courses={courses} />
          ) : null}
        </FadeIn>
      </ScreenContainer>
    </div>
  );
}
