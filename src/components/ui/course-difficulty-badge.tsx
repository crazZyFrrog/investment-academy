import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";

export type CourseDifficulty = "beginner" | "intermediate" | "advanced";

const difficultyConfig: Record<
  CourseDifficulty,
  { label: string; variant: NonNullable<BadgeProps["variant"]> }
> = {
  beginner: { label: "Beginner", variant: "success" },
  intermediate: { label: "Intermediate", variant: "warning" },
  advanced: { label: "Advanced", variant: "accent" },
};

export interface CourseDifficultyBadgeProps
  extends Omit<BadgeProps, "variant" | "children"> {
  difficulty: CourseDifficulty;
  label?: string;
}

function CourseDifficultyBadge({
  className,
  difficulty,
  label,
  ...props
}: CourseDifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];

  return (
    <Badge
      variant={config.variant}
      className={cn("capitalize", className)}
      {...props}
    >
      {label ?? config.label}
    </Badge>
  );
}

export { CourseDifficultyBadge, difficultyConfig };
