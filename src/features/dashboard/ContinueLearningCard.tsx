"use client";

import Link from "next/link";
import { ArrowRight } from "@/design-system/icons";
import type { CourseSummary } from "@/domain/course/types";
import type { LessonSummary } from "@/domain/lesson/types";
import { useUserId } from "@/hooks/use-user-id";
import { useCourseProgress } from "@/queries/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProgressRing } from "@/components/progress/ProgressRing";
import { getCourseAccent } from "@/features/catalog/labels";
import { useCourseUnlock } from "@/features/learning/use-course-unlock";
import { cn } from "@/lib/utils";

export function ContinueLearningCard({
  courses,
  lessonsByCourseId,
}: {
  courses: CourseSummary[];
  lessonsByCourseId: Record<string, LessonSummary[]>;
}) {
  const { continueSlug, isLoading } = useCourseUnlock(courses);
  const course =
    courses.find((item) => item.slug === continueSlug) ?? courses[0] ?? null;

  if (!course) return null;

  return (
    <ContinueLearningCardInner
      key={course.id}
      course={course}
      lessons={lessonsByCourseId[course.id] ?? []}
      ready={!isLoading}
    />
  );
}

function ContinueLearningCardInner({
  course,
  lessons,
  ready,
}: {
  course: CourseSummary;
  lessons: LessonSummary[];
  ready: boolean;
}) {
  const userId = useUserId();
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

  const percent = progress?.percentComplete ?? 0;
  const accent = getCourseAccent(course.slug);
  const hasStarted = percent > 0;
  const href = nextLesson
    ? `/courses/${course.slug}/lessons/${nextLesson.slug}`
    : `/courses/${course.slug}`;

  return (
    <Card
      className={cn(
        "overflow-hidden shadow-sm transition-opacity",
        !ready && "opacity-70"
      )}
    >
      <div className={cn("px-5 py-4 sm:px-6", accent.bg)}>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/95">
          {hasStarted ? "Продолжить" : "Начать обучение"}
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-tight text-white sm:text-[1.75rem]">
          {course.title}
        </h2>
      </div>
      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6">
        <ProgressRing
          value={percent}
          size={104}
          strokeWidth={8}
          label="курс"
        />
        <div className="min-w-0 flex-1 space-y-5">
          {nextLesson ? (
            <div className="space-y-1">
              <p className="text-caption">Следующий урок</p>
              <p className="text-title text-base">{nextLesson.title}</p>
            </div>
          ) : null}
          <Progress
            value={percent}
            label="Прогресс курса"
            showValue
            size="sm"
            animated
          />
          <Button asChild className="w-full sm:w-auto">
            <Link href={href}>
              {hasStarted ? "Продолжить" : "Начать"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
