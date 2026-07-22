import { notFound } from "next/navigation";
import {
  getCourseBySlug,
  getLessonSummaries,
} from "@/data/content/loader";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseProgressClient } from "@/features/learning/CourseProgressClient";
import { FadeIn } from "@/components/motion";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = await getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const lessons = await getLessonSummaries(courseSlug);

  return (
    <FadeIn className="space-y-8">
      <CourseHeader course={course} />
      <CourseProgressClient
        courseId={course.id}
        courseSlug={course.slug}
        totalLessons={course.lessonCount}
        lessons={lessons}
      />
    </FadeIn>
  );
}
