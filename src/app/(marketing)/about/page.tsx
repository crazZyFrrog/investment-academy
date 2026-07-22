import { FadeIn } from "@/components/motion";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";

export default function AboutPage() {
  return (
    <>
      <ScreenAtmosphere src="/images/screens/about.jpg" intensity="soft" />
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-20">
        <FadeIn className="space-y-4">
          <h1 className="font-display text-4xl tracking-tight">О проекте</h1>
          <p className="text-muted-foreground">
            Investment Academy — учебная платформа о рынках, риске и долгом
            горизонте. Контент версионируется в git, прогресс работает офлайн, а
            при входе синхронизируется между устройствами.
          </p>
        </FadeIn>
      </main>
    </>
  );
}
