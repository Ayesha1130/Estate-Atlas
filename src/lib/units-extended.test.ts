import { describe, it, expect } from "vitest";
import {
  toSqft,
  fromSqft,
  estimateConstructionCost,
  calculateEmi,
  MARLA_STANDARDS,
} from "./units";
import { formatArea } from "./format";

describe("extended units and regional standards", () => {
  it("converts using LDA standard (225 sqft)", () => {
    expect(toSqft(1, "marla", 225)).toBe(225);
    expect(toSqft(1, "kanal", 225)).toBe(4500);
    const converted = fromSqft(2250, 225);
    expect(converted.marla).toBe(10);
    expect(converted.kanal).toBe(0.5);
  });

  it("converts using CDA/Bahria standard (250 sqft)", () => {
    expect(toSqft(1, "marla", 250)).toBe(250);
    expect(toSqft(1, "kanal", 250)).toBe(5000);
  });

  it("converts Guz (sqyd) to sqft accurately", () => {
    expect(toSqft(100, "sqyd")).toBe(900);
    expect(toSqft(100, "guz")).toBe(900);
  });

  it("calculates construction estimates for Pakistani market", () => {
    const est = estimateConstructionCost(10, "marla", "luxury", 75, 225);
    expect(est.areaSqft).toBe(2250);
    expect(est.coveredAreaSqft).toBe(1688); // 75% of 2250
    expect(est.ratePerSqft).toBe(7200);
    expect(est.totalCost).toBe(Math.round(1687.5 * 7200));
    expect(est.breakdown.structure + est.breakdown.finishing).toBe(est.totalCost);
  });

  it("calculates EMI and loan amortization correctly", () => {
    const emi = calculateEmi(10000000, 20, 12, 10); // 1 Crore, 20% down, 12% interest, 10 years
    expect(emi.loanAmount).toBe(8000000);
    expect(emi.downPaymentAmount).toBe(2000000);
    expect(emi.monthlyEmi).toBeGreaterThan(110000);
    expect(emi.monthlyEmi).toBeLessThan(120000);
    expect(emi.totalPayment).toBe(emi.monthlyEmi * 120);
    expect(emi.yearlySchedule.length).toBe(10);
  });

  it("formats Pakistani land areas intuitively", () => {
    expect(formatArea(2250, 225)).toBe("10 Marla");
    expect(formatArea(4500, 225)).toBe("1 Kanal");
    expect(formatArea(9000, 225)).toBe("2 Kanal");
    expect(formatArea(5625, 225)).toBe("1 Kanal 5.0 Marla");
  });
});

