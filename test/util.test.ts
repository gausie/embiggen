import { describe, expect, it } from "vitest";

import { parseNumber } from "../src/util";

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
