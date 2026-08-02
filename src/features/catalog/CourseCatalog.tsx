"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CourseSummary } from "@/domain/course/types";
import { Search, X } from "@/design-system/icons";
import { CourseCard } from "@/components/course/CourseCard";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { FadeIn, SlideUp } from "@/components/motion";
import { ScreenContainer } from "@/components/ui/screen-container";
import {
  isLearningPathCourse,
  learningPathOrder,
  levelLabels,
  type CourseLevelKey,
} from "@/features/catalog/labels";
import { useCourseUnlock } from "@/features/learning/use-course-unlock";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";
import { ReadablePanel } from "@/components/layout/ReadablePanel";

type LevelFilter = "all" | CourseLevelKey;

const levelFilters: { id: LevelFilter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "beginner", label: levelLabels.beginner },
  { id: "intermediate", label: levelLabels.intermediate },
  { id: "advanced", label: levelLabels.advanced },
];

function matchesQuery(course: CourseSummary, query: string) {
  if (!query) return true;
  const haystack = [course.title, course.description, ...course.tags]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function CourseSection({
  title,
  description,
  courses,
  isUnlocked,
  isLoading,
  startIndex = 0,
}: {
  title: string;
  description: string;
  courses: CourseSummary[];
  isUnlocked: (slug: string) => boolean;
  isLoading: boolean;
  startIndex?: number;
}) {
  if (courses.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-display text-xl tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="max-w-xl text-sm text-text-secondary">{description}</p>
      </div>
      <div className="grid gap-4 sm:gap-5">
        {courses.map((course, index) => (
          <SlideUp key={course.id} delay={(startIndex + index) * 0.04}>
            <CourseCard
              course={course}
              locked={!isLoading && !isUnlocked(course.slug)}
            />
          </SlideUp>
        ))}
      </div>
    </section>
  );
}

export function CourseCatalog({ courses }: { courses: CourseSummary[] }) {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const { isUnlocked, isLoading } = useCourseUnlock(courses);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const course of courses) {
      for (const tag of course.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ru"))
      .map(([tag]) => tag);
  }, [courses]);

  const visible = useMemo(() => {
    return courses.filter((course) => {
      if (levelFilter !== "all" && course.level !== levelFilter) return false;
      if (tagFilter && !course.tags.includes(tagFilter)) return false;
      if (!matchesQuery(course, normalizedQuery)) return false;
      return true;
    });
  }, [courses, levelFilter, tagFilter, normalizedQuery]);

  const pathCourses = useMemo(() => {
    const bySlug = new Map(visible.map((course) => [course.slug, course]));
    return learningPathOrder
      .map((slug) => bySlug.get(slug))
      .filter((course): course is CourseSummary => Boolean(course));
  }, [visible]);

  const sideCourses = useMemo(() => {
    return visible
      .filter((course) => !isLearningPathCourse(course.slug))
      .sort((a, b) => a.order - b.order);
  }, [visible]);

  const hasActiveFilters =
    levelFilter !== "all" || Boolean(tagFilter) || Boolean(query.trim());

  return (
    <div className="relative min-h-full">
      <ScreenAtmosphere
        src="/images/screens/courses.jpg"
        intensity="catalog"
      />
      <ScreenContainer className="relative z-10 space-y-8">
        <FadeIn className="space-y-4">
          <Button variant="ghost" size="sm" className="-ml-2 w-fit px-2" asChild>
            <Link href="/">← На главную</Link>
          </Button>
          <ReadablePanel className="space-y-3">
            <p className="text-label text-primary">Каталог · путь обучения</p>
            <h1 className="text-heading-1">Курсы</h1>
            <p className="max-w-xl text-body text-text-secondary">
              Основной путь открывается по порядку. Дополнительные курсы — награда
              за пройденные шаги пути и накопленный XP; они не блокируют сертификат.
            </p>
          </ReadablePanel>
        </FadeIn>

        <div className="space-y-4">
          <label className="relative block max-w-xl">
            <span className="sr-only">Поиск курсов</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-tertiary"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по названию или тегу…"
              className="h-11 w-full rounded-[var(--radius-lg)] border border-border bg-surface pr-10 pl-10 text-sm text-text-primary shadow-xs outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-ring"
            />
            {query ? (
              <button
                type="button"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-[var(--radius-md)] p-1.5 text-text-tertiary hover:bg-muted hover:text-text-primary"
                aria-label="Очистить поиск"
                onClick={() => setQuery("")}
              >
                <X className="size-4" />
              </button>
            ) : null}
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {levelFilters.map((item) => (
              <Chip
                key={item.id}
                selected={levelFilter === item.id}
                onClick={() => setLevelFilter(item.id)}
                className="shrink-0 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setLevelFilter(item.id);
                  }
                }}
              >
                {item.label}
              </Chip>
            ))}
          </div>

          {allTags.length > 0 ? (
            <div className="space-y-2">
              <p className="text-caption">Теги</p>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Chip
                    key={tag}
                    selected={tagFilter === tag}
                    onClick={() =>
                      setTagFilter((current) => (current === tag ? null : tag))
                    }
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setTagFilter((current) =>
                          current === tag ? null : tag
                        );
                      }
                    }}
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}

          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit px-2"
              onClick={() => {
                setLevelFilter("all");
                setTagFilter(null);
                setQuery("");
              }}
            >
              Сбросить фильтры
            </Button>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <p className="py-12 text-center text-caption">
            Ничего не найдено. Попробуйте другой запрос или сбросьте фильтры.
          </p>
        ) : (
          <div className="space-y-10">
            <CourseSection
              title="Основной путь"
              description="Семь шагов от основ до сложных продуктов. Завершение пути открывает сертификат."
              courses={pathCourses}
              isUnlocked={isUnlocked}
              isLoading={isLoading}
            />
            <CourseSection
              title="Дополнительно"
              description="Тематические модули-награды. Открываются за завершённые курсы основного пути и XP."
              courses={sideCourses}
              isUnlocked={isUnlocked}
              isLoading={isLoading}
              startIndex={pathCourses.length}
            />
          </div>
        )}
      </ScreenContainer>
    </div>
  );
}
