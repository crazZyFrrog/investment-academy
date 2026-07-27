import { describe, expect, it } from "vitest";
import {
  createProgressBackup,
  parseProgressBackupJson,
  snapshotForUser,
} from "./backup";
import type { ProgressSnapshot } from "@/domain/progress/types";

const sample: ProgressSnapshot = {
  userId: "guest-old",
  updatedAt: "2026-01-01T00:00:00.000Z",
  courses: {
    "course-1": {
      courseId: "course-1",
      completedLessons: 1,
      totalLessons: 4,
      percentComplete: 25,
      lessons: {
        "lesson-1": {
          lessonId: "lesson-1",
          courseId: "course-1",
          status: "completed",
          score: 100,
          version: 1,
          completedAt: "2026-01-01T00:00:00.000Z",
        },
      },
    },
  },
};

describe("progress backup", () => {
  it("round-trips export JSON", () => {
    const backup = createProgressBackup(sample);
    const parsed = parseProgressBackupJson(JSON.stringify(backup));
    expect(parsed.version).toBe(1);
    expect(parsed.snapshot.courses["course-1"]?.completedLessons).toBe(1);
  });

  it("rejects invalid payload", () => {
    expect(() => parseProgressBackupJson("{}")).toThrow();
    expect(() => parseProgressBackupJson("not-json")).toThrow();
  });

  it("remaps userId for import", () => {
    const next = snapshotForUser(sample, "guest-new");
    expect(next.userId).toBe("guest-new");
    expect(next.courses["course-1"]?.completedLessons).toBe(1);
  });
});
