import Link from "next/link";
import { ArrowRight } from "@/design-system/icons";
import { Button } from "@/components/ui/button";
import { FadeIn, SlideUp } from "@/components/motion";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";

export default function HomePage() {
  return (
    <>
      <ScreenAtmosphere
        src="/images/hero-landing.jpg"
        priority
        intensity="hero"
      />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center px-6 pb-24 pt-8">
        <div className="relative max-w-md space-y-5 rounded-[var(--radius-xl)] border border-border/55 bg-surface/48 p-5 shadow-md backdrop-blur-md sm:max-w-lg sm:space-y-6 sm:p-6 dark:bg-surface/43">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Learning path · 01
            </p>
          </FadeIn>

          <FadeIn delay={0.04}>
            <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-text-primary sm:text-5xl sm:leading-[1.05]">
              Investment Academy
            </h1>
          </FadeIn>

          <SlideUp delay={0.1}>
            <p className="max-w-sm font-display text-xl leading-snug tracking-tight text-text-primary sm:text-2xl">
              Учитесь инвестировать спокойно — без шума и обещаний лёгкой
              прибыли.
            </p>
          </SlideUp>

          <FadeIn delay={0.16}>
            <p className="max-w-sm text-base font-medium text-text-primary/85">
              Короткие курсы о рынках, риске и долгом горизонте — онлайн и
              офлайн.
            </p>
          </FadeIn>

          <SlideUp delay={0.22}>
            <div className="flex flex-wrap gap-2.5">
              <Button size="default" variant="accent" asChild>
                <Link href="/dashboard" prefetch>
                  Начать обучение
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="default"
                variant="outline"
                className="border-border/80 bg-surface/80 backdrop-blur-sm"
                asChild
              >
                <Link href="/courses" prefetch>
                  Смотреть курсы
                </Link>
              </Button>
            </div>
          </SlideUp>
        </div>
      </main>
    </>
  );
}
