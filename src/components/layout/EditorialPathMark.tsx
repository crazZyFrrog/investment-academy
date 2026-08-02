import { cn } from "@/lib/utils";

/**
 * Decorative learning-path diagram — editorial route nodes and lines.
 * Purely visual; hidden from assistive tech.
 */
export function EditorialPathMark({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "section";
}) {
  if (variant === "section") {
    return (
      <svg
        viewBox="0 0 320 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("editorial-route h-10 w-full max-w-sm", className)}
        aria-hidden
      >
        <path
          d="M8 24 H72 C88 24 96 8 120 8 H200 C224 8 232 40 256 40 H312"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="8" cy="24" r="3.5" fill="currentColor" />
        <circle cx="120" cy="8" r="3.5" fill="currentColor" />
        <circle cx="200" cy="8" r="3.5" fill="currentColor" />
        <circle
          cx="256"
          cy="40"
          r="4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="var(--background)"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 420 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "editorial-route pointer-events-none absolute right-2 top-1/2 hidden h-[240px] w-[min(52vw,460px)] -translate-y-1/2 sm:block lg:right-6",
        className
      )}
      aria-hidden
    >
      <path
        d="M20 140 C80 140 90 40 160 40 C220 40 230 120 300 120 C350 120 360 70 400 70"
        stroke="currentColor"
        strokeWidth="2.25"
      />
      <path
        d="M160 40 C170 70 190 90 230 95"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity="0.85"
      />
      <circle cx="20" cy="140" r="4.5" fill="currentColor" />
      <circle cx="160" cy="40" r="5.5" fill="currentColor" />
      <circle
        cx="300"
        cy="120"
        r="6.5"
        stroke="currentColor"
        strokeWidth="2"
        fill="var(--surface)"
      />
      <circle cx="400" cy="70" r="5" fill="var(--accent)" />
    </svg>
  );
}
