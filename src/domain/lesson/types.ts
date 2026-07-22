export interface LessonFrontmatter {
  title: string;
  order: number;
  durationMinutes: number;
  objectives: string[];
  quizId?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  courseId: string;
  courseSlug: string;
  title: string;
  order: number;
  durationMinutes: number;
  objectives: string[];
  quizId?: string;
  content: string;
}

export type LessonSummary = Pick<
  Lesson,
  | "id"
  | "slug"
  | "courseId"
  | "courseSlug"
  | "title"
  | "order"
  | "durationMinutes"
  | "objectives"
  | "quizId"
>;
