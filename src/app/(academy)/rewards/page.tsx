import { getCourses } from "@/data/content/loader";
import { RewardsPageClient } from "@/features/rewards/RewardsPageClient";
import { sortByLearningPath } from "@/features/catalog/labels";

export default async function RewardsPage() {
  const courses = sortByLearningPath(await getCourses());
  return <RewardsPageClient courses={courses} />;
}
