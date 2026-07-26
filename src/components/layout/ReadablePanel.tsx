import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Readable surface for titles/copy sitting over atmospheric backgrounds.
 */
export function ReadablePanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-2xl)] border border-border/70 bg-surface/92 px-5 py-5 shadow-xs backdrop-blur-sm sm:px-7 sm:py-6",
        className
      )}
    >
      {children}
    </div>
  );
}
