"use client";

import { useMemo } from "react";
import type { CourseSummary } from "@/domain/course/types";
import { useUserId } from "@/hooks/use-user-id";
import { useProgressSnapshot } from "@/queries/progress";
import { buildCoursesBySlug } from "@/features/learning/unlock";
import {
  getSimulatorLockReason,
  isSimulatorRewardUnlocked,
} from "@/features/learning/simulator-reward";

type UnlockCourse = Pick<CourseSummary, "id" | "slug" | "lessonCount">;

export function useSimulatorUnlock(courses: UnlockCourse[]) {
  const userId = useUserId();
  const { data: snapshot, isLoading } = useProgressSnapshot(userId);

  const bySlug = useMemo(() => buildCoursesBySlug(courses), [courses]);

  const isUnlocked = useMemo(
    () => isSimulatorRewardUnlocked(snapshot),
    [snapshot]
  );

  const lockReason = useMemo(
    () => getSimulatorLockReason(snapshot, bySlug),
    [snapshot, bySlug]
  );

  return {
    isUnlocked,
    lockReason,
    isLoading,
  };
}
