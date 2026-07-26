import Link from "next/link";
import { Check, Circle, Lock, Play } from "@/design-system/icons";
import type { LessonSummary } from "@/domain/lesson/types";
import type { LessonStatus } from "@/domain/progress/types";
import { formatMinutes } from "@/features/catalog/labels";
import { cn } from "@/lib/utils";

export interface LessonRowProps {
  courseSlug: string;
  lesson: LessonSummary;
  status?: LessonStatus;
  index: number;
  /** When true, titles stay visible but the lesson cannot be opened */
  locked?: boolean;
  lockHint?: string;
}

export function LessonRow({
  courseSlug,
  lesson,
  status = "not_started",
  index,
  locked = false,
  lockHint = "Содержание откроется после предыдущего шага",
}: LessonRowProps) {
  const Icon = locked
    ? Lock
    : status === "completed"
      ? Check
      : status === "in_progress"
        ? Play
        : Circle;

  const body = (
    <>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)]",
          locked
            ? "bg-muted text-text-tertiary"
            : status === "completed"
              ? "bg-primary/10 text-primary"
              : status === "in_progress"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-text-tertiary"
        )}
        aria-hidden
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-caption text-text-tertiary">Урок {index}</p>
        <p
          className={cn(
            "text-title truncate text-base",
            !locked && "group-hover:text-primary"
          )}
        >
          {lesson.title}
        </p>
        {locked ? (
          <p className="text-caption text-text-tertiary">{lockHint}</p>
        ) : null}
      </div>
      <span className="shrink-0 text-caption tabular-nums">
        {formatMinutes(lesson.durationMinutes)}
      </span>
    </>
  );

  if (locked) {
    return (
      <div
        className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-border bg-surface/80 px-4 py-4 shadow-xs sm:px-5"
        aria-disabled
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
      className={cn(
        "group flex items-center gap-4 rounded-[var(--radius-xl)] border border-border bg-surface px-4 py-4 shadow-xs transition-[border-color,box-shadow,transform] duration-[var(--duration-normal)] hover:shadow-sm active:scale-[0.995] sm:px-5",
        status === "completed" && "border-primary/15 bg-primary/[0.03]"
      )}
    >
      {body}
    </Link>
  );
}
