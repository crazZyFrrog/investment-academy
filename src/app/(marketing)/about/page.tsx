import { FadeIn } from "@/components/motion";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <FadeIn className="space-y-4">
        <h1 className="font-display text-4xl tracking-tight">About</h1>
        <p className="text-muted-foreground">
          Investment Academy is built as a long-term, production-grade learning
          platform. Content is versioned in git, progress works offline, and
          authenticated users can sync across devices.
        </p>
      </FadeIn>
    </main>
  );
}
