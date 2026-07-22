"use client";

import { usePathname } from "next/navigation";
import { TopBar } from "./TopBar";
import { SideNav } from "./SideNav";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLesson = pathname.includes("/lessons/");

  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      {!isLesson ? <SideNav /> : null}
      <div
        className={cn(
          "flex min-h-dvh flex-1 flex-col",
          !isLesson && "pb-[4.5rem] lg:pb-0"
        )}
      >
        <TopBar />
        <main className="relative flex-1">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
