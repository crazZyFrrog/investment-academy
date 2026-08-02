import { z } from "zod";
import type { ProgressSnapshot } from "@/domain/progress/types";
import { normalizeGamificationState } from "@/domain/gamification";

export const PROGRESS_BACKUP_VERSION = 1 as const;

const lessonProgressSchema = z.object({
  lessonId: z.string(),
  courseId: z.string(),
  status: z.enum(["not_started", "in_progress", "completed"]),
  score: z.number().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  lastReviewedAt: z.string().optional(),
  reviewIntervalDays: z.number().optional(),
  version: z.number(),
});

const courseProgressSchema = z.object({
  courseId: z.string(),
  completedLessons: z.number(),
  totalLessons: z.number(),
  percentComplete: z.number(),
  lastAccessedAt: z.string().optional(),
  lessons: z.record(z.string(), lessonProgressSchema),
});

const gamificationSchema = z
  .object({
    xp: z.number(),
    level: z.number(),
    currentStreak: z.number(),
    longestStreak: z.number(),
    lastActivityDate: z.string().nullable(),
    todayCompletedLessons: z.number(),
    todayDate: z.string().nullable(),
    unlockedAchievementIds: z.array(z.string()),
    activityDates: z.array(z.string()),
  })
  .partial()
  .optional();

const progressSnapshotSchema = z.object({
  userId: z.string(),
  courses: z.record(z.string(), courseProgressSchema),
  updatedAt: z.string(),
  gamification: gamificationSchema,
});

export const progressBackupSchema = z.object({
  version: z.literal(PROGRESS_BACKUP_VERSION),
  exportedAt: z.string(),
  snapshot: progressSnapshotSchema,
});

export type ProgressBackup = {
  version: typeof PROGRESS_BACKUP_VERSION;
  exportedAt: string;
  snapshot: ProgressSnapshot;
};

export function createProgressBackup(
  snapshot: ProgressSnapshot
): ProgressBackup {
  return {
    version: PROGRESS_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    snapshot: {
      ...snapshot,
      gamification: normalizeGamificationState(snapshot.gamification),
    },
  };
}

export function parseProgressBackup(raw: unknown): ProgressBackup {
  const parsed = progressBackupSchema.parse(raw);
  return {
    version: parsed.version,
    exportedAt: parsed.exportedAt,
    snapshot: {
      userId: parsed.snapshot.userId,
      courses: parsed.snapshot.courses,
      updatedAt: parsed.snapshot.updatedAt,
      gamification: normalizeGamificationState(parsed.snapshot.gamification),
    },
  };
}

export function parseProgressBackupJson(text: string): ProgressBackup {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("Файл не похож на JSON.");
  }
  return parseProgressBackup(raw);
}

/** Remap imported snapshot onto the current guest/session user. */
export function snapshotForUser(
  snapshot: ProgressSnapshot,
  userId: string
): ProgressSnapshot {
  return {
    ...snapshot,
    userId,
    updatedAt: new Date().toISOString(),
    gamification: normalizeGamificationState(snapshot.gamification),
  };
}
