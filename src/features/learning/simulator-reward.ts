import type { ProgressSnapshot } from "@/domain/progress/types";
import type { CourseSummary } from "@/domain/course/types";
import {
  getRewardLockReason,
  isRewardUnlocked,
  REWARD_CATALOG,
} from "@/domain/rewards";

/** Reward gate for the portfolio simulator practice tool. */
export const simulatorReward = {
  minPathCourses: 3,
  minXp: 300,
  label: "300 XP",
} as const;

const SIMULATOR_REWARD_ID = "simulator";

export function isSimulatorRewardUnlocked(
  snapshot: ProgressSnapshot | undefined
): boolean {
  return isRewardUnlocked(SIMULATOR_REWARD_ID, snapshot);
}

export function getSimulatorLockReason(
  snapshot: ProgressSnapshot | undefined,
  coursesBySlug: Map<string, Pick<CourseSummary, "id" | "slug" | "lessonCount">>
): string | null {
  const reward = REWARD_CATALOG.find((item) => item.id === SIMULATOR_REWARD_ID);
  if (!reward) return null;
  return getRewardLockReason(reward.id, snapshot, coursesBySlug);
}
