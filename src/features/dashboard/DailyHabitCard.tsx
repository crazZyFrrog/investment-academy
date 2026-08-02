"use client";

import Link from "next/link";
import { ArrowRight, Flame, Zap } from "@/design-system/icons";
import type { CourseSummary } from "@/domain/course/types";
import type { LessonSummary } from "@/domain/lesson/types";
import {
  DAILY_GOAL_LESSONS,
  isDailyGoalMet,
  refreshGamificationForToday,
  xpProgressInLevel,
} from "@/domain/gamification";
import { useUserId } from "@/hooks/use-user-id";
import { useCourseProgress, useProgressSnapshot } from "@/queries/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourseUnlock } from "@/features/learning/use-course-unlock";
import { cn } from "@/lib/utils";

export function DailyHabitCard({
  courses,
  lessonsByCourseId,
}: {
  courses: CourseSummary[];
  lessonsByCourseId: Record<string, LessonSummary[]>;
}) {
  const { continueSlug, isLoading: unlockLoading } = useCourseUnlock(courses);
  const course =
    courses.find((item) => item.slug === continueSlug) ?? courses[0] ?? null;

  if (!course) return null;

  return (
    <DailyHabitCardInner
      key={course.id}
      course={course}
      lessons={lessonsByCourseId[course.id] ?? []}
      ready={!unlockLoading}
    />
  );
}

function DailyHabitCardInner({
  course,
  lessons,
  ready,
}: {
  course: CourseSummary;
  lessons: LessonSummary[];
  ready: boolean;
}) {
  const userId = useUserId();
  const { data: snapshot, isLoading: snapshotLoading } =
    useProgressSnapshot(userId);
  const { data: progress } = useCourseProgress(
    userId,
    course.id,
    course.lessonCount
  );

  const nextLesson =
    lessons.find((lesson) => {
      const status = progress?.lessons[lesson.id]?.status;
      return status !== "completed";
    }) ?? lessons[0];

  const href = nextLesson
    ? `/courses/${course.slug}/lessons/${nextLesson.slug}`
    : `/courses/${course.slug}`;

  if (snapshotLoading || !snapshot) {
    return <Skeleton className="h-36 w-full rounded-[var(--radius-xl)]" />;
  }

  const gamification = refreshGamificationForToday(
    snapshot.gamification ?? {
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
  const goalMet = isDailyGoalMet(gamification);
  const levelProgress = xpProgressInLevel(gamification.xp);
  const todayCount = Math.min(
    gamification.todayCompletedLessons,
    DAILY_GOAL_LESSONS
  );
  const goalPercent = Math.round((todayCount / DAILY_GOAL_LESSONS) * 100);

  return (
    <Card
      className={cn(
        "overflow-hidden shadow-sm transition-opacity",
        !ready && "opacity-70"
      )}
    >
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-label">Сегодня</p>
            <h2 className="text-heading-3">
              {goalMet ? "Цель дня выполнена" : "Цель дня"}
            </h2>
            <p className="text-caption">
              {goalMet
                ? "Отличная серия — можно продолжить или вернуться завтра."
                : `Завершите ${DAILY_GOAL_LESSONS} урок, чтобы сохранить серию.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-[var(--radius-lg)] px-3 py-2",
                gamification.currentStreak > 0
                  ? "bg-warning/15 text-warning"
                  : "bg-muted text-text-tertiary"
              )}
              title="Серия дней"
            >
              <Flame className="size-4" aria-hidden />
              <span className="text-sm font-medium tabular-nums">
                {gamification.currentStreak}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-[var(--radius-lg)] bg-primary/10 px-3 py-2 text-primary"
              title="Опыт"
            >
              <Zap className="size-4" aria-hidden />
              <span className="text-sm font-medium tabular-nums">
                {gamification.xp} XP
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-caption">Уроки сегодня</p>
              <p className="text-caption tabular-nums text-text-primary">
                {todayCount}/{DAILY_GOAL_LESSONS}
              </p>
            </div>
            <Progress value={goalPercent} size="sm" aria-label="Цель дня" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-caption">Уровень {levelProgress.level}</p>
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
        </div>

        <Button asChild className="w-full sm:w-auto">
          <Link href={href}>
            {goalMet ? "Продолжить обучение" : "К сегодняшнему уроку"}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
