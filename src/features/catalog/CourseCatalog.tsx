"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CourseSummary } from "@/domain/course/types";
import { CourseCard } from "@/components/course/CourseCard";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { FadeIn, SlideUp } from "@/components/motion";
import { ScreenContainer } from "@/components/ui/screen-container";
import { levelLabels, type CourseLevelKey } from "@/features/catalog/labels";
import { useCourseUnlock } from "@/features/learning/use-course-unlock";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";
import { ReadablePanel } from "@/components/layout/ReadablePanel";

type Filter = "all" | CourseLevelKey;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "beginner", label: levelLabels.beginner },
  { id: "intermediate", label: levelLabels.intermediate },
  { id: "advanced", label: levelLabels.advanced },
];

export function CourseCatalog({ courses }: { courses: CourseSummary[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { isUnlocked, isLoading } = useCourseUnlock(courses);

  const visible = useMemo(() => {
    if (filter === "all") return courses;
    return courses.filter((course) => course.level === filter);
  }, [courses, filter]);

  return (
    <div className="relative min-h-full">
      <ScreenAtmosphere
        src="/images/screens/courses.jpg"
        intensity="reading"
      />
      <ScreenContainer className="relative z-10 space-y-8">
        <FadeIn className="space-y-4">
          <Button variant="ghost" size="sm" className="-ml-2 w-fit px-2" asChild>
            <Link href="/">← На главную</Link>
          </Button>
          <ReadablePanel className="space-y-3">
            <h1 className="text-heading-1">Курсы</h1>
            <p className="max-w-xl text-body text-text-secondary">
              Курсы открываются по порядку: завершите уроки и тесты текущего
              шага, чтобы перейти к следующему. Программу закрытых курсов можно
              просматривать заранее.
            </p>
          </ReadablePanel>
        </FadeIn>

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((item) => (
            <Chip
              key={item.id}
              selected={filter === item.id}
              onClick={() => setFilter(item.id)}
              className="shrink-0 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setFilter(item.id);
                }
              }}
            >
              {item.label}
            </Chip>
          ))}
        </div>

        <div className="grid gap-4 sm:gap-5">
          {visible.map((course, index) => (
            <SlideUp key={course.id} delay={index * 0.04}>
              <CourseCard
                course={course}
                locked={!isLoading && !isUnlocked(course.slug)}
              />
            </SlideUp>
          ))}
          {visible.length === 0 ? (
            <p className="py-12 text-center text-caption">
              Пока нет курсов на этом уровне.
            </p>
          ) : null}
        </div>
      </ScreenContainer>
    </div>
  );
}
