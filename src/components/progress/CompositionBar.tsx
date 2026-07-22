"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getCourseAccentHex } from "@/features/catalog/labels";
import { durationSeconds, easing } from "@/design-system/tokens/motion";

export interface CompositionSegment {
  slug: string;
  title: string;
  /** Relative weight in the bar (e.g. completed lessons or percent) */
  weight: number;
}

export interface CompositionBarProps {
  segments: CompositionSegment[];
  className?: string;
}

export function CompositionBar({ segments, className }: CompositionBarProps) {
  const prefersReduced = useReducedMotion();
  const total = segments.reduce((sum, s) => sum + s.weight, 0);

  if (total <= 0) {
    return (
      <div
        className={cn(
          "h-3 w-full overflow-hidden rounded-[var(--radius-full)] bg-muted",
          className
        )}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className="flex h-3 w-full overflow-hidden rounded-[var(--radius-full)] bg-muted"
        role="img"
        aria-label="Распределение прогресса по курсам"
      >
        {segments.map((segment, index) => {
          const pct = (segment.weight / total) * 100;
          if (pct <= 0) return null;
          const hex = getCourseAccentHex(segment.slug);

          return (
            <motion.div
              key={segment.slug}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ backgroundColor: hex }}
              title={segment.title}
              initial={prefersReduced ? { width: `${pct}%` } : { width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : {
                      duration: durationSeconds.slow,
                      delay: 0.04 * index,
                      ease: easing.emphasized,
                    }
              }
            />
          );
        })}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {segments.map((segment) => {
          const pct = Math.round((segment.weight / total) * 100);
          if (segment.weight <= 0) return null;
          const hex = getCourseAccentHex(segment.slug);

          return (
            <li
              key={segment.slug}
              className="flex items-center gap-2 text-caption text-text-secondary"
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: hex }}
                aria-hidden
              />
              <span className="truncate">{segment.title}</span>
              <span className="tabular-nums text-text-tertiary">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
