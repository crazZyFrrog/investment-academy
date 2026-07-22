"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easing } from "@/design-system/tokens/motion";

export interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  tone?: "primary" | "success" | "accent";
}

const toneStroke: Record<NonNullable<ProgressRingProps["tone"]>, string> = {
  primary: "stroke-primary",
  success: "stroke-success",
  accent: "stroke-accent",
};

export function ProgressRing({
  value,
  size = 112,
  strokeWidth = 8,
  className,
  label,
  tone = "primary",
}: ProgressRingProps) {
  const prefersReduced = useReducedMotion();
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `Прогресс ${Math.round(clamped)}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={toneStroke[tone]}
          strokeDasharray={circumference}
          initial={
            prefersReduced
              ? { strokeDashoffset: offset }
              : { strokeDashoffset: circumference }
          }
          animate={{ strokeDashoffset: offset }}
          transition={prefersReduced ? { duration: 0 } : easing.spring}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl tracking-tight text-text-primary tabular-nums">
          {Math.round(clamped)}%
        </span>
        {label ? (
          <span className="mt-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-text-tertiary">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
