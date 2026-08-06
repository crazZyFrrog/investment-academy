import Link from "next/link";
import { ArrowRight, GraduationCap } from "@/design-system/icons";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { Button } from "@/components/ui/button";
import { EducationalDisclaimer } from "@/components/layout/EducationalDisclaimer";
import { PrefetchRoutes } from "@/components/layout/PrefetchRoutes";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b0a] text-white">
      <PrefetchRoutes />
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between border-b border-white/8 px-6 py-5 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-[#a8ff16] text-[#071007]">
            <GraduationCap className="size-5" />
          </span>
          <span className="font-display text-base font-medium tracking-tight text-white">
            Investment Academy
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-xs text-white/55 lg:flex">
          <Link href="/courses" className="transition-colors hover:text-[#a8ff16]">Курсы</Link>
          <Link href="/glossary" className="transition-colors hover:text-[#a8ff16]">Глоссарий</Link>
          <Link href="/progress" className="transition-colors hover:text-[#a8ff16]">Прогресс</Link>
          <Link href="/#about" className="transition-colors hover:text-[#a8ff16]">О подходе</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          {AUTH_ENABLED ? (
            <>
              <Button variant="ghost" className="text-white/70 hover:bg-white/8 hover:text-white" asChild>
                <Link href="/login">Войти</Link>
              </Button>
              <Button variant="outline" className="hidden border-white/15 bg-transparent text-white hover:bg-white/8 sm:inline-flex" asChild>
                <Link href="/register">
                  <span className="sm:hidden">Регистрация</span>
                  <span className="hidden sm:inline">Зарегистрироваться</span>
                </Link>
              </Button>
            </>
          ) : null}
          <Button variant="accent" className="bg-[#a8ff16] text-[#071007] shadow-[0_0_24px_rgba(168,255,22,0.18)] hover:bg-[#bcff4c]" asChild>
            <Link href="/dashboard" prefetch>
              Войти в академию <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
      <footer className="relative z-10 mx-auto max-w-7xl border-t border-white/8 px-6 py-8 text-white/55 lg:px-10">
        <EducationalDisclaimer />
      </footer>
    </div>
  );
}
