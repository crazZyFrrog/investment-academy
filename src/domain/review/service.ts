import type { LessonProgress } from "@/domain/progress/types";
import type { ProgressSnapshot } from "@/domain/progress/types";

export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30] as const;

const MS_PER_DAY = 86_400_000;

export function nextReviewIntervalDays(current?: number): number {
  if (current == null || current < REVIEW_INTERVALS_DAYS[0]) {
    return REVIEW_INTERVALS_DAYS[0];
  }
  const index = REVIEW_INTERVALS_DAYS.indexOf(
    current as (typeof REVIEW_INTERVALS_DAYS)[number]
  );
  if (index < 0) {
    const next = REVIEW_INTERVALS_DAYS.find((value) => value > current);
    return next ?? REVIEW_INTERVALS_DAYS[REVIEW_INTERVALS_DAYS.length - 1];
  }
  return (
    REVIEW_INTERVALS_DAYS[
      Math.min(index + 1, REVIEW_INTERVALS_DAYS.length - 1)
    ] ?? REVIEW_INTERVALS_DAYS[REVIEW_INTERVALS_DAYS.length - 1]
  );
}

export function getReviewAnchorIso(lesson: LessonProgress): string | null {
  return lesson.lastReviewedAt ?? lesson.completedAt ?? null;
}

export function isLessonDueForReview(
  lesson: LessonProgress,
  now: Date = new Date()
): boolean {
  if (lesson.status !== "completed") return false;
  const anchor = getReviewAnchorIso(lesson);
  if (!anchor) return false;
  const intervalDays = lesson.reviewIntervalDays ?? REVIEW_INTERVALS_DAYS[0];
  const dueAt = Date.parse(anchor) + intervalDays * MS_PER_DAY;
  if (Number.isNaN(dueAt)) return false;
  return now.getTime() >= dueAt;
}

export function applySuccessfulReview(
  lesson: LessonProgress,
  now: Date = new Date()
): LessonProgress {
  const currentInterval = lesson.reviewIntervalDays ?? REVIEW_INTERVALS_DAYS[0];
  return {
    ...lesson,
    lastReviewedAt: now.toISOString(),
    reviewIntervalDays: nextReviewIntervalDays(currentInterval),
    version: lesson.version + 1,
  };
}

export function applyFailedReview(
  lesson: LessonProgress,
  now: Date = new Date()
): LessonProgress {
  return {
    ...lesson,
    lastReviewedAt: now.toISOString(),
    reviewIntervalDays: REVIEW_INTERVALS_DAYS[0],
    version: lesson.version + 1,
  };
}

export interface DueReviewLesson {
  courseId: string;
  lessonId: string;
}

export function listDueReviewLessons(
  snapshot: ProgressSnapshot | undefined,
  now: Date = new Date()
): DueReviewLesson[] {
  if (!snapshot) return [];
  const due: DueReviewLesson[] = [];
  for (const course of Object.values(snapshot.courses)) {
    for (const lesson of Object.values(course.lessons)) {
      if (isLessonDueForReview(lesson, now)) {
        due.push({ courseId: lesson.courseId, lessonId: lesson.lessonId });
      }
    }
  }
  return due;
}

/** Extract embedded LessonQuiz JSON from MDX source. */
export function extractLessonQuizFromMdx(content: string): {
  id: string;
  data: string;
} | null {
  const idMatch = content.match(/<LessonQuiz\b[^>]*\bid=["']([^"']+)["']/);
  const dataMatch = content.match(/\bdata=(['"])([\s\S]*?)\1/);
  if (!idMatch || !dataMatch) return null;
  return { id: idMatch[1]!, data: dataMatch[2]! };
}
