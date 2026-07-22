"use client";

import { useEffect, useRef } from "react";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { LessonSummary } from "@/domain/lesson/types";
import { useUserId } from "@/hooks/use-user-id";
import {
  useCompleteLesson,
  useCourseProgress,
  useStartLesson,
} from "@/queries/progress";
import { CelebrateComplete, FadeIn } from "@/components/motion";
import { LessonMarkdown } from "./LessonMarkdown";
import { LessonNavigation } from "./LessonNavigation";
import { LessonCompleteCta } from "./LessonCompleteCta";

export function LessonPlayer({
  courseSlug,
  courseId,
  totalLessons,
  lesson,
  mdxSource,
  lessons,
}: {
  courseSlug: string;
  courseId: string;
  totalLessons: number;
  lesson: LessonSummary;
  mdxSource: MDXRemoteSerializeResult;
  lessons: LessonSummary[];
}) {
  const userId = useUserId();
  const { data: progress } = useCourseProgress(userId, courseId, totalLessons);
  const startLesson = useStartLesson(userId, courseId, totalLessons);
  const completeLesson = useCompleteLesson(userId, courseId, totalLessons);
  const hasStartedRef = useRef(false);

  const lessonProgress = progress?.lessons[lesson.id];
  const isCompleted = lessonProgress?.status === "completed";

  useEffect(() => {
    if (hasStartedRef.current) return;
    if (!lessonProgress || lessonProgress.status === "not_started") {
      hasStartedRef.current = true;
      startLesson.mutate(lesson.id);
    }
  }, [lesson.id, lessonProgress, startLesson]);

  return (
    <FadeIn className="mx-auto max-w-3xl">
      <header className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Lesson {lesson.order}
        </p>
        <h1 className="font-display text-3xl tracking-tight">{lesson.title}</h1>
        {lesson.objectives.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {lesson.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        )}
      </header>

      <LessonMarkdown source={mdxSource} />

      <div className="mt-8">
        {isCompleted ? (
          <CelebrateComplete>
            <p className="rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
              Lesson completed. Your progress is saved locally and will sync when online.
            </p>
          </CelebrateComplete>
        ) : (
          <LessonCompleteCta
            loading={completeLesson.isPending}
            onComplete={() => completeLesson.mutate({ lessonId: lesson.id })}
          />
        )}
      </div>

      <LessonNavigation
        courseSlug={courseSlug}
        lessons={lessons}
        currentSlug={lesson.slug}
      />
    </FadeIn>
  );
}
