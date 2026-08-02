import Link from "next/link";
import { GraduationCap } from "@/design-system/icons";
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
    <div className="relative min-h-screen bg-transparent">
      <PrefetchRoutes />
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border border-border/55 bg-surface/48 px-2.5 py-1 shadow-xs backdrop-blur-md dark:bg-surface/43"
        >
          <GraduationCap className="size-4 text-primary" />
          <span className="font-display text-sm font-medium tracking-tight text-text-primary">
            Investment Academy
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {AUTH_ENABLED ? (
            <Button variant="ghost" asChild>
              <Link href="/login">Войти</Link>
            </Button>
          ) : null}
          <Button
            variant="accent"
            className="shadow-sm"
            asChild
          >
            <Link href="/dashboard" prefetch>
              В академию
            </Link>
          </Button>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
      <footer className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <EducationalDisclaimer />
      </footer>
    </div>
  );
}
