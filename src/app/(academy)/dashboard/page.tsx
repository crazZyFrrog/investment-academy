import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCourses } from "@/data/content/loader";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { InstallPrompt } from "@/features/pwa/InstallPrompt";

export default async function DashboardPage() {
  const courses = await getCourses();
  const featured = courses[0];

  return (
    <FadeIn className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display text-3xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Continue where you left off or explore the catalog.
          </p>
        </div>
        <InstallPrompt />
      </div>

      {featured ? (
        <section className="rounded-xl border border-border/60 bg-card/60 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Continue learning
          </p>
          <h2 className="mt-2 font-display text-2xl">{featured.title}</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {featured.description}
          </p>
          <Button className="mt-4" asChild>
            <Link href={`/courses/${featured.slug}`}>
              Open course
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      ) : null}
    </FadeIn>
  );
}
