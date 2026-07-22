"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui-store";
import { SyncStatusBadge } from "@/components/progress/SyncStatusBadge";

export function TopBar() {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/60 px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/dashboard" className="font-display text-lg lg:hidden">
          Investment Academy
        </Link>
      </div>
      <SyncStatusBadge />
    </header>
  );
}
