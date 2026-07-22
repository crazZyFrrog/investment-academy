import { notFound } from "next/navigation";
import {
  getCourseBySlug,
  getCourses,
  getLesson,
  getLessonSummaries,
} from "@/data/content/loader";
import { serializeLessonContent } from "@/data/content/mdx";
import { LessonReader } from "@/features/learning/LessonReader";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const course = await getCourseBySlug(courseSlug);
  const lesson = await getLesson(courseSlug, lessonSlug);

  if (!course || !lesson) {
    notFound();
  }

  const [lessons, pathCourses, mdxSource] = await Promise.all([
    getLessonSummaries(courseSlug),
    getCourses(),
    serializeLessonContent(lesson.content),
  ]);

  const hasQuiz = lesson.content.includes("<LessonQuiz");

  return (
    <LessonReader
      courseSlug={course.slug}
      courseId={course.id}
      courseTitle={course.title}
      totalLessons={course.lessonCount}
      lesson={lesson}
      mdxSource={mdxSource}
      lessons={lessons}
      pathCourses={pathCourses}
      hasQuiz={hasQuiz}
    />
  );
}
