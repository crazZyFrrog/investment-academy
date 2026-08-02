import type { CourseSummary } from "@/domain/course/types";
import type { ProgressSnapshot } from "@/domain/progress/types";
import {
  countCompletedPathCourses,
  getSnapshotXp,
} from "@/features/learning/side-course-rewards";
import { levelFromXp, normalizeGamificationState } from "@/domain/gamification";
import { getRewardById, REWARD_CATALOG, type RewardDefinition } from "./catalog";

export type RewardStatus = "unlocked" | "redeemable" | "need_xp" | "need_path";

export interface RewardViewModel {
  reward: RewardDefinition;
  status: RewardStatus;
  pathDone: number;
  xpBalance: number;
}

export function getRedeemedRewardIds(
  snapshot: ProgressSnapshot | undefined
): string[] {
  if (!Array.isArray(snapshot?.redeemedRewardIds)) return [];
  return [...new Set(snapshot.redeemedRewardIds.filter((id) => typeof id === "string"))];
}

export function isRewardRedeemed(
  rewardId: string,
  snapshot: ProgressSnapshot | undefined
): boolean {
  return getRedeemedRewardIds(snapshot).includes(rewardId);
}

export function isRewardUnlocked(
  rewardId: string,
  snapshot: ProgressSnapshot | undefined
): boolean {
  return isRewardRedeemed(rewardId, snapshot);
}

export function getRewardStatus(
  reward: RewardDefinition,
  snapshot: ProgressSnapshot | undefined,
  coursesBySlug: Map<string, Pick<CourseSummary, "id" | "slug" | "lessonCount">>
): RewardViewModel {
  const pathDone = countCompletedPathCourses(snapshot, coursesBySlug);
  const xpBalance = getSnapshotXp(snapshot);

  if (isRewardRedeemed(reward.id, snapshot)) {
    return { reward, status: "unlocked", pathDone, xpBalance };
  }

  if (pathDone < reward.minPathCourses) {
    return { reward, status: "need_path", pathDone, xpBalance };
  }

  if (xpBalance < reward.xpCost) {
    return { reward, status: "need_xp", pathDone, xpBalance };
  }

  return { reward, status: "redeemable", pathDone, xpBalance };
}

export function listRewardViewModels(
  snapshot: ProgressSnapshot | undefined,
  coursesBySlug: Map<string, Pick<CourseSummary, "id" | "slug" | "lessonCount">>
): RewardViewModel[] {
  return REWARD_CATALOG.map((reward) =>
    getRewardStatus(reward, snapshot, coursesBySlug)
  );
}

export type RedeemRewardResult =
  | { ok: true; snapshot: ProgressSnapshot }
  | { ok: false; error: string };

export function redeemReward(
  snapshot: ProgressSnapshot,
  rewardId: string,
  coursesBySlug: Map<string, Pick<CourseSummary, "id" | "slug" | "lessonCount">>
): RedeemRewardResult {
  const reward = getRewardById(rewardId);
  if (!reward) {
    return { ok: false, error: "Награда не найдена." };
  }

  if (isRewardRedeemed(rewardId, snapshot)) {
    return { ok: false, error: "Эта награда уже открыта." };
  }

  const status = getRewardStatus(reward, snapshot, coursesBySlug);
  if (status.status === "need_path") {
    return {
      ok: false,
      error: `Сначала завершите ${reward.minPathCourses} ${
        reward.minPathCourses === 1 ? "курс" : "курса"
      } основного пути.`,
    };
  }

  if (status.status === "need_xp") {
    return {
      ok: false,
      error: `Нужно ${reward.xpCost} XP, у вас ${status.xpBalance}.`,
    };
  }

  const gamification = normalizeGamificationState(snapshot.gamification);
  const nextXp = gamification.xp - reward.xpCost;

  const nextSnapshot: ProgressSnapshot = {
    ...snapshot,
    updatedAt: new Date().toISOString(),
    redeemedRewardIds: [...getRedeemedRewardIds(snapshot), rewardId],
    gamification: {
      ...gamification,
      xp: nextXp,
      level: levelFromXp(nextXp),
    },
  };

  return { ok: true, snapshot: nextSnapshot };
}

export function getRewardLockReason(
  rewardId: string,
  snapshot: ProgressSnapshot | undefined,
  coursesBySlug: Map<string, Pick<CourseSummary, "id" | "slug" | "lessonCount">>
): string | null {
  const reward = getRewardById(rewardId);
  if (!reward) return null;
  if (isRewardRedeemed(rewardId, snapshot)) return null;

  const { status, pathDone, xpBalance } = getRewardStatus(
    reward,
    snapshot,
    coursesBySlug
  );

  if (status === "need_path") {
    return `Награда: завершите ${reward.minPathCourses} ${
      reward.minPathCourses === 1 ? "курс" : "курса"
    } основного пути (сейчас ${pathDone}). Затем обменяйте ${reward.xpCost} XP в разделе «Награды».`;
  }

  if (status === "need_xp") {
    return `Награда: обменяйте ${reward.xpCost} XP в разделе «Награды» (сейчас ${xpBalance} XP).`;
  }

  return `Награда готова к обмену за ${reward.xpCost} XP в разделе «Награды».`;
}
