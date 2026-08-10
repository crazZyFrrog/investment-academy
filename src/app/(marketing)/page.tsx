import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ChartNoAxesCombined,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "@/design-system/icons";
import { Button } from "@/components/ui/button";
import { FadeIn, SlideUp } from "@/components/motion";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/images/hero-workspace.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] opacity-40"
        />
        <div className="absolute inset-0 bg-[#070b0a]/85" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(168,255,22,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(168,255,22,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <section className="relative mx-auto grid min-h-[min(100svh,720px)] max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28 lg:pt-28">
        <div className="relative z-10 min-w-0">
          <FadeIn>
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#a8ff16]/25 bg-[#a8ff16]/8 px-3 py-1.5 text-[0.7rem] font-medium leading-snug text-[#caff72] sm:mb-7 sm:text-xs">
              <span className="size-1.5 shrink-0 rounded-full bg-[#a8ff16] shadow-[0_0_12px_#a8ff16]" />
              <span className="min-w-0">Обучение инвестициям без информационного шума</span>
            </div>
          </FadeIn>
          <SlideUp delay={0.06}>
            <h1 className="max-w-3xl font-display text-[2.35rem] leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl sm:leading-[0.98] md:text-7xl lg:text-[5.8rem]">
              Стройте решения.
              <br />
              <span className="text-[#a8ff16]">Не угадывайте рынок.</span>
            </h1>
          </SlideUp>
          <FadeIn delay={0.14}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/62 sm:mt-7 sm:text-lg">
              Практическая академия для тех, кто хочет понимать свои деньги,
              видеть риски и собирать стратегию с холодной головой.
            </p>
          </FadeIn>
          <SlideUp delay={0.2}>
            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
              <Button size="lg" className="w-full bg-[#a8ff16] text-[#071007] hover:bg-[#c2ff62] sm:w-auto" asChild>
                <Link href="/dashboard" prefetch>
                  Начать путь <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full border-white/18 bg-white/5 text-white hover:bg-white/10 sm:w-auto" asChild>
                <Link href="/courses"><Play className="size-4 fill-current" /> Смотреть курсы</Link>
              </Button>
            </div>
          </SlideUp>
          <div className="mt-8 flex flex-col gap-3 text-xs text-white/45 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-x-8">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 shrink-0 text-[#a8ff16]" /> Без обещаний лёгкой прибыли</span>
            <span className="flex items-center gap-2"><Users className="size-4 shrink-0 text-[#a8ff16]" /> Для любого уровня</span>
          </div>
        </div>

        <FadeIn delay={0.2} className="relative hidden lg:block">
          <div className="absolute -inset-12 rounded-full bg-[#a8ff16]/8 blur-3xl" />
          <div className="relative ml-auto max-w-md rotate-2 rounded-2xl border border-white/15 bg-[#101714]/90 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 flex items-center justify-between text-xs text-white/50">
              <span>Портфель · обзор</span><span className="text-[#a8ff16]">● рынок открыт</span>
            </div>
            <div className="flex items-end justify-between">
              <div><p className="text-xs text-white/45">Сценарий стратегии</p><p className="mt-1 text-3xl font-semibold text-white">+18.42%</p></div>
              <span className="rounded-full bg-[#a8ff16]/12 px-2 py-1 text-xs text-[#baff43]">за 12 мес.</span>
            </div>
            <div className="mt-8 flex h-32 items-end gap-2 border-b border-white/10">
              {[34, 48, 42, 59, 54, 72, 66, 88, 79, 100].map((height, index) => (
                <div key={height} className="flex-1 rounded-t-sm bg-[#a8ff16]" style={{ height: `${height}%`, opacity: 0.3 + index / 16 }} />
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <MiniStat label="Риск" value="Умеренный" />
              <MiniStat label="Горизонт" value="5+ лет" />
              <MiniStat label="Баланс" value="78 / 100" />
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="border-y border-white/8 bg-[#0b100e]/80">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/8 px-4 sm:px-6 lg:grid-cols-4 lg:px-10">
          <Metric value="12+" label="практических модулей" />
          <Metric value="4–6 ч" label="на один учебный путь" />
          <Metric value="100%" label="понятный язык" />
          <Metric value="24/7" label="доступ к материалам" />
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div className="min-w-0">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#a8ff16]">Что внутри</p>
            <h2 className="max-w-md font-display text-3xl leading-tight text-white sm:text-4xl md:text-5xl">Всё, что нужно для уверенного старта.</h2>
            <p className="mt-5 max-w-sm text-white/52">Пять опорных навыков, которые превращают хаотичные действия в последовательный процесс.</p>
            <Link href="/courses" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#a8ff16] hover:text-white">Изучить программу <ArrowRight className="size-4" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Feature icon={ChartNoAxesCombined} title="Читаем рынок" text="Разбираемся в трендах, циклах и базовых метриках." />
            <Feature icon={Target} title="Собираем стратегию" text="Формулируем правила, горизонт и точки контроля." />
            <Feature icon={ShieldCheck} title="Управляем риском" text="Считаем размер позиции и защищаем капитал." />
            <Feature icon={BrainCircuit} title="Думаем системно" text="Работаем с эмоциями и решениями на фактах." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-10 lg:pb-32">
        <div className="rounded-2xl border border-[#a8ff16]/18 bg-[#a8ff16]/[0.06] p-6 sm:p-12 lg:flex lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Sparkles className="mb-5 size-6 text-[#a8ff16]" />
            <h2 className="max-w-2xl font-display text-2xl text-white sm:text-3xl md:text-4xl">Ваш следующий шаг — не ещё один прогноз.</h2>
            <p className="mt-4 max-w-xl text-white/55">Начните с основ и соберите собственную систему принятия решений.</p>
          </div>
          <Button size="lg" className="mt-8 w-full bg-[#a8ff16] text-[#071007] hover:bg-[#c2ff62] sm:w-auto lg:mt-0" asChild>
            <Link href="/dashboard">Открыть академию <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3 py-6 sm:px-8 sm:py-7">
      <p className="font-display text-xl text-white sm:text-3xl">{value}</p>
      <p className="mt-1 text-[0.7rem] leading-snug text-white/42 sm:text-xs">{label}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] uppercase tracking-wider text-white/35">{label}</p><p className="mt-1 text-xs text-white/80">{value}</p></div>;
}

function Feature({ icon: Icon, title, text }: { icon: typeof BarChart3; title: string; text: string }) {
  return <div className="rounded-xl border border-white/8 bg-white/[0.025] p-6 transition-colors hover:border-[#a8ff16]/30 hover:bg-[#a8ff16]/[0.04]"><Icon className="size-5 text-[#a8ff16]" /><h3 className="mt-7 text-base font-medium text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/45">{text}</p></div>;
}
