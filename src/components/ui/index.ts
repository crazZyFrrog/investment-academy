/**
 * Barrel export for design-system UI primitives.
 * Prefer importing from this path for new screens.
 */
export { Button, buttonVariants, type ButtonProps } from "./button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  type CardProps,
} from "./card";
export { Badge, badgeVariants, type BadgeProps } from "./badge";
export { Chip, chipVariants, type ChipProps } from "./chip";
export { Progress, progressVariants, type ProgressProps } from "./progress";
export { SectionHeader, type SectionHeaderProps } from "./section-header";
export {
  ScreenContainer,
  screenContainerVariants,
  type ScreenContainerProps,
} from "./screen-container";
export { EmptyState, type EmptyStateProps } from "./empty-state";
export {
  Skeleton,
  SkeletonGroup,
  skeletonVariants,
  type SkeletonProps,
  type SkeletonGroupProps,
} from "./skeleton";
export { Divider, Separator, dividerVariants, type DividerProps } from "./divider";
export { Tag, tagVariants, type TagProps } from "./tag";
export {
  CourseDifficultyBadge,
  difficultyConfig,
  type CourseDifficulty,
  type CourseDifficultyBadgeProps,
} from "./course-difficulty-badge";
export { XpBadge, type XpBadgeProps } from "./xp-badge";
export {
  DurationBadge,
  formatDuration,
  type DurationBadgeProps,
} from "./duration-badge";
export { Label } from "./label";
