import type { ProgressSnapshot } from "@/domain/progress/types";

export function guestHasProgress(snapshot: ProgressSnapshot): boolean {
  return Object.values(snapshot.courses).some(
    (course) =>
      course.completedLessons > 0 ||
      Object.values(course.lessons).some(
        (lesson) => lesson.status !== "not_started"
      )
  );
}
