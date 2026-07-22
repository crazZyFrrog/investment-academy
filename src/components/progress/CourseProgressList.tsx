"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
  formatLessonCount,
  getCourseAccent,
  getCourseAccentHex,
} from "@/features/catalog/labels";
import { cn } from "@/lib/utils";
import { SlideUp } from "@/components/motion";

export interface CourseProgressItem {
  courseId: string;
  slug: string;
  title: string;
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
}

export interface CourseProgressListProps {
  items: CourseProgressItem[];
  className?: string;
}

export function CourseProgressList({
  items,
  className,
}: CourseProgressListProps) {
  if (items.length === 0) return null;

  return (
    <ul className={cn("space-y-5", className)}>
      {items.map((item, index) => {
        const accent = getCourseAccent(item.slug);
        const hex = getCourseAccentHex(item.slug);

        return (
          <li key={item.courseId}>
            <SlideUp delay={0.04 * index} className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: hex }}
                      aria-hidden
                    />
                    <Link
                      href={`/courses/${item.slug}`}
                      className="text-title truncate text-base hover:underline"
                    >
                      {item.title}
                    </Link>
                  </div>
                  <p className="pl-[1.125rem] text-caption">
                    <span className="text-text-tertiary">{accent.label}</span>
                    {" · "}
                    {item.completedLessons} из{" "}
                    {formatLessonCount(item.totalLessons)}
                  </p>
                </div>
                <span className="shrink-0 text-caption font-medium tabular-nums text-text-primary">
                  {Math.round(item.percentComplete)}%
                </span>
              </div>
              <Progress value={item.percentComplete} size="sm" animated />
            </SlideUp>
          </li>
        );
      })}
    </ul>
  );
}
