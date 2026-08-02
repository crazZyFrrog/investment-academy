import { evaluateAchievements } from "./achievements";
import {
  ACTIVITY_DATES_LIMIT,
  DAILY_GOAL_LESSONS,
  levelFromXp,
  localDateKey,
  previousLocalDateKey,
  XP_COURSE_COMPLETE,
  XP_FIRST_OF_DAY,
  XP_PER_LESSON,
} from "./rules";
import type {
  ApplyLessonCompletedInput,
  GamificationState,
  LessonCompletedReward,
} from "./types";

export function emptyGamificationState(): GamificationState {
  return {
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    todayCompletedLessons: 0,
    todayDate: null,
    unlockedAchievementIds: [],
    activityDates: [],
  };
}

/** Normalize missing/partial gamification from older snapshots or backups. */
export function normalizeGamificationState(
  value: Partial<GamificationState> | null | undefined
): GamificationState {
  const base = emptyGamificationState();
  if (!value) return base;

  const xp = typeof value.xp === "number" && value.xp >= 0 ? value.xp : 0;
  return {
    xp,
    level: levelFromXp(xp),
    currentStreak:
      typeof value.currentStreak === "number" && value.currentStreak >= 0
        ? value.currentStreak
        : 0,
    longestStreak:
      typeof value.longestStreak === "number" && value.longestStreak >= 0
        ? value.longestStreak
        : 0,
    lastActivityDate:
      typeof value.lastActivityDate === "string"
        ? value.lastActivityDate
        : null,
    todayCompletedLessons:
      typeof value.todayCompletedLessons === "number" &&
      value.todayCompletedLessons >= 0
        ? value.todayCompletedLessons
        : 0,
    todayDate: typeof value.todayDate === "string" ? value.todayDate : null,
    unlockedAchievementIds: Array.isArray(value.unlockedAchievementIds)
      ? [...new Set(value.unlockedAchievementIds.filter((id) => typeof id === "string"))]
      : [],
    activityDates: Array.isArray(value.activityDates)
      ? value.activityDates.filter((d) => typeof d === "string")
      : [],
  };
}

function countCompletedLessons(
  courses: ApplyLessonCompletedInput["courses"]
): number {
  return Object.values(courses).reduce(
    (sum, course) => sum + Math.max(0, course.completedLessons),
    0
  );
}

function countCompletedCourses(
  courses: ApplyLessonCompletedInput["courses"]
): number {
  return Object.values(courses).filter(
    (course) =>
      course.totalLessons > 0 && course.completedLessons >= course.totalLessons
  ).length;
}

function pushActivityDate(dates: string[], today: string): string[] {
  const withoutToday = dates.filter((d) => d !== today);
  withoutToday.push(today);
  return withoutToday.slice(-ACTIVITY_DATES_LIMIT);
}

/**
 * Apply rewards for a newly completed lesson.
 * Caller must ensure the lesson was not already completed (idempotent gate).
 */
export function applyLessonCompleted(
  input: ApplyLessonCompletedInput
): LessonCompletedReward {
  const now = input.now ?? new Date();
  const today = localDateKey(now);
  const yesterday = previousLocalDateKey(now);

  let state = normalizeGamificationState(input.state);

  // Roll today counter if the calendar day changed.
  if (state.todayDate !== today) {
    state = {
      ...state,
      todayDate: today,
      todayCompletedLessons: 0,
    };
  }

  const isFirstLessonToday = state.todayCompletedLessons === 0;
  const streakExtended =
    isFirstLessonToday && state.lastActivityDate !== today;

  let currentStreak = state.currentStreak;
  if (isFirstLessonToday) {
    if (state.lastActivityDate === yesterday) {
      currentStreak = Math.max(1, state.currentStreak) + 1;
    } else if (state.lastActivityDate === today) {
      currentStreak = Math.max(1, state.currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  let xpGained = XP_PER_LESSON;
  if (isFirstLessonToday) {
    xpGained += XP_FIRST_OF_DAY;
  }
  if (input.courseJustCompleted) {
    xpGained += XP_COURSE_COMPLETE;
  }

  const previousLevel = state.level;
  const xp = state.xp + xpGained;
  const level = levelFromXp(xp);
  const todayCompletedLessons = state.todayCompletedLessons + 1;
  const dailyGoalCompleted =
    state.todayCompletedLessons < DAILY_GOAL_LESSONS &&
    todayCompletedLessons >= DAILY_GOAL_LESSONS;

  state = {
    ...state,
    xp,
    level,
    currentStreak,
    longestStreak: Math.max(state.longestStreak, currentStreak),
    lastActivityDate: today,
    todayCompletedLessons,
    todayDate: today,
    activityDates: pushActivityDate(state.activityDates, today),
  };

  const newlyUnlockedAchievementIds = evaluateAchievements({
    state,
    totalCompletedLessons: countCompletedLessons(input.courses),
    completedCourses: countCompletedCourses(input.courses),
    pathCourseCount: input.pathCourseCount,
  });

  if (newlyUnlockedAchievementIds.length > 0) {
    state = {
      ...state,
      unlockedAchievementIds: [
        ...state.unlockedAchievementIds,
        ...newlyUnlockedAchievementIds,
      ],
    };
  }

  return {
    state,
    xpGained,
    leveledUp: level > previousLevel,
    previousLevel,
    streakExtended,
    dailyGoalCompleted,
    newlyUnlockedAchievementIds,
  };
}

/** Refresh today counters without awarding XP (for dashboard display). */
export function refreshGamificationForToday(
  state: GamificationState,
  now: Date = new Date()
): GamificationState {
  const normalized = normalizeGamificationState(state);
  const today = localDateKey(now);
  if (normalized.todayDate === today) return normalized;

  // Streak breaks visually if last activity was before yesterday — keep stored
  // currentStreak until next completion, but reset today's progress.
  return {
    ...normalized,
    todayDate: today,
    todayCompletedLessons: 0,
  };
}

export function isDailyGoalMet(
  state: GamificationState,
  now: Date = new Date()
): boolean {
  const refreshed = refreshGamificationForToday(state, now);
  return refreshed.todayCompletedLessons >= DAILY_GOAL_LESSONS;
}
