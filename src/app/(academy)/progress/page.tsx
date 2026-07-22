import { getCourses } from "@/data/content/loader";
import { ProgressPageClient } from "@/features/progress/ProgressPageClient";

export default async function ProgressPage() {
  const courses = await getCourses();
  return <ProgressPageClient courses={courses} />;
}
