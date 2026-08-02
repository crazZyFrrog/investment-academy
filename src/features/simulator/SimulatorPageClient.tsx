"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Lock, RotateCcw } from "@/design-system/icons";
import type { CourseSummary } from "@/domain/course/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { FadeIn } from "@/components/motion";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";
import { ReadablePanel } from "@/components/layout/ReadablePanel";
import { ScreenContainer } from "@/components/ui/screen-container";
import { CompositionBar } from "@/components/progress/CompositionBar";
import {
  PORTFOLIO_PRESETS,
  SIMULATOR_INSTRUMENTS,
} from "@/domain/simulator/instruments";
import { projectPortfolio } from "@/domain/simulator/project";
import type { HorizonYears, InstrumentId } from "@/domain/simulator";
import { useSimulatorStore } from "@/stores/simulator-store";
import { useSimulatorUnlock } from "@/features/learning/use-simulator-unlock";

const HORIZONS: HorizonYears[] = [1, 5, 10, 20];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1).replace(".", ",")}%`;
}

function ProjectionChart({
  series,
  initialAmount,
}: {
  series: ReturnType<typeof projectPortfolio>["series"];
  initialAmount: number;
}) {
  const width = 640;
  const height = 220;
  const padX = 12;
  const padY = 16;
  const values = series.flatMap((item) => [
    item.cautious,
    item.base,
    item.optimistic,
  ]);
  const min = Math.min(initialAmount, ...values);
  const max = Math.max(initialAmount, ...values);
  const range = Math.max(max - min, 1);
  const point = (value: number, index: number) => {
    const x = padX + (index / Math.max(series.length - 1, 1)) * (width - padX * 2);
    const y = height - padY - ((value - min) / range) * (height - padY * 2);
    return `${x},${y}`;
  };
  const line = (key: "cautious" | "base" | "optimistic") =>
    series.map((item, index) => point(item[key], index)).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label="Учебная проекция стоимости портфеля по трём сценариям"
    >
      <line
        x1={padX}
        x2={width - padX}
        y1={height - padY}
        y2={height - padY}
        stroke="var(--border)"
        strokeWidth="1"
      />
      <polyline
        points={line("cautious")}
        fill="none"
        stroke="var(--text-tertiary)"
        strokeWidth="2"
        strokeDasharray="5 5"
      />
      <polyline
        points={line("base")}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3"
      />
      <polyline
        points={line("optimistic")}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="5 5"
      />
    </svg>
  );
}

export function SimulatorPageClient({
  courses,
}: {
  courses: Pick<CourseSummary, "id" | "slug" | "lessonCount">[];
}) {
  const { isUnlocked, lockReason, isLoading } = useSimulatorUnlock(courses);
  const locked = isLoading ? true : !isUnlocked;

  if (locked) {
    return (
      <div className="relative min-h-full">
        <ScreenAtmosphere
          src="/images/screens/progress.jpg"
          intensity="progress"
        />
        <ScreenContainer className="relative z-10 space-y-8 pb-8">
          <FadeIn className="space-y-4">
            <Button variant="ghost" size="sm" className="-ml-2 w-fit px-2" asChild>
              <Link href="/dashboard">← На главную</Link>
            </Button>
            <ReadablePanel className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-label text-primary">Практика инвестора</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
                  <Lock className="size-3" />
                  Награда
                </span>
              </div>
              <h1 className="text-heading-1">Симулятор портфеля</h1>
              <p className="max-w-xl text-body text-text-secondary">
                Соберите учебный портфель и посмотрите, как меняется результат
                при разных сочетаниях активов и горизонте.
              </p>
            </ReadablePanel>
          </FadeIn>

          <Card className="space-y-4 p-5 sm:p-6">
            <p className="flex items-start gap-3 text-body text-text-secondary">
              <Lock className="mt-0.5 size-4 shrink-0 text-text-tertiary" />
              <span>
                {lockReason ??
                  "Симулятор откроется после прогресса по основному пути."}
              </span>
            </p>
            <Button asChild>
              <Link href="/rewards">
                К наградам
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Card>
        </ScreenContainer>
      </div>
    );
  }

  return <SimulatorWorkspace />;
}

function SimulatorWorkspace() {
  const {
    allocations,
    initialAmount,
    horizonYears,
    setAllocation,
    setInitialAmount,
    setHorizonYears,
    normalizeAllocations,
    applyPreset,
    reset,
  } = useSimulatorStore();
  const [showDescriptions, setShowDescriptions] = useState(false);
  const projection = projectPortfolio({
    allocations,
    initialAmount,
    horizonYears,
  });
  const isComplete = Math.abs(projection.allocationTotal - 100) <= 0.5;
  const segments = SIMULATOR_INSTRUMENTS.map((instrument) => ({
    slug: instrument.id,
    title: instrument.title,
    weight: allocations[instrument.id],
    color: instrument.color,
  }));

  return (
    <div className="relative min-h-full">
      <ScreenAtmosphere
        src="/images/screens/progress.jpg"
        intensity="progress"
      />
      <ScreenContainer className="relative z-10 space-y-8 pb-8">
        <FadeIn className="space-y-4">
          <Button variant="ghost" size="sm" className="-ml-2 w-fit px-2" asChild>
            <Link href="/dashboard">← На главную</Link>
          </Button>
          <ReadablePanel className="space-y-3">
            <p className="text-label text-primary">Практика инвестора</p>
            <h1 className="text-heading-1">Симулятор портфеля</h1>
            <p className="max-w-xl text-body text-text-secondary">
              Соберите учебный портфель и посмотрите, как меняется результат
              при разных сочетаниях активов и горизонте.
            </p>
            <p className="max-w-xl text-caption">
              Это математическая модель для обучения, а не прогноз рынка и не
              индивидуальная инвестиционная рекомендация.
            </p>
          </ReadablePanel>
        </FadeIn>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
          <div className="space-y-5">
            <Card padding="lg" className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-label text-primary">Параметры</p>
                  <h2 className="mt-2 text-heading-3">Задача портфеля</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  title="Сбросить портфель"
                >
                  <RotateCcw className="size-4" />
                  Сбросить
                </Button>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-text-primary">
                  Начальная сумма
                </span>
                <div className="relative">
                  <input
                    type="number"
                    min={1000}
                    max={100_000_000}
                    step={1000}
                    value={initialAmount}
                    onChange={(event) =>
                      setInitialAmount(Number(event.target.value) || 1000)
                    }
                    className="h-11 w-full rounded-[var(--radius-lg)] border border-border bg-surface px-3.5 text-sm tabular-nums text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-text-tertiary">
                    ₽
                  </span>
                </div>
              </label>

              <div className="space-y-3">
                <span className="text-sm font-medium text-text-primary">
                  Горизонт
                </span>
                <div className="flex flex-wrap gap-2">
                  {HORIZONS.map((years) => (
                    <Chip
                      key={years}
                      selected={horizonYears === years}
                      onClick={() => setHorizonYears(years)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setHorizonYears(years);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {years} {years === 1 ? "год" : "лет"}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <span className="text-sm font-medium text-text-primary">
                      Распределение
                    </span>
                    <p className="mt-1 text-caption">
                      Доля каждого учебного класса активов
                    </p>
                  </div>
                  <span
                    className={
                      isComplete
                        ? "text-sm font-semibold tabular-nums text-success"
                        : "text-sm font-semibold tabular-nums text-warning"
                    }
                  >
                    {projection.allocationTotal}%
                  </span>
                </div>

                <CompositionBar segments={segments} />

                <div className="space-y-5 pt-2">
                  {SIMULATOR_INSTRUMENTS.map((instrument) => (
                    <div key={instrument.id} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <label
                          htmlFor={`allocation-${instrument.id}`}
                          className="text-sm font-medium text-text-primary"
                        >
                          {instrument.title}
                          <span className="ml-2 text-xs font-normal text-text-tertiary">
                            {instrument.role}
                          </span>
                        </label>
                        <span className="text-sm tabular-nums text-text-secondary">
                          {allocations[instrument.id]}%
                        </span>
                      </div>
                      <input
                        id={`allocation-${instrument.id}`}
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={allocations[instrument.id]}
                        onChange={(event) =>
                          setAllocation(
                            instrument.id as InstrumentId,
                            Number(event.target.value)
                          )
                        }
                        className="h-2 w-full cursor-pointer accent-[var(--primary)]"
                        style={{
                          accentColor: instrument.color,
                        }}
                      />
                      {showDescriptions ? (
                        <p className="text-caption">{instrument.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>

                {!isComplete ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <p className="text-sm text-warning">
                      Доли должны составлять 100%, чтобы запустить расчёт.
                    </p>
                    <Button variant="outline" size="sm" onClick={normalizeAllocations}>
                      Нормализовать до 100%
                    </Button>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => setShowDescriptions((value) => !value)}
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  {showDescriptions ? "Скрыть пояснения" : "Показать пояснения"}
                </button>
              </div>
            </Card>

            <Card padding="lg" className="space-y-4">
              <div>
                <p className="text-label text-primary">Быстрый старт</p>
                <h2 className="mt-2 text-heading-3">Выберите профиль</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PORTFOLIO_PRESETS).map(([id, preset]) => (
                  <Button
                    key={id}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      applyPreset(id as keyof typeof PORTFOLIO_PRESETS)
                    }
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          <Card padding="lg" className="h-fit space-y-6 lg:sticky lg:top-6">
            <div>
              <p className="text-label text-primary">Учебная проекция</p>
              <h2 className="mt-2 text-heading-3">
                Что может произойти за {horizonYears}{" "}
                {horizonYears === 1 ? "год" : "лет"}
              </h2>
            </div>

            {!isComplete ? (
              <div className="rounded-[var(--radius-lg)] border border-warning/30 bg-warning/[0.07] px-4 py-3 text-sm text-text-primary">
                Сначала распределите ровно 100% капитала.
              </div>
            ) : (
              <>
                <ProjectionChart
                  series={projection.series}
                  initialAmount={initialAmount}
                />
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <Scenario
                    label="Осторожный"
                    value={projection.scenarios.cautious}
                    tone="muted"
                  />
                  <Scenario
                    label="Базовый"
                    value={projection.scenarios.base}
                    tone="primary"
                  />
                  <Scenario
                    label="Оптимистичный"
                    value={projection.scenarios.optimistic}
                    tone="accent"
                  />
                </div>
                <div className="space-y-2 border-t border-border pt-4 text-sm text-text-secondary">
                  <p>
                    Учебная средняя доходность:{" "}
                    <strong className="text-text-primary">
                      {formatPercent(projection.annualReturn)}
                    </strong>{" "}
                    в год
                  </p>
                  <p>
                    Учебная волатильность:{" "}
                    <strong className="text-text-primary">
                      {formatPercent(projection.annualVolatility)}
                    </strong>
                  </p>
                </div>
              </>
            )}

            <div className="border-t border-border pt-4">
              <p className="text-caption">
                Реальный результат зависит от рынка, комиссий, налогов,
                инфляции и ваших решений. Модель не учитывает корреляции,
                взносы и реальные котировки.
              </p>
              <Button variant="link" className="mt-3" asChild>
                <Link href="/courses/portfolio-basics">
                  Углубить теорию портфеля
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </ScreenContainer>
    </div>
  );
}

function Scenario({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "muted" | "primary" | "accent";
}) {
  const colors = {
    muted: "text-text-secondary",
    primary: "text-primary",
    accent: "text-accent",
  };
  return (
    <div className="space-y-1">
      <p className="text-caption">{label}</p>
      <p className={`text-lg font-semibold tabular-nums ${colors[tone]}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}
