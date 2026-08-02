import type { ProgressSnapshot } from "@/domain/progress/types";
import type { CourseSummary } from "@/domain/course/types";
import { learningPathOrder } from "@/features/catalog/labels";
import { normalizeGamificationState } from "@/domain/gamification";

/** Reward gates for side courses (outside the sequential main path). */
export const sideCourseRewards = {
  "first-100k": {
    minPathCourses: 1,
    minXp: 100,
    label: "1 курс пути и 100 XP",
  },
  dividends: {
    minPathCourses: 2,
    minXp: 250,
    label: "2 курса пути и 250 XP",
  },
  "crypto-without-illusions": {
    minPathCourses: 4,
    minXp: 500,
    label: "4 курса пути и 500 XP",
  },
} as const;

export type SideCourseSlug = keyof typeof sideCourseRewards;

export function isSideCourseSlug(slug: string): slug is SideCourseSlug {
  return Object.prototype.hasOwnProperty.call(sideCourseRewards, slug);
}

function isPathCourseComplete(
  snapshot: ProgressSnapshot | undefined,
  courseId: string,
  lessonCount: number
): boolean {
  if (lessonCount <= 0) return true;
  const progress = snapshot?.courses[courseId];
  if (!progress) return false;
  const completedFromLessons = Object.values(progress.lessons).filter(
    (lesson) => lesson.status === "completed"
  ).length;
  return completedFromLessons >= lessonCount;
}

export function countCompletedPathCourses(
  snapshot: ProgressSnapshot | undefined,
  coursesBySlug: Map<string, Pick<CourseSummary, "id" | "slug" | "lessonCount">>
): number {
  let count = 0;
  for (const slug of learningPathOrder) {
    const course = coursesBySlug.get(slug);
    if (!course) continue;
    if (isPathCourseComplete(snapshot, course.id, course.lessonCount)) {
      count += 1;
    }
  }
  return count;
}

export function getSnapshotXp(snapshot: ProgressSnapshot | undefined): number {
  return normalizeGamificationState(snapshot?.gamification).xp;
}

export function isSideCourseRewardUnlocked(
  slug: string,
  snapshot: ProgressSnapshot | undefined,
  coursesBySlug: Map<string, Pick<CourseSummary, "id" | "slug" | "lessonCount">>
): boolean {
  if (!isSideCourseSlug(slug)) return true;
  const req = sideCourseRewards[slug];
  const pathDone = countCompletedPathCourses(snapshot, coursesBySlug);
  const xp = getSnapshotXp(snapshot);
  return pathDone >= req.minPathCourses && xp >= req.minXp;
}

export function getSideCourseLockReason(
  slug: string,
  snapshot: ProgressSnapshot | undefined,
  coursesBySlug: Map<string, Pick<CourseSummary, "id" | "slug" | "lessonCount">>
): string | null {
  if (!isSideCourseSlug(slug)) return null;
  if (isSideCourseRewardUnlocked(slug, snapshot, coursesBySlug)) return null;

  const req = sideCourseRewards[slug];
  const pathDone = countCompletedPathCourses(snapshot, coursesBySlug);
  const xp = getSnapshotXp(snapshot);

  return `Награда за прогресс: нужно ${req.label} (сейчас ${pathDone} из ${req.minPathCourses} курсов пути, ${xp} из ${req.minXp} XP).`;
}
