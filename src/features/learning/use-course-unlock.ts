"use client";

import { useMemo } from "react";
import type { CourseSummary } from "@/domain/course/types";
import { useUserId } from "@/hooks/use-user-id";
import { useProgressSnapshot } from "@/queries/progress";
import {
  buildCoursesBySlug,
  getContinueCourseSlug,
  getPreviousCourseSlug,
  isCourseContentUnlocked,
  isCourseFullyComplete,
} from "@/features/learning/unlock";
import { learningPathOrder } from "@/features/catalog/labels";

type UnlockCourse = Pick<
  CourseSummary,
  "id" | "slug" | "lessonCount" | "title"
>;

export function useCourseUnlock(courses: UnlockCourse[]) {
  const userId = useUserId();
  const { data: snapshot, isLoading } = useProgressSnapshot(userId);

  const bySlug = useMemo(() => buildCoursesBySlug(courses), [courses]);

  const unlockMap = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const course of courses) {
      map.set(
        course.slug,
        isCourseContentUnlocked(course.slug, snapshot, bySlug)
      );
    }
    return map;
  }, [courses, snapshot, bySlug]);

  const completeMap = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const course of courses) {
      map.set(
        course.slug,
        isCourseFullyComplete(snapshot, course.id, course.lessonCount)
      );
    }
    return map;
  }, [courses, snapshot]);

  function isUnlocked(slug: string): boolean {
    return (
      unlockMap.get(slug) ??
      isCourseContentUnlocked(slug, snapshot, bySlug)
    );
  }

  function isComplete(slug: string): boolean {
    return (
      completeMap.get(slug) ??
      (() => {
        const course = bySlug.get(slug);
        if (!course) return false;
        return isCourseFullyComplete(snapshot, course.id, course.lessonCount);
      })()
    );
  }

  function getLockReason(slug: string): string | null {
    if (isUnlocked(slug)) return null;
    const previousSlug = getPreviousCourseSlug(slug);
    if (!previousSlug) return null;
    const previous = bySlug.get(previousSlug);
    const title = previous?.title ?? previousSlug;
    return `Сначала завершите курс «${title}»: все уроки и тесты.`;
  }

  const continueSlug = useMemo(
    () => getContinueCourseSlug(courses, snapshot),
    [courses, snapshot]
  );

  const pathStatus = useMemo(() => {
    return learningPathOrder
      .filter((slug) => bySlug.has(slug))
      .map((slug) => {
        const unlocked = unlockMap.get(slug) ?? false;
        const complete = completeMap.get(slug) ?? false;
        return {
          slug,
          unlocked,
          complete,
          status: complete
            ? ("completed" as const)
            : unlocked
              ? ("current" as const)
              : ("upcoming" as const),
        };
      });
  }, [bySlug, unlockMap, completeMap]);

  return {
    snapshot,
    isLoading,
    isUnlocked,
    isComplete,
    getLockReason,
    continueSlug,
    pathStatus,
  };
}
