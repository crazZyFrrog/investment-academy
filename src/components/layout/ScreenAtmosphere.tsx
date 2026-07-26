import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Full-bleed atmospheric photo behind a screen — same pattern as the marketing hero.
 * Soft wash keeps type readable without floating overlays.
 */
export function ScreenAtmosphere({
  src,
  priority = false,
  className,
  intensity = "default",
}: {
  src: string;
  priority?: boolean;
  className?: string;
  /** How strong the readable wash is */
  intensity?: "soft" | "default" | "strong" | "reading";
}) {
  const wash =
    intensity === "soft"
      ? "bg-background/45 sm:bg-background/35"
      : intensity === "reading"
        ? "bg-background/82 sm:bg-background/78"
        : intensity === "strong"
          ? "bg-background/75 sm:bg-background/68"
          : "bg-background/60 sm:bg-background/50";

  const sideWash =
    intensity === "soft"
      ? "bg-background/55 sm:bg-background/40"
      : intensity === "reading"
        ? "bg-background/90 sm:bg-background/85"
        : intensity === "strong"
          ? "bg-background/82 sm:bg-background/75"
          : "bg-background/70 sm:bg-background/55";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover object-[center_35%]"
      />
      <div className={cn("absolute inset-0", wash)} />
      <div
        className={cn("absolute inset-y-0 left-0 w-full max-w-4xl", sideWash)}
        style={{
          maskImage: "linear-gradient(to right, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 35%, transparent 100%)",
        }}
      />
    </div>
  );
}
