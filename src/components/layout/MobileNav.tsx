"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  LayoutDashboard,
  Settings,
  TrendingUp,
} from "@/design-system/icons";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Главная", icon: LayoutDashboard },
  { href: "/courses", label: "Курсы", icon: BookOpen },
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

export function MobileNav() {
  const pathname = usePathname();
  const isLesson = pathname.includes("/lessons/");

  if (isLesson) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Мобильная навигация"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 px-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-[var(--radius-lg)] px-1 py-2 text-[11px] font-medium tracking-wide transition-colors",
                "active:bg-muted/80",
                active ? "text-primary" : "text-text-tertiary"
              )}
            >
              <Icon
                className={cn(
                  "size-5",
                  active && "stroke-[2.25px]"
                )}
                aria-hidden
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
