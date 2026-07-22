/**
 * Border radius — generous, Apple/Linear-inspired.
 * Controls: md · Cards/panels: xl · Soft sheets: 2xl · Pills: full
 */
export const radius = {
  none: "0px",
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export type RadiusToken = keyof typeof radius;
