/**
 * Motion — smooth and subtle.
 * Presence over spectacle. Gate with prefers-reduced-motion.
 */
export const duration = {
  instant: "0ms",
  fast: "150ms",
  normal: "220ms",
  moderate: "360ms",
  slow: "520ms",
} as const;

/** Numeric seconds for Framer Motion */
export const durationSeconds = {
  instant: 0,
  fast: 0.15,
  normal: 0.22,
  moderate: 0.36,
  slow: 0.52,
} as const;

export const easing = {
  /** Apple-like ease-out */
  standard: [0.25, 0.1, 0.25, 1] as const,
  emphasized: [0.22, 1, 0.36, 1] as const,
  enter: [0, 0, 0.2, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  spring: { type: "spring" as const, stiffness: 280, damping: 32, mass: 0.9 },
};

export type DurationToken = keyof typeof duration;
