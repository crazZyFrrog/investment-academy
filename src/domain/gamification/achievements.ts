import type { AchievementDefinition, GamificationState } from "./types";

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_lesson",
    title: "Первый шаг",
    description: "Завершите первый урок",
  },
  {
    id: "streak_3",
    title: "Три дня подряд",
    description: "Учитесь 3 дня подряд",
  },
  {
    id: "streak_7",
    title: "Неделя фокуса",
    description: "Учитесь 7 дней подряд",
  },
  {
    id: "lessons_5",
    title: "Пять уроков",
    description: "Завершите 5 уроков",
  },
  {
    id: "first_course",
    title: "Первый курс",
    description: "Полностью пройдите один курс",
  },
  {
    id: "xp_100",
    title: "Сотня опыта",
    description: "Наберите 100 XP",
  },
  {
    id: "courses_3",
    title: "Три курса",
    description: "Завершите 3 курса",
  },
  {
    id: "path_complete",
    title: "Весь путь",
    description: "Пройдите все курсы академии",
  },
];

export function getAchievementById(
  id: string
): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((item) => item.id === id);
}

export interface AchievementEvalContext {
  state: GamificationState;
  totalCompletedLessons: number;
  completedCourses: number;
  pathCourseCount: number;
}

export function evaluateAchievements(
  ctx: AchievementEvalContext
): string[] {
  const unlocked = new Set(ctx.state.unlockedAchievementIds);
  const next: string[] = [];

  const candidates: Array<{ id: string; ok: boolean }> = [
    { id: "first_lesson", ok: ctx.totalCompletedLessons >= 1 },
    { id: "streak_3", ok: ctx.state.currentStreak >= 3 },
    { id: "streak_7", ok: ctx.state.currentStreak >= 7 },
    { id: "lessons_5", ok: ctx.totalCompletedLessons >= 5 },
    { id: "first_course", ok: ctx.completedCourses >= 1 },
    { id: "xp_100", ok: ctx.state.xp >= 100 },
    { id: "courses_3", ok: ctx.completedCourses >= 3 },
    {
      id: "path_complete",
      ok:
        ctx.pathCourseCount > 0 &&
        ctx.completedCourses >= ctx.pathCourseCount,
    },
  ];

  for (const candidate of candidates) {
    if (candidate.ok && !unlocked.has(candidate.id)) {
      next.push(candidate.id);
    }
  }

  return next;
}
