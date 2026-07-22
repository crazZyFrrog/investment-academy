"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Settings } from "@/design-system/icons";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/courses", label: "Курсы", icon: BookOpen },
  { href: "/settings", label: "Ещё", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const isLesson = pathname.includes("/lessons/");

  if (isLesson) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Мобильная навигация"
    >
      <div className="mx-auto grid max-w-lg grid-cols-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? false
              : pathname === href ||
                (href === "/courses" && pathname.startsWith("/courses"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-[11px] font-medium tracking-wide transition-colors",
                active ? "text-primary" : "text-text-tertiary"
              )}
            >
              <Icon className="size-[1.15rem]" aria-hidden />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
