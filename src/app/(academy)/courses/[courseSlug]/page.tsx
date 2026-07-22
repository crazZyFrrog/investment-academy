import { notFound } from "next/navigation";
import {
  getCourseBySlug,
  getCourses,
  getLessonSummaries,
} from "@/data/content/loader";
import { CourseDetails } from "@/features/learning/CourseDetails";

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

  const [lessons, pathCourses] = await Promise.all([
    getLessonSummaries(courseSlug),
    getCourses(),
  ]);

  return (
    <CourseDetails
      course={course}
      lessons={lessons}
      pathCourses={pathCourses}
    />
  );
}
