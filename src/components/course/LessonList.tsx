"use client";

import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import type { LessonSummary } from "@/domain/lesson/types";
import type { CourseProgress } from "@/domain/progress/types";
import { cn } from "@/lib/utils";

export function LessonList({
  courseSlug,
  lessons,
  progress,
}: {
  courseSlug: string;
  lessons: LessonSummary[];
  progress?: CourseProgress;
}) {
  return (
    <ol className="space-y-2">
      {lessons.map((lesson) => {
        const status = progress?.lessons[lesson.id]?.status ?? "not_started";
        const Icon =
          status === "completed"
            ? CheckCircle2
            : status === "in_progress"
              ? PlayCircle
              : Circle;

        return (
          <li key={lesson.id}>
            <Link
              href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-border/60 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5",
                status === "completed" && "border-primary/20 bg-primary/5"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  status === "completed"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{lesson.title}</p>
                <p className="text-sm text-muted-foreground">
                  {lesson.durationMinutes} min
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
