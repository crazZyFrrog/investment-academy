"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  Gift,
  GraduationCap,
  LayoutDashboard,
  Settings,
  TrendingUp,
} from "@/design-system/icons";
import { cn } from "@/lib/utils";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { UserAccountPanel } from "./UserAccountPanel";

const navItems = [
  { href: "/dashboard", label: "Главная", icon: LayoutDashboard },
  { href: "/courses", label: "Курсы", icon: BookOpen },
  { href: "/rewards", label: "Награды", icon: Gift },
  { href: "/glossary", label: "Словарь", icon: Bookmark },
  { href: "/progress", label: "Прогресс", icon: TrendingUp },
  { href: "/settings", label: "Ещё", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-20 hidden h-dvh w-[15.5rem] shrink-0 flex-col self-start border-r border-border bg-surface/90 lg:flex">
      <div className="flex h-[4.25rem] shrink-0 items-center px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_18px_rgba(168,255,22,0.16)]">
            <GraduationCap className="size-5" aria-hidden />
          </span>
          <span className="truncate font-display text-[1.05rem] tracking-tight text-text-primary">
            Академия
          </span>
        </Link>
      </div>
      <nav
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4"
        aria-label="Основная навигация"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm transition-colors duration-[var(--duration-fast)]",
                active
                  ? "bg-primary/10 text-primary shadow-[inset_2px_0_0_var(--primary)]"
                  : "text-text-secondary hover:bg-muted/70 hover:text-text-primary"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      {AUTH_ENABLED ? (
        <UserAccountPanel className="shrink-0 bg-surface" />
      ) : null}
    </aside>
  );
}
