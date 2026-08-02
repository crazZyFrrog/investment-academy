import Link from "next/link";
import Image from "next/image";
import type { CourseSummary } from "@/domain/course/types";
import { Card } from "@/components/ui/card";
import { CourseDifficultyBadge } from "@/components/ui/course-difficulty-badge";
import { Lock } from "@/design-system/icons";
import {
  formatLessonCount,
  formatMinutes,
  getCourseAccent,
  getCourseCover,
} from "@/features/catalog/labels";
import { cn } from "@/lib/utils";

export interface CourseCardProps {
  course: CourseSummary;
  className?: string;
  /** Content locked — card still opens the course program (titles only) */
  locked?: boolean;
}

export function CourseCard({
  course,
  className,
  locked = false,
}: CourseCardProps) {
  const accent = getCourseAccent(course.slug);
  const cover = getCourseCover(course.slug);

  return (
    <Link href={`/courses/${course.slug}`} className={cn("block", className)}>
      <Card
        interactive
        className="overflow-hidden shadow-xs transition-[transform,box-shadow] duration-[var(--duration-normal)]"
      >
        <div
          className={cn(
            "relative h-36 overflow-hidden sm:h-40",
            !cover && accent.bg
          )}
        >
          {cover ? (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
            />
          ) : null}
          {locked ? (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-[var(--radius-md)] bg-background/85 px-2 py-1 text-[0.65rem] font-medium text-text-primary shadow-xs backdrop-blur-sm">
              <Lock className="size-3" />
              Закрыт
            </span>
          ) : null}
        </div>

        <div className="space-y-3 border-t border-border p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] font-display text-lg tracking-tight",
                accent.bg,
                accent.fg
              )}
              aria-hidden
            >
              {accent.step || "·"}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-label text-text-tertiary">{accent.label}</p>
              <div className="flex flex-wrap items-center gap-2">
                <CourseDifficultyBadge difficulty={course.level} />
                <span className="text-caption">
                  {formatLessonCount(course.lessonCount)} ·{" "}
                  {formatMinutes(course.estimatedMinutes)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-title">{course.title}</h2>
            <p className="text-caption line-clamp-2 leading-relaxed">
              {course.description}
            </p>
            {locked ? (
              <p className="text-caption text-text-tertiary">
                Программа видна · уроки откроются после предыдущего курса
              </p>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
