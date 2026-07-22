import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { levelLabels } from "@/features/catalog/labels";

export type CourseDifficulty = "beginner" | "intermediate" | "advanced";

const difficultyConfig: Record<
  CourseDifficulty,
  { label: string; variant: NonNullable<BadgeProps["variant"]> }
> = {
  beginner: { label: levelLabels.beginner, variant: "success" },
  intermediate: { label: levelLabels.intermediate, variant: "warning" },
  advanced: { label: levelLabels.advanced, variant: "accent" },
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
    <Badge variant={config.variant} className={cn(className)} {...props}>
      {label ?? config.label}
    </Badge>
  );
}

export { CourseDifficultyBadge, difficultyConfig };
