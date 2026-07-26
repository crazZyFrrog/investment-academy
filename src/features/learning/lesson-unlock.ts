import type { CourseProgress } from "@/domain/progress/types";

/**
 * Within an unlocked course, lesson N opens only after lesson N-1 is completed.
 * The first lesson is always open (when the course itself is unlocked).
 */
export function isLessonContentUnlocked(
  lessons: Array<{ id: string }>,
  lessonIndex: number,
  progress: CourseProgress | undefined
): boolean {
  if (lessonIndex <= 0) return true;
  const previous = lessons[lessonIndex - 1];
  if (!previous) return true;
  return progress?.lessons[previous.id]?.status === "completed";
}

export function getLessonLockReason(
  lessons: Array<{ id: string; title: string }>,
  lessonIndex: number
): string | null {
  if (lessonIndex <= 0) return null;
  const previous = lessons[lessonIndex - 1];
  if (!previous) return null;
  return `Сначала завершите урок «${previous.title}» — материал и тест.`;
}

/** First incomplete lesson that is unlocked in sequence. */
export function getNextPlayableLesson<T extends { id: string }>(
  lessons: T[],
  progress: CourseProgress | undefined
): T | undefined {
  for (let index = 0; index < lessons.length; index += 1) {
    const lesson = lessons[index];
    if (!isLessonContentUnlocked(lessons, index, progress)) {
      return undefined;
    }
    if (progress?.lessons[lesson.id]?.status !== "completed") {
      return lesson;
    }
  }
  return lessons[0];
}
