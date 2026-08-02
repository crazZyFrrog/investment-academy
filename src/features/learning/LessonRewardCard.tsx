"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Award,
  Check,
  Flame,
  Sparkles,
  Trophy,
  Zap,
} from "@/design-system/icons";
import type { LessonCompletedReward } from "@/domain/gamification/types";
import { getAchievementById } from "@/domain/gamification";
import { CelebrateComplete } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LessonRewardCard({
  reward,
  nextHref,
  nextLabel,
  courseCompleted,
}: {
  reward: LessonCompletedReward;
  nextHref: string;
  nextLabel: string;
  courseCompleted?: boolean;
}) {
  const achievements = reward.newlyUnlockedAchievementIds
    .map((id) => getAchievementById(id))
    .filter(Boolean);

  return (
    <CelebrateComplete>
      <div className="space-y-4 rounded-[var(--radius-xl)] border border-primary/20 bg-primary/[0.05] px-4 py-5 sm:px-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-primary text-primary-foreground">
            {courseCompleted ? (
              <Trophy className="size-5" aria-hidden />
            ) : (
              <Check className="size-5" aria-hidden />
            )}
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-text-primary">
              {courseCompleted ? "Курс завершён!" : "Урок завершён"}
            </p>
            <p className="text-caption">
              {reward.dailyGoalCompleted
                ? "Цель дня выполнена. Прогресс сохранён на этом устройстве."
                : "Прогресс сохранён на этом устройстве."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <RewardChip
            icon={<Zap className="size-3.5" />}
            label={`+${reward.xpGained} XP`}
            accent
          />
          {reward.streakExtended ? (
            <RewardChip
              icon={<Flame className="size-3.5" />}
              label={`Серия ${reward.state.currentStreak}`}
            />
          ) : null}
          {reward.leveledUp ? (
            <RewardChip
              icon={<Sparkles className="size-3.5" />}
              label={`Уровень ${reward.state.level}`}
            />
          ) : null}
        </div>

        {achievements.length > 0 ? (
          <ul className="space-y-2">
            {achievements.map((achievement) =>
              achievement ? (
                <li
                  key={achievement.id}
                  className="flex items-start gap-2 rounded-[var(--radius-lg)] border border-border bg-surface px-3 py-2.5"
                >
                  <Award className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary">
                      {achievement.title}
                    </p>
                    <p className="text-caption">{achievement.description}</p>
                  </div>
                </li>
              ) : null
            )}
          </ul>
        ) : null}

        <Button asChild className="w-full" size="lg">
          <Link href={nextHref}>{nextLabel}</Link>
        </Button>
      </div>
    </CelebrateComplete>
  );
}

function RewardChip({
  icon,
  label,
  accent = false,
}: {
  icon: ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        accent
          ? "bg-primary text-primary-foreground"
          : "bg-surface text-text-primary ring-1 ring-border"
      )}
    >
      {icon}
      {label}
    </span>
  );
}
