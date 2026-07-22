export type LessonStatus = "not_started" | "in_progress" | "completed";

export interface LessonProgress {
  lessonId: string;
  courseId: string;
  status: LessonStatus;
  score?: number;
  startedAt?: string;
  completedAt?: string;
  version: number;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
  lastAccessedAt?: string;
  lessons: Record<string, LessonProgress>;
}

export interface ProgressSnapshot {
  userId: string;
  courses: Record<string, CourseProgress>;
  updatedAt: string;
}

export interface ProgressMutation {
  mutationId: string;
  courseId: string;
  lessonId: string;
  status: LessonStatus;
  score?: number;
  occurredAt: string;
}

export interface SyncOutboxItem extends ProgressMutation {
  retries: number;
  lastAttemptAt?: string;
}
