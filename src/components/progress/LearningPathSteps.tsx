"use client";

import { cn } from "@/lib/utils";
import { Check } from "@/design-system/icons";
import { FadeIn } from "@/components/motion";

export type PathStepStatus = "completed" | "current" | "upcoming";

export interface LearningPathStep {
  slug: string;
  label: string;
  status: PathStepStatus;
}

export interface LearningPathStepsProps {
  steps: LearningPathStep[];
  className?: string;
}

export function LearningPathSteps({
  steps,
  className,
}: LearningPathStepsProps) {
  if (steps.length === 0) return null;

  return (
    <FadeIn>
      <ol
        className={cn(
          "flex gap-1 overflow-x-auto pb-1 sm:gap-2",
          className
        )}
        aria-label="Шаги учебного пути"
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.slug}
              className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2"
            >
              <div className="flex min-w-0 flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-[var(--duration-normal)]",
                    step.status === "completed" &&
                      "bg-primary text-primary-foreground",
                    step.status === "current" &&
                      "bg-primary/15 text-primary ring-2 ring-primary/40",
                    step.status === "upcoming" &&
                      "bg-muted text-text-tertiary"
                  )}
                  aria-current={step.status === "current" ? "step" : undefined}
                >
                  {step.status === "completed" ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "max-w-[4.5rem] truncate text-center text-[0.65rem] leading-tight sm:max-w-none sm:text-caption",
                    step.status === "upcoming"
                      ? "text-text-tertiary"
                      : "text-text-secondary"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast ? (
                <div
                  className={cn(
                    "mb-6 h-px min-w-3 flex-1 sm:min-w-4",
                    step.status === "completed" ? "bg-primary/50" : "bg-border"
                  )}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </FadeIn>
  );
}
