/**
 * Typography tokens — sizes, weights, line heights, letter spacing.
 * Pair with Fraunces (display) + Source Sans 3 (body) from root layout.
 */
export const fontSize = {
  xs: "0.75rem", // 12px — Caption, Label
  sm: "0.875rem", // 14px — Body small, Badge
  base: "1rem", // 16px — Body
  lg: "1.125rem", // 18px — Title
  xl: "1.25rem", // 20px — Heading 3
  "2xl": "1.5rem", // 24px — Heading 2
  "3xl": "1.875rem", // 30px — Heading 1
  "4xl": "2.25rem", // 36px — Display compact
  "5xl": "3rem", // 48px — Display
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const lineHeight = {
  none: "1",
  tight: "1.2",
  snug: "1.35",
  normal: "1.5",
  relaxed: "1.65",
} as const;

export const letterSpacing = {
  tighter: "-0.03em",
  tight: "-0.02em",
  normal: "0",
  wide: "0.02em",
  wider: "0.08em",
  widest: "0.2em",
} as const;

export type FontSizeToken = keyof typeof fontSize;
export type FontWeightToken = keyof typeof fontWeight;
