import Link from "next/link";
import Image from "next/image";
import type { CourseSummary } from "@/domain/course/types";
import { Card } from "@/components/ui/card";
import { CourseDifficultyBadge } from "@/components/ui/course-difficulty-badge";
import { ArrowUpRight, Lock } from "@/design-system/icons";
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
        className="group overflow-hidden border-primary/15 bg-[#0b120f] shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-[transform,box-shadow,border-color] duration-[var(--duration-normal)] hover:border-primary/45 hover:shadow-[0_16px_38px_rgba(0,0,0,0.3)]"
      >
        <div
          className={cn(
            "relative h-52 overflow-hidden border-b border-white/10 sm:h-60",
            !cover && accent.bg
          )}
        >
          {cover ? (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-[#07100b]/35" aria-hidden />
          <div
            className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(168,255,22,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,255,22,0.1)_1px,transparent_1px)] [background-size:36px_36px]"
            aria-hidden
          />
          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
            <span className="rounded-full border border-primary/30 bg-[#07100b]/70 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary backdrop-blur-md">
              {accent.label}
            </span>
            <span className="grid size-9 place-items-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur-md transition-colors group-hover:border-primary/50 group-hover:text-primary">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <span className="font-display text-5xl leading-none text-white/90">
              {String(accent.step || 0).padStart(2, "0")}
            </span>
            <span className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[0.65rem] text-white/75 backdrop-blur-md">
              {formatMinutes(course.estimatedMinutes)}
            </span>
          </div>
          {locked ? (
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[0.65rem] font-medium text-white/80 shadow-xs backdrop-blur-md">
              <Lock className="size-3" />
              {accent.step === 0 ? "Награда" : "Закрыт"}
            </span>
          ) : null}
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <CourseDifficultyBadge difficulty={course.level} />
            <span className="text-caption">
              {formatLessonCount(course.lessonCount)}
            </span>
          </div>
          <h2 className="font-display text-2xl leading-tight tracking-tight text-white transition-colors group-hover:text-primary">
            {course.title}
          </h2>
          <p className="text-caption line-clamp-2 leading-relaxed">
            {course.description}
          </p>
          {locked ? (
            <p className="text-caption text-text-tertiary">
              Программа видна · уроки откроются после предыдущего курса
            </p>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
