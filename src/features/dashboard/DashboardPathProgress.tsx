"use client";

import type { CourseSummary } from "@/domain/course/types";
import {
  LearningPathSteps,
} from "@/components/progress/LearningPathSteps";
import { getCourseAccent } from "@/features/catalog/labels";
import { useCourseUnlock } from "@/features/learning/use-course-unlock";

export function DashboardPathProgress({
  courses,
}: {
  courses: CourseSummary[];
}) {
  const { pathStatus } = useCourseUnlock(courses);

  const steps = pathStatus.map((item) => ({
    slug: item.slug,
    label: getCourseAccent(item.slug).label.replace(/^Шаг \d+ · /, ""),
    status: item.status,
  }));

  return <LearningPathSteps steps={steps} />;
}
