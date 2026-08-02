import type { CourseSummary } from "@/domain/course/types";
import type { ProgressSnapshot } from "@/domain/progress/types";
import { learningPathOrder } from "@/features/catalog/labels";
import { isSideCourseRewardUnlocked } from "@/features/learning/side-course-rewards";

export function getLearningPathIndex(slug: string): number {
  return (learningPathOrder as readonly string[]).indexOf(slug);
}

export function getPreviousCourseSlug(slug: string): string | null {
  const index = getLearningPathIndex(slug);
  if (index <= 0) return null;
  return learningPathOrder[index - 1] ?? null;
}

export function isCourseFullyComplete(
  snapshot: ProgressSnapshot | undefined,
  courseId: string,
  lessonCount: number
): boolean {
  if (lessonCount <= 0) return true;
  const progress = snapshot?.courses[courseId];
  if (!progress) return false;

  // Count completed lessons against catalog lessonCount — never trust a stale
  // percentComplete alone (content version bumps can leave 100% with fewer rows).
  const completedFromLessons = Object.values(progress.lessons).filter(
    (lesson) => lesson.status === "completed"
  ).length;

  return completedFromLessons >= lessonCount;
}

/**
 * Path courses unlock when the previous course in learningPathOrder is complete.
 * Side courses unlock as rewards for completed path courses + XP.
 */
export function isCourseContentUnlocked(
  slug: string,
  snapshot: ProgressSnapshot | undefined,
  coursesBySlug: Map<string, Pick<CourseSummary, "id" | "slug" | "lessonCount">>
): boolean {
  const index = getLearningPathIndex(slug);

  if (index < 0) {
    return isSideCourseRewardUnlocked(slug, snapshot, coursesBySlug);
  }

  if (index === 0) return true;

  const previousSlug = learningPathOrder[index - 1];
  const previous = coursesBySlug.get(previousSlug);
  if (!previous) return true;

  return isCourseFullyComplete(
    snapshot,
    previous.id,
    previous.lessonCount
  );
}

export function buildCoursesBySlug<
  T extends Pick<CourseSummary, "id" | "slug" | "lessonCount">,
>(courses: T[]): Map<string, T> {
  return new Map(courses.map((course) => [course.slug, course]));
}

/** First unlocked course that is not fully complete; otherwise last unlocked. */
export function getContinueCourseSlug(
  courses: Pick<CourseSummary, "id" | "slug" | "lessonCount">[],
  snapshot: ProgressSnapshot | undefined
): string | null {
  const bySlug = buildCoursesBySlug(courses);
  const ordered = [...learningPathOrder].filter((slug) => bySlug.has(slug));

  for (const slug of ordered) {
    const course = bySlug.get(slug);
    if (!course) continue;
    if (!isCourseContentUnlocked(slug, snapshot, bySlug)) continue;
    if (!isCourseFullyComplete(snapshot, course.id, course.lessonCount)) {
      return slug;
    }
  }

  const lastUnlocked = [...ordered]
    .reverse()
    .find((slug) => isCourseContentUnlocked(slug, snapshot, bySlug));

  return lastUnlocked ?? ordered[0] ?? null;
}
