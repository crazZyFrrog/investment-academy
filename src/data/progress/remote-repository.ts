import { and, eq } from "drizzle-orm";
import type {
  CourseProgress,
  LessonProgress,
  LessonStatus,
  ProgressMutation,
  ProgressSnapshot,
} from "@/domain/progress/types";
import { recomputeCourseProgress } from "@/domain/progress/service";
import { getDb } from "@/data/db/client";
import * as schema from "@/data/db/schema";

function toLessonProgress(row: typeof schema.lessonProgress.$inferSelect): LessonProgress {
  return {
    lessonId: row.lessonId,
    courseId: row.courseId,
    status: row.status as LessonStatus,
    score: row.score ?? undefined,
    startedAt: row.startedAt?.toISOString(),
    completedAt: row.completedAt?.toISOString(),
    version: row.version,
  };
}

export class RemoteProgressRepository {
  constructor(private readonly userId: string) {}

  async getSnapshot(): Promise<ProgressSnapshot | null> {
    const db = getDb();
    if (!db) return null;

    const courseRows = await db
      .select()
      .from(schema.courseProgress)
      .where(eq(schema.courseProgress.userId, this.userId));

    const lessonRows = await db
      .select()
      .from(schema.lessonProgress)
      .where(eq(schema.lessonProgress.userId, this.userId));

    if (courseRows.length === 0 && lessonRows.length === 0) {
      return null;
    }

    const courses: Record<string, CourseProgress> = {};

    for (const courseRow of courseRows) {
      const lessonsForCourse = lessonRows.filter(
        (row) => row.courseId === courseRow.courseId
      );
      const lessons = Object.fromEntries(
        lessonsForCourse.map((row) => [row.lessonId, toLessonProgress(row)])
      );

      courses[courseRow.courseId] = recomputeCourseProgress(
        courseRow.courseId,
        courseRow.totalLessons,
        lessons
      );
    }

    for (const lessonRow of lessonRows) {
      if (courses[lessonRow.courseId]) continue;

      const lessons = Object.fromEntries(
        lessonRows
          .filter((row) => row.courseId === lessonRow.courseId)
          .map((row) => [row.lessonId, toLessonProgress(row)])
      );

      courses[lessonRow.courseId] = recomputeCourseProgress(
        lessonRow.courseId,
        Object.keys(lessons).length,
        lessons
      );
    }

    return {
      userId: this.userId,
      courses,
      updatedAt: new Date().toISOString(),
    };
  }

  async applyMutation(mutation: ProgressMutation): Promise<void> {
    const db = getDb();
    if (!db) return;

    const existingEvent = await db
      .select()
      .from(schema.syncEvents)
      .where(eq(schema.syncEvents.mutationId, mutation.mutationId))
      .limit(1);

    if (existingEvent[0]) {
      return;
    }

    await db.insert(schema.syncEvents).values({
      userId: this.userId,
      mutationId: mutation.mutationId,
      courseId: mutation.courseId,
      lessonId: mutation.lessonId,
      status: mutation.status,
      score: mutation.score ?? null,
      occurredAt: new Date(mutation.occurredAt),
    });

    const existingLesson = await db
      .select()
      .from(schema.lessonProgress)
      .where(
        and(
          eq(schema.lessonProgress.userId, this.userId),
          eq(schema.lessonProgress.lessonId, mutation.lessonId)
        )
      )
      .limit(1);

    const now = new Date();
    const lessonValues = {
      userId: this.userId,
      courseId: mutation.courseId,
      lessonId: mutation.lessonId,
      status: mutation.status,
      score: mutation.score ?? null,
      startedAt:
        mutation.status !== "not_started"
          ? existingLesson[0]?.startedAt ?? now
          : null,
      completedAt:
        mutation.status === "completed"
          ? now
          : existingLesson[0]?.completedAt ?? null,
      version: (existingLesson[0]?.version ?? 0) + 1,
      updatedAt: now,
    };

    if (existingLesson[0]) {
      await db
        .update(schema.lessonProgress)
        .set(lessonValues)
        .where(eq(schema.lessonProgress.id, existingLesson[0].id));
    } else {
      await db.insert(schema.lessonProgress).values(lessonValues);
    }

    const allLessons = await db
      .select()
      .from(schema.lessonProgress)
      .where(
        and(
          eq(schema.lessonProgress.userId, this.userId),
          eq(schema.lessonProgress.courseId, mutation.courseId)
        )
      );

    const lessons = Object.fromEntries(
      allLessons.map((row) => [row.lessonId, toLessonProgress(row)])
    );
    const courseProgress = recomputeCourseProgress(
      mutation.courseId,
      allLessons.length,
      lessons
    );

    const existingCourse = await db
      .select()
      .from(schema.courseProgress)
      .where(
        and(
          eq(schema.courseProgress.userId, this.userId),
          eq(schema.courseProgress.courseId, mutation.courseId)
        )
      )
      .limit(1);

    const courseValues = {
      userId: this.userId,
      courseId: mutation.courseId,
      completedLessons: courseProgress.completedLessons,
      totalLessons: courseProgress.totalLessons,
      percentComplete: courseProgress.percentComplete,
      lastAccessedAt: courseProgress.lastAccessedAt
        ? new Date(courseProgress.lastAccessedAt)
        : now,
      updatedAt: now,
    };

    if (existingCourse[0]) {
      await db
        .update(schema.courseProgress)
        .set(courseValues)
        .where(eq(schema.courseProgress.id, existingCourse[0].id));
    } else {
      await db.insert(schema.courseProgress).values(courseValues);
    }
  }

  async saveSnapshot(snapshot: ProgressSnapshot): Promise<void> {
    for (const course of Object.values(snapshot.courses)) {
      for (const lesson of Object.values(course.lessons)) {
        await this.applyMutation({
          mutationId: crypto.randomUUID(),
          courseId: lesson.courseId,
          lessonId: lesson.lessonId,
          status: lesson.status,
          score: lesson.score,
          occurredAt: lesson.completedAt ?? lesson.startedAt ?? new Date().toISOString(),
        });
      }
    }
  }
}
