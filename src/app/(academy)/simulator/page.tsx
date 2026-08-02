import { getCourses } from "@/data/content/loader";
import { SimulatorPageClient } from "@/features/simulator/SimulatorPageClient";
import { sortByLearningPath } from "@/features/catalog/labels";

export default async function SimulatorPage() {
  const courses = sortByLearningPath(await getCourses());

  return <SimulatorPageClient courses={courses} />;
}
