import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonVariants = cva(
  "animate-pulse rounded-[var(--radius-lg)] bg-muted motion-reduce:animate-none",
  {
    variants: {
      variant: {
        text: "h-4 w-full",
        title: "h-7 w-2/3",
        avatar: "size-11 rounded-[var(--radius-full)]",
        card: "h-36 w-full rounded-[var(--radius-xl)]",
        button: "h-11 w-28 rounded-[var(--radius-lg)]",
        custom: "",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      aria-hidden
      {...props}
    />
  );
}

export interface SkeletonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  itemClassName?: string;
}

function SkeletonGroup({
  className,
  count = 3,
  itemClassName,
  ...props
}: SkeletonGroupProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={cn(index === count - 1 && "w-4/5", itemClassName)}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonGroup, skeletonVariants };
