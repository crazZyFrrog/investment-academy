"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-[var(--radius-full)] bg-muted",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-1.5",
        lg: "h-2.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const indicatorVariants = cva(
  "h-full w-full flex-1 ease-[var(--ease-standard)]",
  {
    variants: {
      tone: {
        primary: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        accent: "bg-accent",
      },
    },
    defaultVariants: {
      tone: "primary",
    },
  }
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof indicatorVariants> {
  label?: string;
  showValue?: boolean;
  /** Animate fill from 0 → value on mount */
  animated?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, value, size, tone, label, showValue, animated = false, ...props },
    ref
  ) => {
    const prefersReduced = useReducedMotion();
    const clamped = Math.min(100, Math.max(0, value ?? 0));
    const [display, setDisplay] = React.useState(
      animated && !prefersReduced ? 0 : clamped
    );

    React.useEffect(() => {
      if (!animated || prefersReduced) {
        setDisplay(clamped);
        return;
      }
      setDisplay(0);
      const id = requestAnimationFrame(() => setDisplay(clamped));
      return () => cancelAnimationFrame(id);
    }, [animated, clamped, prefersReduced]);

    return (
      <div className="w-full space-y-2">
        {(label || showValue) && (
          <div className="flex items-center justify-between gap-3">
            {label ? (
              <span className="text-caption">{label}</span>
            ) : (
              <span />
            )}
            {showValue ? (
              <span className="text-caption font-medium text-text-primary">
                {Math.round(clamped)}%
              </span>
            ) : null}
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(progressVariants({ size }), className)}
          value={display}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              indicatorVariants({ tone }),
              animated && !prefersReduced
                ? "transition-transform duration-[var(--duration-slow)]"
                : "transition-transform duration-[var(--duration-moderate)]"
            )}
            style={{ transform: `translateX(-${100 - display}%)` }}
          />
        </ProgressPrimitive.Root>
      </div>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, progressVariants };
