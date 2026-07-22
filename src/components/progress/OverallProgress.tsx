"use client";

import Link from "next/link";
import type { ProgressSnapshot } from "@/domain/progress/types";
import type { CourseSummary } from "@/domain/course/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "@/design-system/icons";
import { sortByLearningPath } from "@/features/catalog/labels";
import { ProgressRing } from "@/components/progress/ProgressRing";
import {
  CourseProgressList,
  type CourseProgressItem,
} from "@/components/progress/CourseProgressList";
import { CompositionBar } from "@/components/progress/CompositionBar";
import { FadeIn, SlideUp } from "@/components/motion";

export function OverallProgress({
  snapshot,
  courses,
}: {
  snapshot: ProgressSnapshot;
  courses: CourseSummary[];
}) {
  const ordered = sortByLearningPath(courses);
  const byId = new Map(ordered.map((c) => [c.id, c]));

  const items: CourseProgressItem[] = ordered
    .map((course) => {
      const progress = snapshot.courses[course.id];
      if (!progress) return null;
      return {
        courseId: course.id,
        slug: course.slug,
        title: course.title,
        completedLessons: progress.completedLessons,
        totalLessons: progress.totalLessons || course.lessonCount,
        percentComplete: progress.percentComplete,
      };
    })
    .filter((item): item is CourseProgressItem => item !== null);

  // Include any snapshot courses not in catalog (edge case)
  for (const progress of Object.values(snapshot.courses)) {
    if (items.some((i) => i.courseId === progress.courseId)) continue;
    const course = byId.get(progress.courseId);
    items.push({
      courseId: progress.courseId,
      slug: course?.slug ?? progress.courseId,
      title: course?.title ?? progress.courseId,
      completedLessons: progress.completedLessons,
      totalLessons: progress.totalLessons,
      percentComplete: progress.percentComplete,
    });
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen />}
        title="Пока нет прогресса"
        description="Начните первый урок — здесь появится общая картина по курсам."
        action={
          <Button asChild>
            <Link href="/courses">
              К каталогу
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />
    );
  }

  const totalLessons = items.reduce((s, i) => s + i.totalLessons, 0);
  const completedLessons = items.reduce((s, i) => s + i.completedLessons, 0);
  const overall =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const composition = items.map((item) => ({
    slug: item.slug,
    title: item.title,
    weight: Math.max(item.completedLessons, 0),
  }));

  const hasAnyCompletion = completedLessons > 0;

  return (
    <div className="space-y-8">
      <SlideUp>
        <Card className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
          <ProgressRing value={overall} size={128} strokeWidth={9} label="всего" />
          <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
            <h2 className="text-heading-3">Общий прогресс</h2>
            <p className="text-body text-text-secondary">
              {completedLessons} из {totalLessons} уроков · {items.length}{" "}
              {items.length === 1 ? "курс" : "курсов"} с прогрессом
            </p>
          </div>
        </Card>
      </SlideUp>

      {hasAnyCompletion ? (
        <FadeIn delay={0.06} className="space-y-3">
          <h2 className="text-heading-3">По курсам</h2>
          <p className="text-caption">
            Доля завершённых уроков среди тех, что уже пройдены
          </p>
          <CompositionBar segments={composition} />
        </FadeIn>
      ) : null}

      <FadeIn delay={0.1} className="space-y-4">
        <h2 className="text-heading-3">Детали</h2>
        <CourseProgressList items={items} />
      </FadeIn>
    </div>
  );
}
