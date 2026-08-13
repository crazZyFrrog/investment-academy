"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "@/design-system/icons";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { UserAccountPanel } from "./UserAccountPanel";

export function TopBar() {
  const pathname = usePathname();
  const isLesson = pathname.includes("/lessons/");

  if (isLesson) {
    return null;
  }

  return (
    <header className="flex h-[3.75rem] items-center justify-between gap-3 px-4 lg:hidden">
      <div className="flex min-w-0 items-center gap-1.5">
        <MobileNav />
        <Link href="/" className="flex min-w-0 shrink items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden />
          </span>
          <span className="truncate font-display text-lg tracking-tight">
            Академия
          </span>
        </Link>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <ThemeToggle />
        {AUTH_ENABLED ? <UserAccountPanel dense /> : null}
      </div>
    </header>
  );
}
