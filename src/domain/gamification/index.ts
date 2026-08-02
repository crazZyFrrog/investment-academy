export {
  emptyGamificationState,
  normalizeGamificationState,
  applyLessonCompleted,
  refreshGamificationForToday,
  isDailyGoalMet,
} from "./service";
export {
  ACHIEVEMENTS,
  getAchievementById,
  evaluateAchievements,
} from "./achievements";
export {
  XP_PER_LESSON,
  XP_FIRST_OF_DAY,
  XP_COURSE_COMPLETE,
  DAILY_GOAL_LESSONS,
  ACTIVITY_DATES_LIMIT,
  xpRequiredForLevel,
  levelFromXp,
  xpProgressInLevel,
  localDateKey,
  previousLocalDateKey,
} from "./rules";
export type {
  GamificationState,
  AchievementDefinition,
  LessonCompletedReward,
  ApplyLessonCompletedInput,
} from "./types";
