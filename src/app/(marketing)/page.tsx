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
        intensity="soft"
      />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center px-6 pb-24 pt-8">
        <div className="max-w-2xl space-y-8">
          <FadeIn>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-text-primary md:text-7xl md:leading-[1.02]">
              Investment Academy
            </h1>
          </FadeIn>

          <SlideUp delay={0.08}>
            <p className="max-w-lg font-display text-2xl leading-snug tracking-tight text-text-primary md:text-3xl">
              Учитесь инвестировать спокойно — без шума и обещаний лёгкой
              прибыли.
            </p>
          </SlideUp>

          <FadeIn delay={0.16}>
            <p className="max-w-md text-lg text-text-secondary">
              Короткие курсы о рынках, риске и долгом горизонте — онлайн и
              офлайн.
            </p>
          </FadeIn>

          <SlideUp delay={0.22}>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Начать обучение
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/courses">Смотреть курсы</Link>
              </Button>
            </div>
          </SlideUp>
        </div>
      </main>
    </>
  );
}
