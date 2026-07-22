import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const screenContainerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      sm: "max-w-xl",
      md: "max-w-2xl",
      lg: "max-w-4xl",
      xl: "max-w-5xl",
      full: "max-w-none",
    },
    padding: {
      none: "px-0",
      sm: "px-5 py-6",
      md: "px-5 py-8 sm:px-8 sm:py-10",
      lg: "px-6 py-10 sm:px-10 sm:py-14",
    },
  },
  defaultVariants: {
    size: "xl",
    padding: "md",
  },
});

export interface ScreenContainerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof screenContainerVariants> {
  as?: React.ElementType;
}

function ScreenContainer({
  className,
  size,
  padding,
  as: Comp = "div",
  ...props
}: ScreenContainerProps) {
  return (
    <Comp
      className={cn(screenContainerVariants({ size, padding }), className)}
      {...props}
    />
  );
}

export { ScreenContainer, screenContainerVariants };
