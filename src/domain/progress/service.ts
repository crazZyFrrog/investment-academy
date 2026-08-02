import type { CourseProgress, LessonProgress, LessonStatus } from "./types";
import {
  applyFailedReview,
  applySuccessfulReview,
} from "@/domain/review/service";

const STATUS_RANK: Record<LessonStatus, number> = {
  not_started: 0,
  in_progress: 1,
  completed: 2,
};

export function startLesson(
  courseProgress: CourseProgress,
  lessonId: string
): CourseProgress {
  const existing = courseProgress.lessons[lessonId];
  if (existing?.status === "completed") {
    return courseProgress;
  }

  const lessonProgress: LessonProgress = {
    lessonId,
    courseId: courseProgress.courseId,
    status: "in_progress",
    startedAt: existing?.startedAt ?? new Date().toISOString(),
    version: (existing?.version ?? 0) + 1,
  };

  return upsertLessonProgress(courseProgress, lessonProgress);
}

export function completeLesson(
  courseProgress: CourseProgress,
  lessonId: string,
  score?: number
): CourseProgress {
  const existing = courseProgress.lessons[lessonId];
  const lessonProgress: LessonProgress = {
    lessonId,
    courseId: courseProgress.courseId,
    status: "completed",
    score: score ?? existing?.score,
    startedAt: existing?.startedAt ?? new Date().toISOString(),
    completedAt: existing?.completedAt ?? new Date().toISOString(),
    lastReviewedAt: existing?.lastReviewedAt,
    reviewIntervalDays: existing?.reviewIntervalDays ?? 1,
    version: (existing?.version ?? 0) + 1,
  };

  return upsertLessonProgress(courseProgress, lessonProgress);
}

export function recordLessonReview(
  courseProgress: CourseProgress,
  lessonId: string,
  passed: boolean,
  now: Date = new Date()
): CourseProgress {
  const existing = courseProgress.lessons[lessonId];
  if (!existing || existing.status !== "completed") {
    return courseProgress;
  }

  const updated = passed
    ? applySuccessfulReview(existing, now)
    : applyFailedReview(existing, now);

  return upsertLessonProgress(courseProgress, updated);
}

export function recomputeCourseProgress(
  courseId: string,
  totalLessons: number,
  lessons: Record<string, LessonProgress>
): CourseProgress {
  const completedLessons = Object.values(lessons).filter(
    (lesson) => lesson.status === "completed"
  ).length;

  const percentComplete =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  const timestamps = Object.values(lessons)
    .flatMap((lesson) => [lesson.startedAt, lesson.completedAt])
    .filter(Boolean) as string[];

  const lastAccessedAt =
    timestamps.length > 0
      ? timestamps.sort((a, b) => b.localeCompare(a))[0]
      : undefined;

  return {
    courseId,
    completedLessons,
    totalLessons,
    percentComplete,
    lastAccessedAt,
    lessons,
  };
}

export function mergeLessonProgress(
  local: LessonProgress,
  remote: LessonProgress
): LessonProgress {
  const localRank = STATUS_RANK[local.status];
  const remoteRank = STATUS_RANK[remote.status];

  if (remoteRank > localRank) return remote;
  if (localRank > remoteRank) return local;

  const localScore = local.score ?? 0;
  const remoteScore = remote.score ?? 0;
  if (remoteScore > localScore) return remote;
  if (localScore > remoteScore) return local;

  const localCompleted = local.completedAt ?? "";
  const remoteCompleted = remote.completedAt ?? "";
  return remoteCompleted.localeCompare(localCompleted) >= 0 ? remote : local;
}

function upsertLessonProgress(
  courseProgress: CourseProgress,
  lessonProgress: LessonProgress
): CourseProgress {
  const lessons = {
    ...courseProgress.lessons,
    [lessonProgress.lessonId]: lessonProgress,
  };

  return recomputeCourseProgress(
    courseProgress.courseId,
    courseProgress.totalLessons,
    lessons
  );
}
