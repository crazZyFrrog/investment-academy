import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen hero-surface">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-display text-xl tracking-tight">
            Investment Academy
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {AUTH_ENABLED ? (
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          ) : null}
          <Button asChild>
            <Link href="/dashboard">Enter academy</Link>
          </Button>
        </div>
      </header>
      {children}
    </div>
  );
}
