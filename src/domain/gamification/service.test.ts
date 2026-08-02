import { describe, expect, it } from "vitest";
import {
  applyLessonCompleted,
  emptyGamificationState,
  isDailyGoalMet,
  normalizeGamificationState,
  refreshGamificationForToday,
} from "./service";
import { levelFromXp, localDateKey, xpRequiredForLevel } from "./rules";

function atLocal(year: number, month: number, day: number, hour = 12) {
  return new Date(year, month - 1, day, hour, 0, 0, 0);
}

describe("xp / levels", () => {
  it("computes level thresholds", () => {
    expect(xpRequiredForLevel(1)).toBe(100);
    expect(xpRequiredForLevel(2)).toBe(150);
    expect(xpRequiredForLevel(3)).toBe(200);
  });

  it("maps xp to levels", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(99)).toBe(1);
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(249)).toBe(2);
    expect(levelFromXp(250)).toBe(3);
  });
});

describe("applyLessonCompleted", () => {
  it("awards lesson XP and first-of-day bonus", () => {
    const now = atLocal(2026, 8, 2);
    const reward = applyLessonCompleted({
      state: emptyGamificationState(),
      courses: {
        c1: { completedLessons: 1, totalLessons: 4 },
      },
      courseJustCompleted: false,
      pathCourseCount: 7,
      now,
    });

    expect(reward.xpGained).toBe(30); // 20 + 10
    expect(reward.state.xp).toBe(30);
    expect(reward.state.currentStreak).toBe(1);
    expect(reward.streakExtended).toBe(true);
    expect(reward.dailyGoalCompleted).toBe(true);
    expect(reward.newlyUnlockedAchievementIds).toContain("first_lesson");
  });

  it("does not re-award first-of-day bonus on second lesson same day", () => {
    const now = atLocal(2026, 8, 2);
    const first = applyLessonCompleted({
      state: emptyGamificationState(),
      courses: { c1: { completedLessons: 1, totalLessons: 4 } },
      courseJustCompleted: false,
      pathCourseCount: 7,
      now,
    });
    const second = applyLessonCompleted({
      state: first.state,
      courses: { c1: { completedLessons: 2, totalLessons: 4 } },
      courseJustCompleted: false,
      pathCourseCount: 7,
      now,
    });

    expect(second.xpGained).toBe(20);
    expect(second.streakExtended).toBe(false);
    expect(second.dailyGoalCompleted).toBe(false);
    expect(second.state.currentStreak).toBe(1);
    expect(second.state.todayCompletedLessons).toBe(2);
  });

  it("extends streak across consecutive days", () => {
    const day1 = atLocal(2026, 8, 1);
    const day2 = atLocal(2026, 8, 2);
    const first = applyLessonCompleted({
      state: emptyGamificationState(),
      courses: { c1: { completedLessons: 1, totalLessons: 4 } },
      courseJustCompleted: false,
      pathCourseCount: 7,
      now: day1,
    });
    const second = applyLessonCompleted({
      state: first.state,
      courses: { c1: { completedLessons: 2, totalLessons: 4 } },
      courseJustCompleted: false,
      pathCourseCount: 7,
      now: day2,
    });

    expect(second.state.currentStreak).toBe(2);
    expect(second.streakExtended).toBe(true);
  });

  it("resets streak after a gap", () => {
    const day1 = atLocal(2026, 8, 1);
    const day3 = atLocal(2026, 8, 3);
    const first = applyLessonCompleted({
      state: emptyGamificationState(),
      courses: { c1: { completedLessons: 1, totalLessons: 4 } },
      courseJustCompleted: false,
      pathCourseCount: 7,
      now: day1,
    });
    const later = applyLessonCompleted({
      state: first.state,
      courses: { c1: { completedLessons: 2, totalLessons: 4 } },
      courseJustCompleted: false,
      pathCourseCount: 7,
      now: day3,
    });

    expect(later.state.currentStreak).toBe(1);
  });

  it("awards course complete bonus and unlocks first_course", () => {
    const reward = applyLessonCompleted({
      state: emptyGamificationState(),
      courses: { c1: { completedLessons: 4, totalLessons: 4 } },
      courseJustCompleted: true,
      pathCourseCount: 7,
      now: atLocal(2026, 8, 2),
    });

    expect(reward.xpGained).toBe(80); // 20 + 10 + 50
    expect(reward.newlyUnlockedAchievementIds).toContain("first_course");
  });

  it("levels up when crossing threshold", () => {
    const state = {
      ...emptyGamificationState(),
      xp: 90,
      level: 1,
    };
    const reward = applyLessonCompleted({
      state,
      courses: { c1: { completedLessons: 1, totalLessons: 4 } },
      courseJustCompleted: false,
      pathCourseCount: 7,
      now: atLocal(2026, 8, 2),
    });

    // 90 + 30 = 120 → level 2
    expect(reward.state.xp).toBe(120);
    expect(reward.leveledUp).toBe(true);
    expect(reward.state.level).toBe(2);
    expect(reward.newlyUnlockedAchievementIds).toContain("xp_100");
  });

  it("unlocks streak_3 after three consecutive days", () => {
    let state = emptyGamificationState();
    for (let day = 1; day <= 3; day += 1) {
      const reward = applyLessonCompleted({
        state,
        courses: { c1: { completedLessons: day, totalLessons: 10 } },
        courseJustCompleted: false,
        pathCourseCount: 7,
        now: atLocal(2026, 8, day),
      });
      state = reward.state;
      if (day === 3) {
        expect(reward.state.currentStreak).toBe(3);
        expect(reward.newlyUnlockedAchievementIds).toContain("streak_3");
      }
    }
  });
});

describe("normalize / today refresh", () => {
  it("fills defaults for missing gamification", () => {
    const state = normalizeGamificationState(undefined);
    expect(state.xp).toBe(0);
    expect(state.level).toBe(1);
    expect(state.unlockedAchievementIds).toEqual([]);
  });

  it("resets today counter when date rolls", () => {
    const yesterday = localDateKey(atLocal(2026, 8, 1));
    const state = refreshGamificationForToday(
      {
        ...emptyGamificationState(),
        todayDate: yesterday,
        todayCompletedLessons: 1,
        lastActivityDate: yesterday,
        currentStreak: 2,
      },
      atLocal(2026, 8, 2)
    );

    expect(state.todayCompletedLessons).toBe(0);
    expect(state.todayDate).toBe(localDateKey(atLocal(2026, 8, 2)));
    expect(isDailyGoalMet(state, atLocal(2026, 8, 2))).toBe(false);
  });
});
