"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "@/design-system/icons";
import type { CourseSummary } from "@/domain/course/types";
import type { LessonSummary } from "@/domain/lesson/types";
import { useUserId } from "@/hooks/use-user-id";
import {
  useCompleteLesson,
  useCourseProgress,
  useStartLesson,
} from "@/queries/progress";
import { Button } from "@/components/ui/button";
import { CelebrateComplete, FadeIn } from "@/components/motion";
import { LessonMarkdown } from "@/components/lesson/LessonMarkdown";
import { Progress } from "@/components/ui/progress";
import { formatMinutes } from "@/features/catalog/labels";
import { useCourseUnlock } from "@/features/learning/use-course-unlock";
import { getLearningPathIndex } from "@/features/learning/unlock";

export function LessonReader({
  courseSlug,
  courseId,
  courseTitle,
  totalLessons,
  lesson,
  mdxSource,
  lessons,
  pathCourses,
  hasQuiz,
}: {
  courseSlug: string;
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  lesson: LessonSummary;
  mdxSource: MDXRemoteSerializeResult;
  lessons: LessonSummary[];
  pathCourses: CourseSummary[];
  hasQuiz: boolean;
}) {
  const userId = useUserId();
  const { data: progress } = useCourseProgress(userId, courseId, totalLessons);
  const startLesson = useStartLesson(userId, courseId, totalLessons);
  const completeLesson = useCompleteLesson(userId, courseId, totalLessons);
  const hasStartedRef = useRef(false);
  const [quizPassed, setQuizPassed] = useState(false);

  const { isUnlocked, getLockReason, isLoading: unlockLoading } =
    useCourseUnlock(pathCourses);
  // While progress loads, keep non-first path courses locked to avoid a content flash
  const contentLocked = unlockLoading
    ? getLearningPathIndex(courseSlug) > 0
    : !isUnlocked(courseSlug);
  const lockReason = getLockReason(courseSlug);

  const lessonProgress = progress?.lessons[lesson.id];
  const isCompleted = lessonProgress?.status === "completed";
  const index = lessons.findIndex((item) => item.slug === lesson.slug);
  const prev = index > 0 ? lessons[index - 1] : null;
  const next =
    index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;
  const readingProgress =
    lessons.length === 0 ? 0 : Math.round(((index + 1) / lessons.length) * 100);

  const canComplete =
    isCompleted || !hasQuiz || quizPassed || (lessonProgress?.score ?? 0) >= 100;

  useEffect(() => {
    if (contentLocked) return;
    if (hasStartedRef.current) return;
    if (!lessonProgress || lessonProgress.status === "not_started") {
      hasStartedRef.current = true;
      startLesson.mutate(lesson.id);
    }
  }, [contentLocked, lesson.id, lessonProgress, startLesson]);

  if (contentLocked) {
    return (
      <div className="min-h-dvh bg-background">
        <header className="sticky top-0 z-[var(--z-sticky)] border-b border-border bg-background">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-3">
            <Button variant="ghost" size="icon" asChild aria-label="К курсу">
              <Link href={`/courses/${courseSlug}`}>
                <ChevronLeft className="size-5" />
              </Link>
            </Button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption">{courseTitle}</p>
              <p className="truncate text-sm font-medium text-text-primary">
                {lesson.title}
              </p>
            </div>
          </div>
        </header>

        <FadeIn className="mx-auto max-w-2xl px-5 py-16">
          <div className="flex flex-col items-center rounded-[var(--radius-2xl)] border border-border bg-surface px-8 py-14 text-center shadow-xs">
            <div className="mb-5 flex size-14 items-center justify-center rounded-[var(--radius-xl)] bg-muted text-text-tertiary">
              <Lock className="size-6" />
            </div>
            <h1 className="font-display text-2xl tracking-tight">
              Урок пока закрыт
            </h1>
            <p className="mt-3 max-w-sm text-body text-text-secondary">
              {lockReason ??
                "Сначала завершите предыдущий курс: все уроки и тесты."}
            </p>
            <p className="mt-2 text-caption text-text-tertiary">
              Название урока уже видно в программе курса.
            </p>
            <Button asChild className="mt-8">
              <Link href={`/courses/${courseSlug}`}>К программе курса</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-[var(--z-sticky)] border-b border-border bg-background">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-3">
          <Button variant="ghost" size="icon" asChild aria-label="К курсу">
            <Link href={`/courses/${courseSlug}`}>
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption">{courseTitle}</p>
            <p className="truncate text-sm font-medium text-text-primary">
              Урок {lesson.order} из {lessons.length}
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-2xl px-5 pb-3">
          <Progress
            value={readingProgress}
            size="sm"
            aria-label="Позиция в курсе"
          />
        </div>
      </header>

      <FadeIn className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
        <header className="mb-10 space-y-4">
          <p className="text-caption">
            {formatMinutes(lesson.durationMinutes)} чтения
          </p>
          <h1 className="font-display text-[1.85rem] leading-tight tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>
          {lesson.objectives.length > 0 ? (
            <ul className="space-y-2 border-l-2 border-border pl-4">
              {lesson.objectives.map((objective) => (
                <li key={objective} className="text-caption leading-relaxed">
                  {objective}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <LessonMarkdown
          source={mdxSource}
          onQuizPassed={() => setQuizPassed(true)}
        />

        <div className="mt-12 space-y-4 border-t border-border pt-8">
          {isCompleted ? (
            <CelebrateComplete>
              <div className="flex items-start gap-3 rounded-[var(--radius-xl)] border border-primary/20 bg-primary/[0.05] px-4 py-4">
                <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-text-primary">
                    Урок завершён
                  </p>
                  <p className="text-caption">
                    Прогресс сохранён на этом устройстве.
                  </p>
                </div>
              </div>
            </CelebrateComplete>
          ) : (
            <div className="space-y-3">
              {hasQuiz && !canComplete ? (
                <p className="text-caption text-text-secondary">
                  Сначала пройдите тест в конце урока — нужны все верные ответы.
                </p>
              ) : null}
              <Button
                size="lg"
                className="w-full"
                disabled={!canComplete || completeLesson.isPending}
                onClick={() =>
                  completeLesson.mutate({
                    lessonId: lesson.id,
                    score: hasQuiz ? 100 : undefined,
                  })
                }
              >
                <Check className="size-4" />
                {completeLesson.isPending
                  ? "Сохраняем…"
                  : "Отметить как прочитанный"}
              </Button>
            </div>
          )}
        </div>

        <nav className="mt-10 flex items-stretch justify-between gap-3 pb-16">
          {prev ? (
            <Button
              variant="outline"
              className="h-auto min-w-0 flex-1 justify-start py-3"
              asChild
            >
              <Link href={`/courses/${courseSlug}/lessons/${prev.slug}`}>
                <ChevronLeft className="size-4 shrink-0" />
                <span className="truncate text-left">
                  <span className="block text-caption font-normal">Назад</span>
                  <span className="block truncate text-sm">{prev.title}</span>
                </span>
              </Link>
            </Button>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Button className="h-auto min-w-0 flex-1 justify-end py-3" asChild>
              <Link href={`/courses/${courseSlug}/lessons/${next.slug}`}>
                <span className="truncate text-right text-primary-foreground">
                  <span className="block text-xs font-medium opacity-90">
                    Далее
                  </span>
                  <span className="block truncate text-sm font-medium">
                    {next.title}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-primary-foreground" />
              </Link>
            </Button>
          ) : (
            <Button variant="secondary" className="flex-1" asChild>
              <Link href={`/courses/${courseSlug}`}>К программе курса</Link>
            </Button>
          )}
        </nav>
      </FadeIn>
    </div>
  );
}
