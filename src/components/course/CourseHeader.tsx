import type { CourseSummary } from "@/domain/course/types";
import { Badge } from "@/components/ui/badge";

export function CourseHeader({ course }: { course: CourseSummary }) {
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{course.level}</Badge>
        {course.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-4xl tracking-tight">{course.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{course.description}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {course.lessonCount} lessons · ~{course.estimatedMinutes} min
      </p>
    </header>
  );
}
