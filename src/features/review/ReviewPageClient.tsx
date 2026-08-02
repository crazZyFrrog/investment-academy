"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CourseSummary } from "@/domain/course/types";
import type { LessonSummary } from "@/domain/lesson/types";
import { useUserId } from "@/hooks/use-user-id";
import { useProgressSnapshot, useRecordReview } from "@/queries/progress";
import { listDueReviewLessons } from "@/domain/review";
import { LessonQuiz } from "@/components/lesson/LessonQuiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/motion";
import { ScreenContainer } from "@/components/ui/screen-container";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";
import { ReadablePanel } from "@/components/layout/ReadablePanel";
import { EmptyState } from "@/components/ui/empty-state";
import { RefreshCw, ArrowRight } from "@/design-system/icons";

export type ReviewLessonPayload = {
  course: CourseSummary;
  lesson: LessonSummary;
  quizId: string;
  quizData: string;
};

export function ReviewPageClient({
  reviewLessons,
}: {
  reviewLessons: ReviewLessonPayload[];
}) {
  const userId = useUserId();
  const { data: snapshot, isLoading } = useProgressSnapshot(userId);
  const [activeId, setActiveId] = useState<string | null>(null);

  const duePayloads = useMemo(() => {
    const due = listDueReviewLessons(snapshot);
    const dueIds = new Set(due.map((item) => item.lessonId));
    return reviewLessons.filter((item) => dueIds.has(item.lesson.id));
  }, [snapshot, reviewLessons]);

  const active =
    duePayloads.find((item) => item.lesson.id === activeId) ??
    duePayloads[0] ??
    null;

  if (!isLoading && duePayloads.length === 0) {
    return (
      <div className="relative min-h-full">
        <ScreenAtmosphere
          src="/images/screens/progress.jpg"
          intensity="progress"
        />
        <ScreenContainer className="relative z-10 pb-8">
          <FadeIn className="space-y-6">
            <ReadablePanel className="space-y-2">
              <p className="text-label text-primary">Повторение</p>
              <h1 className="text-heading-1">Очередь пуста</h1>
            </ReadablePanel>
            <EmptyState
              icon={<RefreshCw />}
              title="Пока нечего повторять"
              description="Завершите уроки с тестами — через день они появятся здесь для закрепления."
              action={
                <Button asChild>
                  <Link href="/courses">
                    К курсам
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              }
            />
          </FadeIn>
        </ScreenContainer>
      </div>
    );
  }

  return (
    <div className="relative min-h-full">
      <ScreenAtmosphere
        src="/images/screens/progress.jpg"
        intensity="progress"
      />
      <ScreenContainer className="relative z-10 space-y-8 pb-8">
        <FadeIn className="space-y-4">
          <Button variant="ghost" size="sm" className="-ml-2 w-fit px-2" asChild>
            <Link href="/dashboard">← На главную</Link>
          </Button>
          <ReadablePanel className="space-y-3">
            <p className="text-label text-primary">Закрепление</p>
            <h1 className="text-heading-1">Повторение</h1>
            <p className="max-w-xl text-body text-text-secondary">
              Короткие ретейки квизов по уже пройденным урокам. Интервал растёт
              после успеха и сбрасывается после ошибки.
            </p>
          </ReadablePanel>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside className="space-y-2">
            {duePayloads.map((item) => {
              const selected = active?.lesson.id === item.lesson.id;
              return (
                <button
                  key={item.lesson.id}
                  type="button"
                  onClick={() => setActiveId(item.lesson.id)}
                  className={
                    selected
                      ? "w-full rounded-[var(--radius-lg)] bg-muted px-3 py-2.5 text-left text-sm text-text-primary"
                      : "w-full rounded-[var(--radius-lg)] px-3 py-2.5 text-left text-sm text-text-secondary hover:bg-muted/70"
                  }
                >
                  <span className="block font-medium">{item.lesson.title}</span>
                  <span className="mt-0.5 block text-caption">
                    {item.course.title}
                  </span>
                </button>
              );
            })}
          </aside>

          {active ? (
            <ReviewSession
              key={active.lesson.id}
              payload={active}
              userId={userId}
            />
          ) : (
            <Card className="p-6 text-body text-text-secondary">
              Выберите урок слева.
            </Card>
          )}
        </div>
      </ScreenContainer>
    </div>
  );
}

function ReviewSession({
  payload,
  userId,
}: {
  payload: ReviewLessonPayload;
  userId: string;
}) {
  const recordReview = useRecordReview(
    userId,
    payload.course.id,
    payload.course.lessonCount
  );

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-2 space-y-1">
        <p className="text-label">{payload.course.title}</p>
        <h2 className="text-heading-3">{payload.lesson.title}</h2>
      </div>
      <LessonQuiz
        id={`review-${payload.quizId}`}
        title="Повторите тест"
        data={payload.quizData}
        mode="review"
        onPassed={() => {
          recordReview.mutate({
            lessonId: payload.lesson.id,
            passed: true,
          });
        }}
        onFailed={() => {
          recordReview.mutate({
            lessonId: payload.lesson.id,
            passed: false,
          });
        }}
      />
    </Card>
  );
}
