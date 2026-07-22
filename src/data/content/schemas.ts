import { z } from "zod";

export const courseMetaSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  order: z.number().int().nonnegative(),
  tags: z.array(z.string()),
  estimatedMinutes: z.number().int().positive(),
  contentVersion: z.string(),
  lessonOrder: z.array(z.string()),
});

export const lessonFrontmatterSchema = z.object({
  title: z.string(),
  order: z.number().int().nonnegative(),
  durationMinutes: z.number().int().positive(),
  objectives: z.array(z.string()),
  quizId: z.string().optional(),
});

export type CourseMetaInput = z.infer<typeof courseMetaSchema>;
export type LessonFrontmatterInput = z.infer<typeof lessonFrontmatterSchema>;
