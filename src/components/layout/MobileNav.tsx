"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  BookOpen,
  Bookmark,
  Gift,
  LayoutDashboard,
  Menu,
  Settings,
  TrendingUp,
  X,
} from "@/design-system/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
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

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-text-primary"
          aria-label="Открыть меню"
        >
          <Menu className="size-5" aria-hidden />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-[#070b0a]/55 backdrop-blur-sm data-[state=closed]:animate-none" />
        <Dialog.Content
          className={cn(
            "fixed inset-y-0 left-0 z-[var(--z-modal)] flex w-[min(20rem,88vw)] flex-col border-r border-primary/15 bg-surface/95 shadow-[18px_0_48px_rgba(0,0,0,0.28)] backdrop-blur-xl",
            "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
            "data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full",
            "transition-transform duration-[var(--duration-normal)] ease-[var(--ease-standard)] motion-reduce:transition-none"
          )}
        >
          <div className="flex h-[3.75rem] shrink-0 items-center justify-between gap-3 px-4">
            <Dialog.Title className="font-display text-lg tracking-tight text-text-primary">
              Меню
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Навигация по академии
            </Dialog.Description>
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Закрыть меню"
              >
                <X className="size-5" aria-hidden />
              </Button>
            </Dialog.Close>
          </div>
          <nav
            className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 pb-5"
            aria-label="Мобильная навигация"
          >
            {items.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-3 text-sm transition-colors duration-[var(--duration-fast)]",
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
