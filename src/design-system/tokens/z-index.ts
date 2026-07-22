/**
 * Z-index scale — keep stacking predictable across shells and overlays.
 */
export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
  max: 9999,
} as const;

export type ZIndexToken = keyof typeof zIndex;
