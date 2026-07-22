"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LessonSummary } from "@/domain/lesson/types";

export function LessonNavigation({
  courseSlug,
  lessons,
  currentSlug,
}: {
  courseSlug: string;
  lessons: LessonSummary[];
  currentSlug: string;
}) {
  const index = lessons.findIndex((lesson) => lesson.slug === currentSlug);
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
      {prev ? (
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseSlug}/lessons/${prev.slug}`}>
            <ArrowLeft className="h-4 w-4" />
            {prev.title}
          </Link>
        </Button>
      ) : (
        <div />
      )}
      {next ? (
        <Button asChild>
          <Link href={`/courses/${courseSlug}/lessons/${next.slug}`}>
            {next.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </nav>
  );
}
