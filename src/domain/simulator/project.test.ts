import { describe, expect, it } from "vitest";
import { projectPortfolio } from "./project";

describe("projectPortfolio", () => {
  it("calculates weighted return and scenario amounts", () => {
    const result = projectPortfolio({
      allocations: {
        "ru-stocks": 50,
        "world-stocks": 0,
        "ru-bonds": 50,
        gold: 0,
        cash: 0,
      },
      initialAmount: 100_000,
      horizonYears: 10,
    });

    expect(result.allocationTotal).toBe(100);
    expect(result.annualReturn).toBeCloseTo(0.085);
    expect(result.annualVolatility).toBeCloseTo(0.165);
    expect(result.scenarios.base).toBeCloseTo(100_000 * 1.085 ** 10);
    expect(result.series).toHaveLength(11);
  });

  it("clamps the cautious annual return at a fifty percent loss", () => {
    const result = projectPortfolio({
      allocations: {
        "ru-stocks": 100,
        "world-stocks": 0,
        "ru-bonds": 0,
        gold: 0,
        cash: 0,
      },
      initialAmount: 100_000,
      horizonYears: 1,
    });

    expect(result.scenarios.cautious).toBeGreaterThanOrEqual(50_000);
  });

  it("supports an incomplete allocation while reporting the total", () => {
    const result = projectPortfolio({
      allocations: {
        "ru-stocks": 20,
        "world-stocks": 20,
        "ru-bonds": 20,
        gold: 0,
        cash: 0,
      },
      initialAmount: 100_000,
      horizonYears: 5,
    });

    expect(result.allocationTotal).toBe(60);
  });
});
