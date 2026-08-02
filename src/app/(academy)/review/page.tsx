import { getCourses, getLesson, getLessonSummaries } from "@/data/content/loader";
import { extractLessonQuizFromMdx } from "@/domain/review";
import { ReviewPageClient } from "@/features/review/ReviewPageClient";

export default async function ReviewPage() {
  const courses = await getCourses();
  const payloads = [];

  for (const course of courses) {
    const lessons = await getLessonSummaries(course.slug);
    for (const lesson of lessons) {
      const full = await getLesson(course.slug, lesson.slug);
      if (!full) continue;
      const quiz = extractLessonQuizFromMdx(full.content);
      if (!quiz) continue;
      payloads.push({
        course,
        lesson,
        quizId: quiz.id,
        quizData: quiz.data,
      });
    }
  }

  return <ReviewPageClient reviewLessons={payloads} />;
}
