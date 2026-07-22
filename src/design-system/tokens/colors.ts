/**
 * Semantic color roles — never hardcode hex in components.
 * Palette is intentionally desaturated: calm, premium, educational.
 */
export const semanticColors = [
  "background",
  "surface",
  "surfaceSecondary",
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
  "accent",
  "accentForeground",
  "success",
  "successForeground",
  "warning",
  "warningForeground",
  "error",
  "errorForeground",
  "textPrimary",
  "textSecondary",
  "textTertiary",
  "border",
  "muted",
  "mutedForeground",
  "ring",
  "input",
] as const;

export type SemanticColor = (typeof semanticColors)[number];

/** CSS variable names for each semantic role */
export const colorCssVars: Record<SemanticColor, string> = {
  background: "--background",
  surface: "--surface",
  surfaceSecondary: "--surface-secondary",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  success: "--success",
  successForeground: "--success-foreground",
  warning: "--warning",
  warningForeground: "--warning-foreground",
  error: "--error",
  errorForeground: "--error-foreground",
  textPrimary: "--text-primary",
  textSecondary: "--text-secondary",
  textTertiary: "--text-tertiary",
  border: "--border",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  ring: "--ring",
  input: "--input",
};
