import { describe, expect, it } from "vitest";
import { buildCoursesBySlug } from "@/features/learning/unlock";
import {
  getSimulatorLockReason,
  isSimulatorRewardUnlocked,
} from "@/features/learning/simulator-reward";
import type { ProgressSnapshot } from "@/domain/progress/types";
import { emptyGamificationState } from "@/domain/gamification";
import { learningPathOrder } from "@/features/catalog/labels";

const courses = learningPathOrder.slice(0, 4).map((slug) => ({
  id: slug,
  slug,
  lessonCount: 2,
}));

describe("simulator reward", () => {
  const bySlug = buildCoursesBySlug(courses);

  it("locks the simulator until it is redeemed", () => {
    const snapshot: ProgressSnapshot = {
      userId: "guest-test",
      updatedAt: "2026-01-01T00:00:00.000Z",
      courses: {},
      gamification: { ...emptyGamificationState(), xp: 1000 },
      redeemedRewardIds: [],
    };
    expect(isSimulatorRewardUnlocked(snapshot, bySlug)).toBe(false);
    expect(getSimulatorLockReason(snapshot, bySlug)).toContain("Награды");
  });

  it("unlocks after redemption", () => {
    const snapshot: ProgressSnapshot = {
      userId: "guest-test",
      updatedAt: "2026-01-01T00:00:00.000Z",
      courses: {},
      gamification: emptyGamificationState(),
      redeemedRewardIds: ["simulator"],
    };
    expect(isSimulatorRewardUnlocked(snapshot, bySlug)).toBe(true);
    expect(getSimulatorLockReason(snapshot, bySlug)).toBeNull();
  });
});
