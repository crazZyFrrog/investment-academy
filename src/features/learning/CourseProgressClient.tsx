"use client";

import type { LessonSummary } from "@/domain/lesson/types";
import { useCourseProgress } from "@/queries/progress";
import { useUserId } from "@/hooks/use-user-id";
import { CourseProgressBar } from "@/components/course/CourseProgressBar";
import { LessonList } from "@/components/course/LessonList";

export function CourseProgressClient({
  courseId,
  courseSlug,
  totalLessons,
  lessons,
}: {
  courseId: string;
  courseSlug: string;
  totalLessons: number;
  lessons: LessonSummary[];
}) {
  const userId = useUserId();
  const { data: progress } = useCourseProgress(userId, courseId, totalLessons);

  return (
    <div className="space-y-6">
      <CourseProgressBar percent={progress?.percentComplete ?? 0} />
      <LessonList
        courseSlug={courseSlug}
        lessons={lessons}
        progress={progress}
      />
    </div>
  );
}
