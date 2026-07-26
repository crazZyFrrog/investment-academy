import { describe, expect, it } from "vitest";
import {
  buildCoursesBySlug,
  getContinueCourseSlug,
  isCourseContentUnlocked,
  isCourseFullyComplete,
} from "@/features/learning/unlock";
import type { ProgressSnapshot } from "@/domain/progress/types";

const courses = [
  { id: "investing-fundamentals", slug: "investing-fundamentals", lessonCount: 2 },
  { id: "stocks-and-bonds", slug: "stocks-and-bonds", lessonCount: 2 },
  { id: "portfolio-basics", slug: "portfolio-basics", lessonCount: 2 },
];

function snapshotWith(
  courseId: string,
  lessonStatuses: Array<"completed" | "in_progress">
): ProgressSnapshot {
  const lessons = Object.fromEntries(
    lessonStatuses.map((status, index) => [
      `${courseId}-l${index + 1}`,
      {
        lessonId: `${courseId}-l${index + 1}`,
        courseId,
        status,
        version: 1,
        completedAt:
          status === "completed" ? "2026-01-01T00:00:00.000Z" : undefined,
      },
    ])
  );

  const completedLessons = lessonStatuses.filter((s) => s === "completed").length;

  return {
    userId: "guest-test",
    updatedAt: "2026-01-01T00:00:00.000Z",
    courses: {
      [courseId]: {
        courseId,
        completedLessons,
        totalLessons: lessonStatuses.length,
        percentComplete: Math.round(
          (completedLessons / lessonStatuses.length) * 100
        ),
        lessons,
      },
    },
  };
}

describe("course unlock", () => {
  it("keeps the first path course unlocked", () => {
    const bySlug = buildCoursesBySlug(courses);
    expect(
      isCourseContentUnlocked("investing-fundamentals", undefined, bySlug)
    ).toBe(true);
  });

  it("locks the second course until the first is fully complete", () => {
    const bySlug = buildCoursesBySlug(courses);
    const partial = snapshotWith("investing-fundamentals", [
      "completed",
      "in_progress",
    ]);
    expect(
      isCourseContentUnlocked("stocks-and-bonds", partial, bySlug)
    ).toBe(false);
  });

  it("unlocks the next course only when all catalog lessons are completed", () => {
    const bySlug = buildCoursesBySlug(courses);
    const done = snapshotWith("investing-fundamentals", [
      "completed",
      "completed",
    ]);
    expect(isCourseFullyComplete(done, "investing-fundamentals", 2)).toBe(
      true
    );
    expect(isCourseContentUnlocked("stocks-and-bonds", done, bySlug)).toBe(
      true
    );
  });

  it("does not unlock from a stale 100% percent alone", () => {
    const bySlug = buildCoursesBySlug(courses);
    const stale: ProgressSnapshot = {
      userId: "guest-test",
      updatedAt: "2026-01-01T00:00:00.000Z",
      courses: {
        "investing-fundamentals": {
          courseId: "investing-fundamentals",
          completedLessons: 1,
          totalLessons: 1,
          percentComplete: 100,
          lessons: {
            "only-one": {
              lessonId: "only-one",
              courseId: "investing-fundamentals",
              status: "completed",
              version: 1,
              completedAt: "2026-01-01T00:00:00.000Z",
            },
          },
        },
      },
    };

    // Catalog now has 2 lessons — one completed lesson must not unlock next
    expect(
      isCourseFullyComplete(stale, "investing-fundamentals", 2)
    ).toBe(false);
    expect(isCourseContentUnlocked("stocks-and-bonds", stale, bySlug)).toBe(
      false
    );
  });

  it("returns the first incomplete unlocked course as continue target", () => {
    const doneFirst = snapshotWith("investing-fundamentals", [
      "completed",
      "completed",
    ]);
    expect(getContinueCourseSlug(courses, doneFirst)).toBe("stocks-and-bonds");
  });
});
