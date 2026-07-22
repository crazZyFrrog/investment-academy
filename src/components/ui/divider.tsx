"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dividerVariants = cva("shrink-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
    tone: {
      default: "bg-border",
      muted: "bg-muted",
      strong: "bg-text-secondary/30",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    tone: "default",
  },
});

export interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    Omit<VariantProps<typeof dividerVariants>, "orientation"> {
  label?: string;
}

const Divider = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(
  (
    {
      className,
      orientation = "horizontal",
      tone,
      decorative = true,
      label,
      ...props
    },
    ref
  ) => {
    if (label && orientation === "horizontal") {
      return (
        <div
          className={cn("flex items-center gap-3", className)}
          role="separator"
          aria-orientation="horizontal"
        >
          <div className={cn(dividerVariants({ orientation, tone }), "flex-1")} />
          <span className="text-caption shrink-0">{label}</span>
          <div className={cn(dividerVariants({ orientation, tone }), "flex-1")} />
        </div>
      );
    }

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation ?? "horizontal"}
        className={cn(
          dividerVariants({
            orientation: orientation ?? "horizontal",
            tone,
          }),
          className
        )}
        {...props}
      />
    );
  }
);
Divider.displayName = "Divider";

/** @deprecated Prefer Divider — kept for existing imports */
const Separator = Divider;

export { Divider, Separator, dividerVariants };
