"use client";

import { useProgressSnapshot } from "@/queries/progress";
import { useUserId } from "@/hooks/use-user-id";
import { OverallProgress } from "@/components/progress/OverallProgress";
import { FadeIn } from "@/components/motion";

export function ProgressPageClient() {
  const userId = useUserId();
  const { data, isLoading } = useProgressSnapshot(userId);

  return (
    <FadeIn className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl tracking-tight">Progress</h1>
        <p className="text-muted-foreground">
          Track completion across courses. Data persists locally and syncs when signed in.
        </p>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading progress...</p>
      ) : data ? (
        <OverallProgress snapshot={data} />
      ) : null}
    </FadeIn>
  );
}
