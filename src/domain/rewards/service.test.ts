import { describe, expect, it } from "vitest";
import { buildCoursesBySlug } from "@/features/learning/unlock";
import { emptyGamificationState } from "@/domain/gamification";
import {
  getRewardStatus,
  isRewardUnlocked,
  redeemReward,
} from "@/domain/rewards";
import { REWARD_CATALOG } from "@/domain/rewards/catalog";
import type { ProgressSnapshot } from "@/domain/progress/types";
import { learningPathOrder } from "@/features/catalog/labels";

const courses = learningPathOrder.slice(0, 4).map((slug) => ({
  id: slug,
  slug,
  lessonCount: 2,
}));

function snapshotWithPathComplete(
  count: number,
  xp = 0,
  redeemedRewardIds: string[] = []
): ProgressSnapshot {
  const coursesMap: ProgressSnapshot["courses"] = {};

  for (let i = 0; i < count; i++) {
    const courseId = courses[i]!.id;
    coursesMap[courseId] = {
      courseId,
      completedLessons: 2,
      totalLessons: 2,
      percentComplete: 100,
      lessons: {
        [`${courseId}-l1`]: {
          lessonId: `${courseId}-l1`,
          courseId,
          status: "completed",
          version: 1,
          completedAt: "2026-01-01T00:00:00.000Z",
        },
        [`${courseId}-l2`]: {
          lessonId: `${courseId}-l2`,
          courseId,
          status: "completed",
          version: 1,
          completedAt: "2026-01-01T00:00:00.000Z",
        },
      },
    };
  }

  return {
    userId: "guest-test",
    updatedAt: "2026-01-01T00:00:00.000Z",
    courses: coursesMap,
    gamification: { ...emptyGamificationState(), xp },
    redeemedRewardIds,
  };
}

describe("reward redemption", () => {
  const bySlug = buildCoursesBySlug(courses);
  const firstReward = REWARD_CATALOG[0]!;

  it("does not unlock rewards until they are redeemed", () => {
    const snapshot = snapshotWithPathComplete(
      firstReward.minPathCourses,
      firstReward.xpCost
    );
    expect(isRewardUnlocked(firstReward.id, snapshot)).toBe(false);
  });

  it("marks reward as redeemable when path and XP are sufficient", () => {
    const snapshot = snapshotWithPathComplete(
      firstReward.minPathCourses,
      firstReward.xpCost
    );
    expect(getRewardStatus(firstReward, snapshot, bySlug).status).toBe(
      "redeemable"
    );
  });

  it("deducts XP and stores redeemed reward id", () => {
    const snapshot = snapshotWithPathComplete(3, 500);
    const result = redeemReward(snapshot, "simulator", bySlug);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.snapshot.redeemedRewardIds).toContain("simulator");
    expect(result.snapshot.gamification?.xp).toBe(200);
    expect(isRewardUnlocked("simulator", result.snapshot)).toBe(true);
  });

  it("rejects redeem when XP is insufficient", () => {
    const snapshot = snapshotWithPathComplete(3, 100);
    const result = redeemReward(snapshot, "simulator", bySlug);
    expect(result.ok).toBe(false);
  });
});
