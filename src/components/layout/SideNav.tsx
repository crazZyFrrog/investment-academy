"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Settings,
  TrendingUp,
} from "@/design-system/icons";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Главная", icon: LayoutDashboard },
  { href: "/courses", label: "Курсы", icon: BookOpen },
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
    <aside className="hidden w-[15.5rem] shrink-0 border-r border-border bg-surface lg:block">
      <div className="flex h-[4.25rem] items-center gap-2.5 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <GraduationCap className="size-5 text-primary" aria-hidden />
          <span className="font-display text-[1.05rem] tracking-tight text-text-primary">
            Академия
          </span>
        </Link>
      </div>
      <nav
        className="flex flex-col gap-1 px-3 pb-6"
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
                  ? "bg-muted text-text-primary"
                  : "text-text-secondary hover:bg-muted/70 hover:text-text-primary"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
