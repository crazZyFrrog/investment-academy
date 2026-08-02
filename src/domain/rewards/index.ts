export {
  REWARD_CATALOG,
  getRewardById,
  getRewardForCourseSlug,
  sideCourseRewardIds,
  type RewardDefinition,
  type RewardId,
  type RewardKind,
} from "./catalog";
export {
  getRedeemedRewardIds,
  getRewardLockReason,
  getRewardStatus,
  isRewardRedeemed,
  isRewardUnlocked,
  listRewardViewModels,
  redeemReward,
  type RedeemRewardResult,
  type RewardStatus,
  type RewardViewModel,
} from "./service";
