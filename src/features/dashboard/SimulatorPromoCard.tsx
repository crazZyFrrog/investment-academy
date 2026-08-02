"use client";

import Link from "next/link";
import { ArrowRight, Lock, Sparkles } from "@/design-system/icons";
import type { CourseSummary } from "@/domain/course/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSimulatorUnlock } from "@/features/learning/use-simulator-unlock";

export function SimulatorPromoCard({
  courses,
}: {
  courses: Pick<CourseSummary, "id" | "slug" | "lessonCount">[];
}) {
  const { isUnlocked, lockReason, isLoading } = useSimulatorUnlock(courses);
  const locked = isLoading ? true : !isUnlocked;

  return (
    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-accent/12 text-accent">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-label text-primary">Практика</p>
            {locked ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-medium text-text-secondary">
                <Lock className="size-3" />
                Награда
              </span>
            ) : null}
          </div>
          <h2 className="text-title">Соберите свой учебный портфель</h2>
          <p className="text-body text-text-secondary">
            {locked
              ? (lockReason ??
                "Симулятор откроется после прогресса по основному пути.")
              : "Проверьте, как доли активов и горизонт меняют математическую проекцию результата."}
          </p>
        </div>
      </div>
      {locked ? (
        <Button variant="outline" className="shrink-0" asChild>
          <Link href="/rewards">
            К наградам
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" className="shrink-0" asChild>
          <Link href="/simulator">
            Открыть симулятор
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      )}
    </Card>
  );
}
