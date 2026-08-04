"use client";

import { usePathname } from "next/navigation";
import { TopBar } from "./TopBar";
import { SideNav } from "./SideNav";
import { MobileNav } from "./MobileNav";
import { EducationalDisclaimer } from "./EducationalDisclaimer";
import { AUTH_ENABLED } from "@/data/auth/flags";
import { GuestMergePrompt } from "@/features/auth/GuestMergePrompt";
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
        {!isLesson ? (
          <footer className="relative z-10 border-t border-border/70 bg-background/80 px-5 py-4 sm:px-8">
            <EducationalDisclaimer className="mx-auto max-w-5xl" />
          </footer>
        ) : null}
      </div>
      <MobileNav />
      {AUTH_ENABLED ? <GuestMergePrompt /> : null}
    </div>
  );
}
