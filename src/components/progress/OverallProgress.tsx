"use client";

import type { ProgressSnapshot } from "@/domain/progress/types";
import { Progress } from "@/components/ui/progress";

export function OverallProgress({ snapshot }: { snapshot: ProgressSnapshot }) {
  const courses = Object.values(snapshot.courses);

  if (courses.length === 0) {
    return (
      <p className="text-muted-foreground">
        No progress yet. Start your first lesson to track completion here.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div key={course.courseId} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{course.courseId}</span>
            <span className="text-muted-foreground">
              {course.completedLessons}/{course.totalLessons} lessons
            </span>
          </div>
          <Progress value={course.percentComplete} />
        </div>
      ))}
    </div>
  );
}
