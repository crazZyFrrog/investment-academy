import { describe, expect, it } from "vitest";
import {
  completeLesson,
  mergeLessonProgress,
  recomputeCourseProgress,
  startLesson,
} from "@/domain/progress/service";
import type { CourseProgress, LessonProgress } from "@/domain/progress/types";

function emptyCourse(totalLessons = 4): CourseProgress {
  return recomputeCourseProgress("course-a", totalLessons, {});
}

describe("progress service", () => {
  it("starts a lesson as in_progress", () => {
    const next = startLesson(emptyCourse(), "lesson-1");
    expect(next.lessons["lesson-1"]?.status).toBe("in_progress");
    expect(next.completedLessons).toBe(0);
    expect(next.percentComplete).toBe(0);
  });

  it("completes a lesson and recomputes percent", () => {
    const started = startLesson(emptyCourse(4), "lesson-1");
    const next = completeLesson(started, "lesson-1", 100);
    expect(next.lessons["lesson-1"]?.status).toBe("completed");
    expect(next.lessons["lesson-1"]?.score).toBe(100);
    expect(next.completedLessons).toBe(1);
    expect(next.percentComplete).toBe(25);
  });

  it("does not downgrade a completed lesson on start", () => {
    const completed = completeLesson(emptyCourse(), "lesson-1");
    const next = startLesson(completed, "lesson-1");
    expect(next.lessons["lesson-1"]?.status).toBe("completed");
  });

  it("merges remote progress when remote is further along", () => {
    const local: LessonProgress = {
      lessonId: "l1",
      courseId: "c1",
      status: "in_progress",
      version: 1,
      startedAt: "2026-01-01T00:00:00.000Z",
    };
    const remote: LessonProgress = {
      lessonId: "l1",
      courseId: "c1",
      status: "completed",
      version: 2,
      score: 100,
      startedAt: "2026-01-01T00:00:00.000Z",
      completedAt: "2026-01-02T00:00:00.000Z",
    };
    expect(mergeLessonProgress(local, remote).status).toBe("completed");
  });
});
