import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_ALLOCATIONS,
  PORTFOLIO_PRESETS,
} from "@/domain/simulator/instruments";
import type { Allocations, HorizonYears, InstrumentId } from "@/domain/simulator";

interface SimulatorState {
  allocations: Allocations;
  initialAmount: number;
  horizonYears: HorizonYears;
  setAllocation: (id: InstrumentId, value: number) => void;
  setInitialAmount: (value: number) => void;
  setHorizonYears: (value: HorizonYears) => void;
  normalizeAllocations: () => void;
  applyPreset: (preset: keyof typeof PORTFOLIO_PRESETS) => void;
  reset: () => void;
}

const initialState = {
  allocations: { ...DEFAULT_ALLOCATIONS },
  initialAmount: 100_000,
  horizonYears: 10 as HorizonYears,
};

function clampAllocation(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set) => ({
      ...initialState,
      setAllocation: (id, value) =>
        set((state) => ({
          allocations: {
            ...state.allocations,
            [id]: clampAllocation(value),
          },
        })),
      setInitialAmount: (value) =>
        set({ initialAmount: Math.max(1_000, Math.min(100_000_000, Math.round(value))) }),
      setHorizonYears: (value) => set({ horizonYears: value }),
      normalizeAllocations: () =>
        set((state) => {
          const total = Object.values(state.allocations).reduce(
            (sum, value) => sum + value,
            0
          );
          if (total <= 0) return { allocations: { ...DEFAULT_ALLOCATIONS } };

          const entries = Object.entries(state.allocations) as [
            InstrumentId,
            number,
          ][];
          const normalized = entries.reduce(
            (result, [id, value]) => ({
              ...result,
              [id]: Math.round((value / total) * 100),
            }),
            {} as Allocations
          );
          const normalizedTotal = Object.values(normalized).reduce(
            (sum, value) => sum + value,
            0
          );
          const largest = entries.reduce((current, entry) =>
            entry[1] > current[1] ? entry : current
          )[0];
          normalized[largest] += 100 - normalizedTotal;
          return { allocations: normalized };
        }),
      applyPreset: (preset) =>
        set({ allocations: { ...PORTFOLIO_PRESETS[preset].allocations } }),
      reset: () => set({ ...initialState, allocations: { ...DEFAULT_ALLOCATIONS } }),
    }),
    {
      name: "investment-academy-simulator",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
