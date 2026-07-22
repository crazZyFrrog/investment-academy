import { getCourses } from "@/data/content/loader";
import { CourseCatalog } from "@/features/catalog/CourseCatalog";
import { sortByLearningPath } from "@/features/catalog/labels";

export default async function CoursesPage() {
  const courses = sortByLearningPath(await getCourses());
  return <CourseCatalog courses={courses} />;
}
