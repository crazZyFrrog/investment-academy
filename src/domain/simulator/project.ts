import {
  SIMULATOR_INSTRUMENTS,
  type SimulatorInstrument,
} from "./instruments";
import type { PortfolioInput, PortfolioProjection } from "./types";

function weightedMetric(
  allocations: PortfolioInput["allocations"],
  selector: (instrument: SimulatorInstrument) => number
) {
  return SIMULATOR_INSTRUMENTS.reduce(
    (total, instrument) =>
      total + (allocations[instrument.id] / 100) * selector(instrument),
    0
  );
}

function projectAmount(
  initialAmount: number,
  annualReturn: number,
  years: number
) {
  return initialAmount * Math.pow(1 + annualReturn, years);
}

export function projectPortfolio(input: PortfolioInput): PortfolioProjection {
  const allocationTotal = Object.values(input.allocations).reduce(
    (total, value) => total + value,
    0
  );
  const annualReturn = weightedMetric(
    input.allocations,
    (instrument) => instrument.expectedAnnualReturn
  );
  const annualVolatility = weightedMetric(
    input.allocations,
    (instrument) => instrument.annualVolatility
  );
  const cautiousReturn = Math.max(-0.5, annualReturn - annualVolatility * 0.5);
  const optimisticReturn = annualReturn + annualVolatility * 0.5;
  const series = Array.from({ length: input.horizonYears + 1 }, (_, year) => ({
    year,
    cautious: projectAmount(input.initialAmount, cautiousReturn, year),
    base: projectAmount(input.initialAmount, annualReturn, year),
    optimistic: projectAmount(input.initialAmount, optimisticReturn, year),
  }));

  return {
    allocationTotal,
    annualReturn,
    annualVolatility,
    scenarios: {
      cautious: projectAmount(
        input.initialAmount,
        cautiousReturn,
        input.horizonYears
      ),
      base: projectAmount(input.initialAmount, annualReturn, input.horizonYears),
      optimistic: projectAmount(
        input.initialAmount,
        optimisticReturn,
        input.horizonYears
      ),
    },
    series,
  };
}
