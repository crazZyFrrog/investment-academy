"use client";

import Link from "next/link";
import { useMemo } from "react";
import { RefreshCw, ArrowRight } from "@/design-system/icons";
import type { CourseSummary } from "@/domain/course/types";
import type { LessonSummary } from "@/domain/lesson/types";
import { useUserId } from "@/hooks/use-user-id";
import { useProgressSnapshot } from "@/queries/progress";
import { listDueReviewLessons } from "@/domain/review";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ReviewDueCard({
  courses,
  lessonsByCourseId,
}: {
  courses: CourseSummary[];
  lessonsByCourseId: Record<string, LessonSummary[]>;
}) {
  const userId = useUserId();
  const { data: snapshot, isLoading } = useProgressSnapshot(userId);

  const due = useMemo(() => {
    const items = listDueReviewLessons(snapshot);
    return items
      .map((item) => {
        const course = courses.find((c) => c.id === item.courseId);
        const lessons = lessonsByCourseId[item.courseId] ?? [];
        const lesson = lessons.find((l) => l.id === item.lessonId);
        if (!course || !lesson) return null;
        return { course, lesson };
      })
      .filter(
        (
          value
        ): value is {
          course: CourseSummary;
          lesson: LessonSummary;
        } => Boolean(value)
      );
  }, [snapshot, courses, lessonsByCourseId]);

  if (isLoading || due.length === 0) return null;

  const first = due[0]!;

  return (
    <Card className="space-y-4 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 items-center justify-center rounded-[var(--radius-lg)] bg-primary/10 text-primary">
          <RefreshCw className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-label text-primary">Повторение</p>
          <h2 className="text-title">Повторить сегодня</h2>
          <p className="text-body text-text-secondary">
            {due.length === 1
              ? "1 урок готов к повторению квиза."
              : `${due.length} урока готовы к повторению квизов.`}
          </p>
          <p className="text-sm text-text-tertiary">
            Ближайший: {first.lesson.title}
          </p>
        </div>
      </div>
      <Button asChild>
        <Link href="/review">
          К повторению
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </Card>
  );
}
