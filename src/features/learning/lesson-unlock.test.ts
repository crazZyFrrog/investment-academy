import { describe, expect, it } from "vitest";
import {
  getLessonLockReason,
  getNextPlayableLesson,
  isLessonContentUnlocked,
} from "@/features/learning/lesson-unlock";
import type { CourseProgress } from "@/domain/progress/types";

const lessons = [
  { id: "l1", title: "Первый", slug: "first" },
  { id: "l2", title: "Второй", slug: "second" },
  { id: "l3", title: "Третий", slug: "third" },
];

function progress(
  statuses: Record<string, "completed" | "in_progress" | "not_started">
): CourseProgress {
  const lessonEntries = Object.fromEntries(
    Object.entries(statuses).map(([lessonId, status]) => [
      lessonId,
      {
        lessonId,
        courseId: "c1",
        status,
        version: 1,
        completedAt:
          status === "completed" ? "2026-01-01T00:00:00.000Z" : undefined,
      },
    ])
  );
  const completedLessons = Object.values(statuses).filter(
    (s) => s === "completed"
  ).length;
  return {
    courseId: "c1",
    completedLessons,
    totalLessons: lessons.length,
    percentComplete: Math.round((completedLessons / lessons.length) * 100),
    lessons: lessonEntries,
  };
}

describe("lesson unlock", () => {
  it("keeps the first lesson open", () => {
    expect(isLessonContentUnlocked(lessons, 0, undefined)).toBe(true);
  });

  it("locks later lessons until the previous one is completed", () => {
    expect(isLessonContentUnlocked(lessons, 1, undefined)).toBe(false);
    expect(
      isLessonContentUnlocked(lessons, 1, progress({ l1: "in_progress" }))
    ).toBe(false);
    expect(
      isLessonContentUnlocked(lessons, 1, progress({ l1: "completed" }))
    ).toBe(true);
  });

  it("returns a helpful lock reason", () => {
    expect(getLessonLockReason(lessons, 1)).toContain("Первый");
  });

  it("picks the next playable incomplete lesson", () => {
    expect(
      getNextPlayableLesson(lessons, progress({ l1: "completed" }))?.id
    ).toBe("l2");
  });
});
