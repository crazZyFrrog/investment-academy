import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center px-6 pb-20 pt-10">
      <FadeIn className="max-w-3xl space-y-6">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
          Investment Academy
        </p>
        <h1 className="font-display text-5xl leading-tight tracking-tight md:text-6xl">
          Learn to invest with clarity, not noise.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          A production-ready learning platform for markets, risk, and long-term
          portfolio thinking — online or offline.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Start learning
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">Browse courses</Link>
          </Button>
        </div>
      </FadeIn>
    </main>
  );
}
