"use client";

import { Award } from "@/design-system/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { learningPathOrder } from "@/features/catalog/labels";
import type { CourseSummary } from "@/domain/course/types";
import { cn } from "@/lib/utils";

export function PathCertificate({
  pathCompletedCount,
  pathCourses,
  completed,
}: {
  pathCompletedCount: number;
  pathCourses: CourseSummary[];
  completed: boolean;
}) {
  const total = learningPathOrder.length;
  const issuedAt = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!completed) {
    return (
      <Card className="space-y-3 p-5 sm:p-6 print:hidden">
        <p className="text-label text-primary">Сертификат пути</p>
        <h2 className="text-heading-3">Основной путь</h2>
        <p className="text-body text-text-secondary">
          Завершите все {total} курсов пути, чтобы получить сертификат. Сейчас{" "}
          {pathCompletedCount} из {total}.
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{
              width: `${Math.min(100, (pathCompletedCount / total) * 100)}%`,
            }}
          />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-label text-primary">Сертификат пути</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.print()}
        >
          Печать / PDF
        </Button>
      </div>

      <Card
        id="path-certificate"
        className={cn(
          "relative overflow-hidden border-primary/25 p-6 sm:p-8",
          "print:border print:border-border print:shadow-none"
        )}
      >
        <div className="flex items-start gap-3">
          <span className="flex size-11 items-center justify-center rounded-[var(--radius-lg)] bg-primary/10 text-primary">
            <Award className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="text-label">Investment Academy</p>
            <h2 className="font-display text-2xl tracking-tight text-text-primary sm:text-3xl">
              Основной путь пройден
            </h2>
            <p className="text-body text-text-secondary">
              Образовательный сертификат о завершении семи шагов академии.
              Дата: {issuedAt}.
            </p>
          </div>
        </div>

        <ol className="mt-6 space-y-2">
          {pathCourses.map((course, index) => (
            <li
              key={course.id}
              className="flex items-baseline gap-3 text-sm text-text-secondary"
            >
              <span className="w-6 shrink-0 font-medium text-text-tertiary">
                {index + 1}.
              </span>
              <span className="text-text-primary">{course.title}</span>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-caption">
          Материал носит образовательный характер и не является индивидуальной
          инвестиционной рекомендацией.
        </p>
      </Card>
    </div>
  );
}
