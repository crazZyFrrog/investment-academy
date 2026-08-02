"use client";

import {
  Award,
  Flame,
  Lock,
  Zap,
} from "@/design-system/icons";
import {
  ACHIEVEMENTS,
  localDateKey,
  refreshGamificationForToday,
  xpProgressInLevel,
} from "@/domain/gamification";
import type { GamificationState } from "@/domain/gamification/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

function lastNDates(n: number, now = new Date()): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(localDateKey(d));
  }
  return dates;
}

export function GamificationPanel({
  gamification,
}: {
  gamification?: GamificationState | null;
}) {
  const state = refreshGamificationForToday(
    gamification ?? {
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      todayCompletedLessons: 0,
      todayDate: null,
      unlockedAchievementIds: [],
      activityDates: [],
    }
  );
  const levelProgress = xpProgressInLevel(state.xp);
  const unlocked = new Set(state.unlockedAchievementIds);
  const week = lastNDates(14);
  const active = new Set(state.activityDates);

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-heading-3">Опыт и серия</h2>
            <p className="text-caption">
              Уровень {levelProgress.level} · лучшая серия{" "}
              {state.longestStreak}{" "}
              {state.longestStreak === 1 ? "день" : "дней"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] bg-warning/15 px-3 py-2 text-sm font-medium text-warning">
              <Flame className="size-4" aria-hidden />
              {state.currentStreak}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] bg-accent/15 px-3 py-2 text-sm font-medium text-accent">
              <Zap className="size-4" aria-hidden />
              {state.xp} XP
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-caption">До следующего уровня</p>
            <p className="text-caption tabular-nums text-text-primary">
              {levelProgress.current}/{levelProgress.required} XP
            </p>
          </div>
          <Progress
            value={Math.round(
              (levelProgress.current / levelProgress.required) * 100
            )}
            size="sm"
            aria-label="Прогресс уровня"
          />
        </div>

        <div className="space-y-2">
          <p className="text-caption">Активность · 14 дней</p>
          <div className="flex flex-wrap gap-1.5">
            {week.map((date) => {
              const isActive = active.has(date);
              const isToday = date === localDateKey();
              return (
                <span
                  key={date}
                  title={date}
                  className={cn(
                    "size-3 rounded-sm sm:size-3.5",
                    isActive
                      ? "bg-primary"
                      : "bg-primary/12",
                    isToday && "ring-2 ring-accent/50 ring-offset-1 ring-offset-surface"
                  )}
                  aria-label={
                    isActive ? `Активность ${date}` : `Нет активности ${date}`
                  }
                />
              );
            })}
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="text-heading-3">Достижения</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlocked.has(achievement.id);
            return (
              <Card
                key={achievement.id}
                className={cn(
                  "flex items-start gap-3 p-4",
                  !isUnlocked && "opacity-60"
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-lg)]",
                    isUnlocked
                      ? "bg-accent/15 text-accent"
                      : "bg-muted text-text-tertiary"
                  )}
                >
                  {isUnlocked ? (
                    <Award className="size-4" aria-hidden />
                  ) : (
                    <Lock className="size-4" aria-hidden />
                  )}
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium text-text-primary">
                    {achievement.title}
                  </p>
                  <p className="text-caption">{achievement.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
