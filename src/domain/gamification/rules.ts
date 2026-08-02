/** XP awarded when a lesson is completed for the first time. */
export const XP_PER_LESSON = 20;

/** Bonus XP for the first completed lesson of a local calendar day. */
export const XP_FIRST_OF_DAY = 10;

/** Bonus XP when a course reaches 100% on this completion. */
export const XP_COURSE_COMPLETE = 50;

/** Daily goal: complete this many lessons per local day. */
export const DAILY_GOAL_LESSONS = 1;

/** Keep at most this many activity dates for streak/calendar UI. */
export const ACTIVITY_DATES_LIMIT = 60;

/**
 * XP required to advance from `level` to `level + 1`.
 * Level 1→2 = 100, 2→3 = 150, 3→4 = 200, …
 */
export function xpRequiredForLevel(level: number): number {
  return 100 + Math.max(level - 1, 0) * 50;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  let remaining = Math.max(0, xp);
  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level);
    level += 1;
  }
  return level;
}

/** Progress within the current level toward the next. */
export function xpProgressInLevel(xp: number): {
  level: number;
  current: number;
  required: number;
} {
  let level = 1;
  let remaining = Math.max(0, xp);
  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level);
    level += 1;
  }
  return {
    level,
    current: remaining,
    required: xpRequiredForLevel(level),
  };
}

/** Local calendar date as YYYY-MM-DD. */
export function localDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Previous local calendar day key relative to `date`. */
export function previousLocalDateKey(date: Date = new Date()): string {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  return localDateKey(prev);
}
