import Link from "next/link";
import Image from "next/image";
import { getCourses, getLessonSummaries } from "@/data/content/loader";
import {
  getDailyInsights,
  pickDailyInsight,
} from "@/data/content/insights";
import { ScreenContainer } from "@/components/ui/screen-container";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { ContinueLearningCard } from "@/features/dashboard/ContinueLearningCard";
import { DailyHabitCard } from "@/features/dashboard/DailyHabitCard";
import { DailyInsightCard } from "@/features/dashboard/DailyInsightCard";
import { ReviewDueCard } from "@/features/review/ReviewDueCard";
import { SimulatorPromoCard } from "@/features/dashboard/SimulatorPromoCard";
import { ArrowRight } from "@/design-system/icons";
import { sortByLearningPath } from "@/features/catalog/labels";
import { DashboardPathProgress } from "@/features/dashboard/DashboardPathProgress";
import { DashboardCourseList } from "@/features/dashboard/DashboardCourseList";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";
import { ReadablePanel } from "@/components/layout/ReadablePanel";
import { EditorialPathMark } from "@/components/layout/EditorialPathMark";

export default async function DashboardPage() {
  const [coursesRaw, insights] = await Promise.all([
    getCourses(),
    getDailyInsights(),
  ]);
  const courses = sortByLearningPath(coursesRaw);
  const insight = pickDailyInsight(insights);

  const lessonsEntries = await Promise.all(
    courses.map(async (course) => {
      const lessons = await getLessonSummaries(course.slug);
      return [course.id, lessons] as const;
    })
  );
  const lessonsByCourseId = Object.fromEntries(lessonsEntries);

  return (
    <div className="relative min-h-full">
      <ScreenAtmosphere
        src="/images/screens/dashboard.jpg"
        priority
        intensity="catalog"
      />
      <ScreenContainer className="relative z-10 space-y-10 pb-8">
        <FadeIn className="pt-2">
          <ReadablePanel className="space-y-3">
            <p className="text-label text-primary">Investment Academy</p>
            <h1 className="text-heading-1">Учитесь инвестировать спокойно</h1>
            <p className="max-w-lg text-body text-text-secondary">
              Курсы открываются по шагам. Завершите уроки и тесты текущего
              курса — следующий станет доступен.
            </p>
            <EditorialPathMark variant="section" className="pt-1" />
          </ReadablePanel>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="space-y-4">
            <DailyHabitCard
              courses={courses}
              lessonsByCourseId={lessonsByCourseId}
            />
            <ContinueLearningCard
              courses={courses}
              lessonsByCourseId={lessonsByCourseId}
            />
            <ReviewDueCard
              courses={courses}
              lessonsByCourseId={lessonsByCourseId}
            />
            <SimulatorPromoCard courses={courses} />
          </div>
        </FadeIn>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-heading-3">Учебный путь</h2>
              <p className="text-caption">Рекомендуемый порядок прохождения</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/courses">
                Каталог
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <FadeIn delay={0.04}>
            <div className="relative h-36 overflow-hidden rounded-[var(--radius-xl)] border border-border sm:h-44">
              <Image
                src="/images/learning-path-banner.png"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-primary/20 mix-blend-multiply"
                aria-hidden
              />
              <div className="absolute inset-0 bg-background/15" aria-hidden />
            </div>
          </FadeIn>

          <DashboardPathProgress courses={courses} />

          <DashboardCourseList courses={courses} />
        </section>

        <FadeIn delay={0.08}>
          <DailyInsightCard insight={insight} />
        </FadeIn>
      </ScreenContainer>
    </div>
  );
}
