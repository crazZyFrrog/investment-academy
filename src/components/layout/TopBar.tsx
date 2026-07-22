"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "@/design-system/icons";

export function TopBar() {
  const pathname = usePathname();
  const isLesson = pathname.includes("/lessons/");

  if (isLesson) {
    return null;
  }

  return (
    <header className="flex h-[3.75rem] items-center justify-between px-5 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <GraduationCap className="size-5 text-primary" aria-hidden />
        <span className="font-display text-lg tracking-tight">Академия</span>
      </Link>
    </header>
  );
}
