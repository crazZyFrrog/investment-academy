/**
 * Breakpoints — mobile-first.
 * Aligns with Tailwind defaults used across the academy shell.
 */
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export type BreakpointToken = keyof typeof breakpoints;
