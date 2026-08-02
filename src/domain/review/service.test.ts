import { describe, expect, it } from "vitest";
import type { LessonProgress } from "@/domain/progress/types";
import {
  applyFailedReview,
  applySuccessfulReview,
  extractLessonQuizFromMdx,
  isLessonDueForReview,
  nextReviewIntervalDays,
} from "@/domain/review";

function lesson(
  overrides: Partial<LessonProgress> = {}
): LessonProgress {
  return {
    lessonId: "course:lesson",
    courseId: "course",
    status: "completed",
    completedAt: "2026-01-01T00:00:00.000Z",
    version: 1,
    ...overrides,
  };
}

describe("review intervals", () => {
  it("advances along 1 → 3 → 7 → 14 → 30", () => {
    expect(nextReviewIntervalDays(undefined)).toBe(1);
    expect(nextReviewIntervalDays(1)).toBe(3);
    expect(nextReviewIntervalDays(3)).toBe(7);
    expect(nextReviewIntervalDays(7)).toBe(14);
    expect(nextReviewIntervalDays(14)).toBe(30);
    expect(nextReviewIntervalDays(30)).toBe(30);
  });

  it("marks lesson due after interval from completedAt", () => {
    const item = lesson({ reviewIntervalDays: 1 });
    expect(
      isLessonDueForReview(item, new Date("2026-01-01T12:00:00.000Z"))
    ).toBe(false);
    expect(
      isLessonDueForReview(item, new Date("2026-01-02T00:00:00.000Z"))
    ).toBe(true);
  });

  it("applies success and failure updates", () => {
    const base = lesson({ reviewIntervalDays: 1 });
    const ok = applySuccessfulReview(
      base,
      new Date("2026-01-03T00:00:00.000Z")
    );
    expect(ok.reviewIntervalDays).toBe(3);
    expect(ok.lastReviewedAt).toBe("2026-01-03T00:00:00.000Z");

    const fail = applyFailedReview(
      ok,
      new Date("2026-01-04T00:00:00.000Z")
    );
    expect(fail.reviewIntervalDays).toBe(1);
    expect(fail.status).toBe("completed");
  });

  it("extracts quiz payload from MDX", () => {
    const content = `## Title

<LessonQuiz
  id="demo"
  title="Проверьте себя"
  data='[{"question":"Q?","options":["A","B"],"correctIndex":0,"explanation":"E"}]'
/>
`;
    const quiz = extractLessonQuizFromMdx(content);
    expect(quiz?.id).toBe("demo");
    expect(quiz?.data).toContain("Q?");
  });
});
