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
        "rounded-[var(--radius-2xl)] border border-primary/15 bg-surface/90 px-5 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md sm:px-7 sm:py-6",
        className
      )}
    >
      {children}
    </div>
  );
}
