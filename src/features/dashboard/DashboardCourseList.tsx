"use client";

import type { CourseSummary } from "@/domain/course/types";
import { CourseCard } from "@/components/course/CourseCard";
import { SlideUp, CardHover } from "@/components/motion";
import { useCourseUnlock } from "@/features/learning/use-course-unlock";
import { isLearningPathCourse } from "@/features/catalog/labels";

export function DashboardCourseList({
  courses,
}: {
  courses: CourseSummary[];
}) {
  const pathCourses = courses.filter((course) =>
    isLearningPathCourse(course.slug)
  );
  const { isUnlocked, isLoading, snapshot } = useCourseUnlock(courses);
  // Avoid lock-badge DOM mismatch before progress identity is ready.
  const locksReady = Boolean(snapshot) && !isLoading;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pathCourses.map((course, index) => (
        <SlideUp key={course.id} delay={0.04 * index}>
          <CardHover>
            <CourseCard
              course={course}
              locked={locksReady && !isUnlocked(course.slug)}
            />
          </CardHover>
        </SlideUp>
      ))}
    </div>
  );
}
