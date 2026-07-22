import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center hero-surface px-6 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="font-display text-xl">Investment Academy</span>
      </Link>
      <div className="w-full max-w-md rounded-xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
        {children}
      </div>
    </div>
  );
}
