import Link from "next/link";
import { GraduationCap } from "@/design-system/icons";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="academy-shell relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      <ScreenAtmosphere src="/images/screens/auth.jpg" intensity="hero" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#070b0a]/45" aria-hidden />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Link href="/" className="mb-8 flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_22px_rgba(168,255,22,0.2)]">
            <GraduationCap className="size-5" />
          </span>
          <span className="font-display text-xl tracking-tight text-text-primary">Investment Academy</span>
        </Link>
        <div className="w-full rounded-[var(--radius-2xl)] border border-primary/15 bg-surface/90 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
