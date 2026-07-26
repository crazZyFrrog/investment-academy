import { z } from "zod";

export const lessonQuizItemSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().nonnegative(),
  explanation: z.string().min(1),
});

export const lessonQuizItemsSchema = z
  .array(lessonQuizItemSchema)
  .min(1)
  .superRefine((items, ctx) => {
    items.forEach((item, index) => {
      if (item.correctIndex >= item.options.length) {
        ctx.addIssue({
          code: "custom",
          message: `correctIndex out of range for question ${index + 1}`,
          path: [index, "correctIndex"],
        });
      }
    });
  });

export type LessonQuizItem = z.infer<typeof lessonQuizItemSchema>;

export function parseLessonQuizData(data: string): LessonQuizItem[] {
  try {
    const parsed: unknown = JSON.parse(data);
    const result = lessonQuizItemsSchema.safeParse(parsed);
    if (!result.success) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[LessonQuiz] invalid quiz data", result.error.issues);
      }
      return [];
    }
    return result.data;
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("[LessonQuiz] quiz data is not valid JSON");
    }
    return [];
  }
}
