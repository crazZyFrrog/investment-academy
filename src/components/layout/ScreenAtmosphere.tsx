import Image from "next/image";
import { cn } from "@/lib/utils";

export type AtmosphereIntensity =
  | "hero"
  | "catalog"
  | "progress"
  | "soft"
  | "default"
  | "strong"
  | "reading";

/**
 * Full-bleed atmospheric photo behind a screen.
 * Hero keeps the photo vivid (no paper wash) — readability comes from the content card.
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
  intensity?: AtmosphereIntensity;
}) {
  const atmosphereSrc = src.startsWith("/images/screens/")
    ? "/images/hero-workspace.jpg"
    : src;

  // Hero: full-viewport photo, no paper wash. Card provides readability.
  if (intensity === "hero") {
    return (
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-0 overflow-hidden",
          className
        )}
        aria-hidden
      >
        <Image
          src={atmosphereSrc}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        {/* Dark vignette only — never bleach with background/paper */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/12 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15" />
        <div
          className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(168,255,22,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(168,255,22,0.08)_1px,transparent_1px)] [background-size:72px_72px]"
          aria-hidden
        />
      </div>
    );
  }

  const wash =
    intensity === "soft"
      ? "bg-primary/18 dark:bg-background/42"
      : intensity === "catalog"
        ? "bg-background/48 sm:bg-background/38 dark:bg-background/62 dark:sm:bg-background/52"
        : intensity === "progress"
          ? "bg-background/88 sm:bg-background/84"
          : intensity === "reading"
            ? "bg-background/86 sm:bg-background/80"
            : intensity === "strong"
              ? "bg-background/75 sm:bg-background/68"
              : "bg-background/45 sm:bg-background/35 dark:bg-background/58 dark:sm:bg-background/48";

  const sideWash =
    intensity === "soft"
      ? "bg-gradient-to-r from-background/90 via-background/55 to-transparent dark:from-background/75 dark:via-background/40 dark:to-transparent"
      : intensity === "catalog"
        ? "bg-background/68 sm:bg-background/48 dark:bg-background/72 dark:sm:bg-background/55"
        : intensity === "progress"
          ? "bg-background/94 sm:bg-background/90"
          : intensity === "reading"
            ? "bg-background/92 sm:bg-background/86"
            : intensity === "strong"
              ? "bg-background/82 sm:bg-background/75"
              : "bg-background/60 sm:bg-background/42 dark:bg-background/68 dark:sm:bg-background/52";

  const showSideWash = intensity !== "progress";
  const useMask = intensity !== "soft" && intensity !== "catalog";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <Image
        src={atmosphereSrc}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover object-[center_35%]"
      />
      <div className={cn("absolute inset-0", wash)} />
      {showSideWash ? (
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-full",
            intensity === "soft" ? "max-w-xl sm:max-w-2xl" : "max-w-4xl",
            sideWash
          )}
          style={
            useMask
              ? {
                  maskImage:
                    "linear-gradient(to right, black 35%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, black 35%, transparent 100%)",
                }
              : undefined
          }
        />
      ) : null}
      <div
        className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(168,255,22,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(168,255,22,0.08)_1px,transparent_1px)] [background-size:72px_72px]"
        aria-hidden
      />
    </div>
  );
}
