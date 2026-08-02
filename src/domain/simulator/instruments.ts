import type { InstrumentId } from "./types";

export interface SimulatorInstrument {
  id: InstrumentId;
  title: string;
  role: string;
  description: string;
  expectedAnnualReturn: number;
  annualVolatility: number;
  color: string;
}

export const SIMULATOR_INSTRUMENTS: readonly SimulatorInstrument[] = [
  {
    id: "ru-stocks",
    title: "Акции РФ",
    role: "Рост",
    description: "Учебная корзина крупных российских компаний.",
    expectedAnnualReturn: 0.1,
    annualVolatility: 0.25,
    color: "#2A5C58",
  },
  {
    id: "world-stocks",
    title: "Акции мира",
    role: "Рост",
    description: "Учебная глобальная корзина акций разных стран.",
    expectedAnnualReturn: 0.08,
    annualVolatility: 0.2,
    color: "#3D5A66",
  },
  {
    id: "ru-bonds",
    title: "Облигации РФ",
    role: "Стабильность",
    description: "Учебная корзина облигаций с более спокойной динамикой.",
    expectedAnnualReturn: 0.07,
    annualVolatility: 0.08,
    color: "#C88745",
  },
  {
    id: "gold",
    title: "Золото",
    role: "Диверсификация",
    description: "Учебная доля защитного актива с отдельными рисками.",
    expectedAnnualReturn: 0.05,
    annualVolatility: 0.18,
    color: "#9B7B3F",
  },
  {
    id: "cash",
    title: "Кэш",
    role: "Ликвидность",
    description: "Деньги для краткосрочных задач и запаса спокойствия.",
    expectedAnnualReturn: 0.04,
    annualVolatility: 0.01,
    color: "#718087",
  },
];

export const DEFAULT_ALLOCATIONS = {
  "ru-stocks": 20,
  "world-stocks": 20,
  "ru-bonds": 40,
  gold: 10,
  cash: 10,
} as const;

export const PORTFOLIO_PRESETS = {
  conservative: {
    label: "Консервативный",
    allocations: {
      "ru-stocks": 10,
      "world-stocks": 10,
      "ru-bonds": 55,
      gold: 10,
      cash: 15,
    },
  },
  balanced: {
    label: "Сбалансированный",
    allocations: DEFAULT_ALLOCATIONS,
  },
  aggressive: {
    label: "Агрессивный",
    allocations: {
      "ru-stocks": 35,
      "world-stocks": 35,
      "ru-bonds": 15,
      gold: 10,
      cash: 5,
    },
  },
} as const;
