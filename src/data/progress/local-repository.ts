import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  CourseProgress,
  ProgressMutation,
  ProgressSnapshot,
  SyncOutboxItem,
} from "@/domain/progress/types";
import type { LessonCompletedReward } from "@/domain/gamification/types";
import {
  applyLessonCompleted,
  emptyGamificationState,
  normalizeGamificationState,
} from "@/domain/gamification";
import { AUTH_ENABLED } from "@/data/auth/flags";
import {
  completeLesson,
  recomputeCourseProgress,
  startLesson,
} from "@/domain/progress/service";
import { createId } from "@/lib/id";
import { learningPathOrder } from "@/features/catalog/labels";

function shouldEnqueueOutbox(userId: string): boolean {
  if (!AUTH_ENABLED) return false;
  if (!userId || userId.startsWith("guest-")) return false;
  return true;
}

interface InvestmentAcademyDB extends DBSchema {
  progress: {
    key: string;
    value: ProgressSnapshot;
  };
  outbox: {
    key: string;
    value: SyncOutboxItem;
  };
}

const DB_NAME = "investment-academy";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<InvestmentAcademyDB>> | null = null;

function getDb() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }

  if (!dbPromise) {
    dbPromise = openDB<InvestmentAcademyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("progress")) {
          db.createObjectStore("progress");
        }
        if (!db.objectStoreNames.contains("outbox")) {
          db.createObjectStore("outbox");
        }
      },
    });
  }

  return dbPromise;
}

function emptySnapshot(userId: string): ProgressSnapshot {
  return {
    userId,
    courses: {},
    updatedAt: new Date().toISOString(),
    gamification: emptyGamificationState(),
  };
}

function withNormalizedGamification(
  snapshot: ProgressSnapshot
): ProgressSnapshot {
  return {
    ...snapshot,
    gamification: normalizeGamificationState(snapshot.gamification),
  };
}

export interface CompleteLessonResult {
  courseProgress: CourseProgress;
  reward: LessonCompletedReward | null;
}

export class LocalProgressRepository {
  constructor(private readonly userId: string) {}

  async getSnapshot(): Promise<ProgressSnapshot> {
    const db = await getDb();
    const snapshot = await db.get("progress", this.userId);
    return withNormalizedGamification(snapshot ?? emptySnapshot(this.userId));
  }

  async saveSnapshot(snapshot: ProgressSnapshot): Promise<void> {
    const db = await getDb();
    await db.put(
      "progress",
      withNormalizedGamification(snapshot),
      this.userId
    );
  }

  /** Wipe local progress (and outbox) for this user — guest reset / restore. */
  async clearProgress(): Promise<void> {
    const db = await getDb();
    await db.delete("progress", this.userId);
    const outbox = await db.getAll("outbox");
    await Promise.all(
      outbox.map((item) => db.delete("outbox", item.mutationId))
    );
  }

  async getCourseProgress(
    courseId: string,
    totalLessons: number
  ): Promise<CourseProgress> {
    const snapshot = await this.getSnapshot();
    const existing = snapshot.courses[courseId];

    // Always recompute against catalog lessonCount so unlock stays correct
    // after content version bumps.
    return recomputeCourseProgress(
      courseId,
      totalLessons,
      existing?.lessons ?? {}
    );
  }

  async startLesson(
    courseId: string,
    lessonId: string,
    totalLessons: number
  ): Promise<CourseProgress> {
    const snapshot = await this.getSnapshot();
    const current =
      snapshot.courses[courseId] ??
      recomputeCourseProgress(courseId, totalLessons, {});

    const updated = recomputeCourseProgress(
      courseId,
      totalLessons,
      startLesson(
        { ...current, totalLessons },
        lessonId
      ).lessons
    );
    const nextSnapshot: ProgressSnapshot = {
      ...snapshot,
      courses: { ...snapshot.courses, [courseId]: updated },
      updatedAt: new Date().toISOString(),
      gamification: normalizeGamificationState(snapshot.gamification),
    };

    await this.saveSnapshot(nextSnapshot);
    if (shouldEnqueueOutbox(this.userId)) {
      await this.enqueueMutation({
        mutationId: createId(),
        courseId,
        lessonId,
        status: "in_progress",
        occurredAt: new Date().toISOString(),
      });
    }

    return updated;
  }

  async completeLesson(
    courseId: string,
    lessonId: string,
    totalLessons: number,
    score?: number,
    pathCourseCount: number = learningPathOrder.length
  ): Promise<CompleteLessonResult> {
    const snapshot = await this.getSnapshot();
    const current =
      snapshot.courses[courseId] ??
      recomputeCourseProgress(courseId, totalLessons, {});

    const wasAlreadyCompleted =
      current.lessons[lessonId]?.status === "completed";

    const updated = recomputeCourseProgress(
      courseId,
      totalLessons,
      completeLesson(
        { ...current, totalLessons },
        lessonId,
        score
      ).lessons
    );

    const courses = { ...snapshot.courses, [courseId]: updated };
    let reward: LessonCompletedReward | null = null;
    let gamification = normalizeGamificationState(snapshot.gamification);

    if (!wasAlreadyCompleted) {
      const courseJustCompleted =
        updated.totalLessons > 0 &&
        updated.completedLessons >= updated.totalLessons;

      reward = applyLessonCompleted({
        state: gamification,
        courses: Object.fromEntries(
          Object.entries(courses).map(([id, course]) => [
            id,
            {
              completedLessons: course.completedLessons,
              totalLessons: course.totalLessons,
            },
          ])
        ),
        courseJustCompleted,
        pathCourseCount,
      });
      gamification = reward.state;
    }

    const nextSnapshot: ProgressSnapshot = {
      ...snapshot,
      courses,
      updatedAt: new Date().toISOString(),
      gamification,
    };

    await this.saveSnapshot(nextSnapshot);
    if (shouldEnqueueOutbox(this.userId) && !wasAlreadyCompleted) {
      await this.enqueueMutation({
        mutationId: createId(),
        courseId,
        lessonId,
        status: "completed",
        score,
        occurredAt: new Date().toISOString(),
      });
    }

    return { courseProgress: updated, reward };
  }

  async enqueueMutation(mutation: ProgressMutation): Promise<void> {
    const db = await getDb();
    await db.put(
      "outbox",
      { ...mutation, retries: 0 },
      mutation.mutationId
    );
  }

  async getOutbox(): Promise<SyncOutboxItem[]> {
    const db = await getDb();
    return db.getAll("outbox");
  }

  async removeFromOutbox(mutationId: string): Promise<void> {
    const db = await getDb();
    await db.delete("outbox", mutationId);
  }

  async mergeSnapshot(remote: ProgressSnapshot): Promise<ProgressSnapshot> {
    const local = await this.getSnapshot();
    const mergedCourses: Record<string, CourseProgress> = {
      ...local.courses,
    };

    for (const [courseId, remoteCourse] of Object.entries(remote.courses)) {
      const localCourse = mergedCourses[courseId];
      if (!localCourse) {
        mergedCourses[courseId] = remoteCourse;
        continue;
      }

      const lessons = { ...localCourse.lessons };
      for (const [lessonId, remoteLesson] of Object.entries(
        remoteCourse.lessons
      )) {
        const localLesson = lessons[lessonId];
        if (!localLesson) {
          lessons[lessonId] = remoteLesson;
          continue;
        }

        const { mergeLessonProgress } = await import(
          "@/domain/progress/service"
        );
        lessons[lessonId] = mergeLessonProgress(localLesson, remoteLesson);
      }

      mergedCourses[courseId] = recomputeCourseProgress(
        courseId,
        remoteCourse.totalLessons || localCourse.totalLessons,
        lessons
      );
    }

    // Prefer higher XP when merging remote/local gamification for MVP.
    const localG = normalizeGamificationState(local.gamification);
    const remoteG = normalizeGamificationState(remote.gamification);
    const gamification =
      remoteG.xp > localG.xp
        ? remoteG
        : localG.xp > remoteG.xp
          ? localG
          : localG.longestStreak >= remoteG.longestStreak
            ? localG
            : remoteG;

    const merged: ProgressSnapshot = {
      userId: this.userId,
      courses: mergedCourses,
      updatedAt: new Date().toISOString(),
      gamification,
    };

    await this.saveSnapshot(merged);
    return merged;
  }
}
