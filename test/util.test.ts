import { describe, expect, it } from "vitest";

import { formatNumber, parseNumber } from "../src/util";

describe("formatNumber", () => {
  it("groups thousands", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(9926)).toBe("9,926");
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("leaves short numbers alone", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(7)).toBe("7");
    expect(formatNumber(999)).toBe("999");
  });

  it("keeps up to two decimal places without padding whole numbers", () => {
    expect(formatNumber(412.5)).toBe("412.5");
    expect(formatNumber(1234.25)).toBe("1,234.25");
    expect(formatNumber(1234.567)).toBe("1,234.57");
    expect(formatNumber(1234.001)).toBe("1,234");
  });

  it("handles negatives, which -combat targets produce", () => {
    expect(formatNumber(-25)).toBe("-25");
    expect(formatNumber(-12345.5)).toBe("-12,345.5");
  });

  it("survives the values our budgets actually take", () => {
    // An unset budget is Infinity, and it reaches here if anything prints it.
    expect(formatNumber(Infinity)).toBe("Infinity");
    expect(formatNumber(NaN)).toBe("NaN");
  });

  it("round-trips through parseNumber", () => {
    for (const value of [0, 7, 1000, 9926, 1234567, -25]) {
      expect(parseNumber(formatNumber(value))).toBe(value);
    }
  });
});

describe("parseNumber", () => {
  it("parses integers and decimals", () => {
    expect(parseNumber("400")).toBe(400);
    expect(parseNumber("0.5")).toBe(0.5);
    expect(parseNumber(".1")).toBe(0.1);
    expect(parseNumber("0.")).toBe(0);
  });

  it("tolerates thousands separators", () => {
    expect(parseNumber("1,000")).toBe(1000);
    expect(parseNumber("100,000")).toBe(100000);
  });

  it("parses negative numbers", () => {
    expect(parseNumber("-25")).toBe(-25);
  });

  it("rejects non-numeric tokens", () => {
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("init")).toBeNull();
    expect(parseNumber("869l5309")).toBeNull();
  });
});
