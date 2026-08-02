export type InstrumentId =
  | "ru-stocks"
  | "world-stocks"
  | "ru-bonds"
  | "gold"
  | "cash";

export type HorizonYears = 1 | 5 | 10 | 20;

export type Allocations = Record<InstrumentId, number>;

export interface PortfolioInput {
  allocations: Allocations;
  initialAmount: number;
  horizonYears: HorizonYears;
}

export interface PortfolioProjection {
  allocationTotal: number;
  annualReturn: number;
  annualVolatility: number;
  scenarios: {
    cautious: number;
    base: number;
    optimistic: number;
  };
  series: {
    year: number;
    cautious: number;
    base: number;
    optimistic: number;
  }[];
}
