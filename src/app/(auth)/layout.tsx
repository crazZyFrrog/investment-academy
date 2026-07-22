import Link from "next/link";
import { GraduationCap } from "@/design-system/icons";
import { ScreenAtmosphere } from "@/components/layout/ScreenAtmosphere";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      <ScreenAtmosphere src="/images/screens/auth.jpg" intensity="default" />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-display text-xl">Investment Academy</span>
        </Link>
        <div className="w-full rounded-[var(--radius-xl)] border border-border/60 bg-surface/90 p-6 shadow-sm backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
