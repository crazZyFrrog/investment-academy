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
            "relative flex h-28 items-end overflow-hidden px-5 pb-4 sm:h-32",
            !cover && accent.bg
          )}
        >
          {cover ? (
            <>
              <Image
                src={cover}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-cover"
              />
              <div
                className={cn(
                  "absolute inset-0 opacity-75 mix-blend-multiply",
                  accent.bg
                )}
                aria-hidden
              />
              <div className="absolute inset-0 bg-black/25" aria-hidden />
            </>
          ) : null}
          <div className="relative z-10 flex w-full items-end justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/95">
              {accent.label}
            </span>
            {locked ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[0.65rem] text-white/95">
                <Lock className="size-3" />
                Закрыт
              </span>
            ) : null}
          </div>
        </div>
        <div className="space-y-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <CourseDifficultyBadge difficulty={course.level} />
            <span className="text-caption">
              {formatLessonCount(course.lessonCount)} ·{" "}
              {formatMinutes(course.estimatedMinutes)}
            </span>
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
