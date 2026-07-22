"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Settings,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-card/40 lg:block">
      <div className="flex h-16 items-center gap-2 border-b border-border/60 px-6">
        <GraduationCap className="h-5 w-5 text-primary" />
        <span className="font-display text-lg tracking-tight">
          Investment Academy
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
