"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "@/design-system/icons";
import type { Course } from "@/domain/course/types";
import type { CourseSummary } from "@/domain/course/types";
import type { LessonSummary } from "@/domain/lesson/types";
import { useUserId } from "@/hooks/use-user-id";
import { useCourseProgress } from "@/queries/progress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseDifficultyBadge } from "@/components/ui/course-difficulty-badge";
import { LessonRow } from "@/components/course/LessonRow";
import { FadeIn, SlideUp } from "@/components/motion";
import { ScreenContainer } from "@/components/ui/screen-container";
import {
  formatLessonCount,
  formatMinutes,
  getCourseAccent,
} from "@/features/catalog/labels";
import { useCourseUnlock } from "@/features/learning/use-course-unlock";
import { getLearningPathIndex } from "@/features/learning/unlock";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";
import { cn } from "@/lib/utils";

export function CourseDetails({
  course,
  lessons,
  pathCourses,
}: {
  course: Course;
  lessons: LessonSummary[];
  pathCourses: CourseSummary[];
}) {
  const userId = useUserId();
  const { data: progress } = useCourseProgress(
    userId,
    course.id,
    course.lessonCount
  );
  const { isUnlocked, getLockReason, isLoading } = useCourseUnlock(pathCourses);
  const accent = getCourseAccent(course.slug);
  const percent = progress?.percentComplete ?? 0;
  const locked = isLoading
    ? getLearningPathIndex(course.slug) > 0
    : !isUnlocked(course.slug);
  const lockReason = getLockReason(course.slug);

  const nextLesson =
    lessons.find(
      (lesson) => progress?.lessons[lesson.id]?.status !== "completed"
    ) ?? lessons[0];

  const ctaHref = nextLesson
    ? `/courses/${course.slug}/lessons/${nextLesson.slug}`
    : `/courses/${course.slug}`;

  return (
    <div className="relative min-h-full">
      <ScreenAtmosphere
        src="/images/screens/course.jpg"
        intensity="strong"
      />
      <ScreenContainer className="relative z-10 space-y-8 pb-10">
        <FadeIn>
          <Link
            href="/courses"
            className="text-caption text-text-secondary transition-colors hover:text-text-primary"
          >
            ← Все курсы
          </Link>
        </FadeIn>

        <FadeIn delay={0.04} className="space-y-6">
          <div
            className={cn(
              "overflow-hidden rounded-[var(--radius-2xl)] px-6 py-8 shadow-xs sm:px-8 sm:py-10",
              accent.bg
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <CourseDifficultyBadge
                difficulty={course.level}
                className="border-transparent bg-white/20 text-white"
              />
              <span className="text-sm text-white/90">
                {formatLessonCount(course.lessonCount)} ·{" "}
                {formatMinutes(course.estimatedMinutes)}
              </span>
              {locked ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-xs text-white/95">
                  <Lock className="size-3" />
                  Закрыт
                </span>
              ) : null}
            </div>
            <h1 className="mt-5 font-display text-3xl tracking-tight text-white sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/92">
              {course.description}
            </p>
          </div>

          {locked ? (
            <div className="rounded-[var(--radius-xl)] border border-border bg-surface px-5 py-4 shadow-xs">
              <p className="flex items-start gap-3 text-body text-text-secondary">
                <Lock className="mt-0.5 size-4 shrink-0 text-text-tertiary" />
                <span>
                  {lockReason ??
                    "Программа курса видна, но уроки откроются после предыдущего шага."}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Progress
                value={percent}
                label="Ваш прогресс"
                showValue
                size="sm"
                animated
              />
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={ctaHref}>
                  {percent > 0 ? "Продолжить курс" : "Начать курс"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </FadeIn>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-heading-3">Программа</h2>
            {locked ? (
              <p className="text-caption">
                Названия уроков доступны заранее. Содержание — после открытия
                курса.
              </p>
            ) : null}
          </div>
          <ol className="space-y-3">
            {lessons.map((lesson, index) => (
              <SlideUp key={lesson.id} delay={0.03 * index}>
                <li>
                  <LessonRow
                    courseSlug={course.slug}
                    lesson={lesson}
                    index={index + 1}
                    status={progress?.lessons[lesson.id]?.status}
                    locked={locked}
                  />
                </li>
              </SlideUp>
            ))}
          </ol>
        </section>

        <p className="text-caption leading-relaxed text-text-tertiary">
          Материалы носят образовательный характер и не являются индивидуальной
          инвестиционной или налоговой рекомендацией. Условия продуктов и нормы
          права могут меняться — сверяйте актуальные правила в официальных
          источниках.
        </p>
      </ScreenContainer>
    </div>
  );
}
