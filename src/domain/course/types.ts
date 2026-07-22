export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: CourseLevel;
  order: number;
  tags: string[];
  estimatedMinutes: number;
  contentVersion: string;
  lessonOrder: string[];
  lessonCount: number;
}

export type CourseSummary = Pick<
  Course,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "level"
  | "order"
  | "tags"
  | "estimatedMinutes"
  | "lessonCount"
>;
