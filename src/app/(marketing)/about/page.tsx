import { FadeIn } from "@/components/motion";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";

export default function AboutPage() {
  return (
    <>
      <ScreenAtmosphere src="/images/screens/about.jpg" intensity="catalog" />
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <FadeIn>
          <article className="space-y-8 rounded-[var(--radius-2xl)] border border-border/80 bg-surface/95 px-6 py-8 shadow-sm backdrop-blur-sm sm:px-10 sm:py-10">
            <div className="space-y-4">
              <h1 className="font-display text-4xl tracking-tight text-text-primary">
                О проекте
              </h1>
              <p className="text-body text-text-secondary">
                Investment Academy — учебная платформа о рынках, риске и долгом
                горизонте. Контент версионируется в git, прогресс работает
                офлайн на устройстве.
              </p>
              <p className="text-body text-text-secondary">
                Можно учиться как гость или войти через Google/Apple, чтобы
                синхронизировать пройденные уроки между устройствами.
              </p>
            </div>
            <div className="space-y-3 border-t border-border pt-8">
              <h2 className="font-display text-2xl tracking-tight text-text-primary">
                Важно
              </h2>
              <p className="text-body text-text-secondary">
                Материалы носят образовательный характер и не являются
                индивидуальной инвестиционной или налоговой рекомендацией.
                Условия финансовых продуктов и нормы права могут меняться —
                сверяйте актуальные правила в официальных источниках перед
                решениями с деньгами.
              </p>
            </div>
          </article>
        </FadeIn>
      </main>
    </>
  );
}
