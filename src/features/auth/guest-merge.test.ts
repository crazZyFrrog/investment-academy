import { describe, expect, it } from "vitest";
import type { ProgressSnapshot } from "@/domain/progress/types";
import { emptyGamificationState } from "@/domain/gamification";
import { guestHasProgress } from "./guest-progress";

describe("guestHasProgress", () => {
  it("returns false for empty snapshot", () => {
    const snapshot: ProgressSnapshot = {
      userId: "guest-1",
      courses: {},
      updatedAt: new Date().toISOString(),
      gamification: emptyGamificationState(),
    };
    expect(guestHasProgress(snapshot)).toBe(false);
  });

  it("returns true when a lesson was started", () => {
    const snapshot: ProgressSnapshot = {
      userId: "guest-1",
      courses: {
        c1: {
          courseId: "c1",
          completedLessons: 0,
          totalLessons: 1,
          percentComplete: 0,
          lessons: {
            l1: {
              lessonId: "l1",
              courseId: "c1",
              status: "in_progress",
              version: 1,
            },
          },
        },
      },
      updatedAt: new Date().toISOString(),
      gamification: emptyGamificationState(),
    };
    expect(guestHasProgress(snapshot)).toBe(true);
  });
});
