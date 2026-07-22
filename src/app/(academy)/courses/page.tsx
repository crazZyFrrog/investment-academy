import Link from "next/link";
import { getCourses } from "@/data/content/loader";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <FadeIn className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl tracking-tight">Courses</h1>
        <p className="text-muted-foreground">
          Structured paths from fundamentals to advanced portfolio thinking.
        </p>
      </div>

      <div className="grid gap-4">
        {courses.map((course, index) => (
          <FadeIn key={course.id} delay={index * 0.05}>
            <Link
              href={`/courses/${course.slug}`}
              className="block rounded-xl border border-border/60 bg-card/60 p-6 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{course.level}</Badge>
                <span className="text-sm text-muted-foreground">
                  {course.lessonCount} lessons
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl">{course.title}</h2>
              <p className="mt-2 text-muted-foreground">{course.description}</p>
            </Link>
          </FadeIn>
        ))}
      </div>
    </FadeIn>
  );
}
