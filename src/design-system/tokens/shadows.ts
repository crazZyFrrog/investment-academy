/**
 * Soft elevation — barely-there shadows.
 * Prefer border + surface contrast over heavy drop shadows.
 */
export const shadows = {
  none: "none",
  xs: "0 1px 2px rgba(26, 26, 24, 0.04)",
  sm: "0 2px 8px rgba(26, 26, 24, 0.04), 0 1px 2px rgba(26, 26, 24, 0.03)",
  md: "0 4px 16px rgba(26, 26, 24, 0.06), 0 1px 3px rgba(26, 26, 24, 0.04)",
  lg: "0 8px 28px rgba(26, 26, 24, 0.08), 0 2px 6px rgba(26, 26, 24, 0.04)",
  focus: "0 0 0 3px color-mix(in srgb, var(--ring) 28%, transparent)",
} as const;

export type ShadowToken = keyof typeof shadows;
