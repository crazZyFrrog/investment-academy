import { notFound } from "next/navigation";
import {
  getCourseBySlug,
  getLesson,
  getLessonSummaries,
} from "@/data/content/loader";
import { serializeLessonContent } from "@/data/content/mdx";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";

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

  const lessons = await getLessonSummaries(courseSlug);
  const mdxSource = await serializeLessonContent(lesson.content);

  return (
    <LessonPlayer
      courseSlug={course.slug}
      courseId={course.id}
      totalLessons={course.lessonCount}
      lesson={lesson}
      mdxSource={mdxSource}
      lessons={lessons}
    />
  );
}
