import { describe, it, expect } from "vitest";
import { str, num } from "./api";
import { pkr } from "./format";

describe("str", () => {
  it("trims and truncates", () => { expect(str("  hello  ", 3)).toBe("hel"); });
  it("rejects non-strings", () => { expect(str(123, 10)).toBe(""); });
});
describe("num", () => {
  it("accepts positive numbers", () => { expect(num("5000")).toBe(5000); });
  it("rejects negative and NaN", () => { expect(num(-1)).toBeNull(); expect(num("abc")).toBeNull(); });
});
describe("pkr", () => {
  it("formats crore, lakh and plain", () => {
    expect(pkr(25000000)).toBe("PKR 2.50 Crore");
    expect(pkr(5000000)).toBe("PKR 50.0 Lakh");
    expect(pkr(60000)).toBe("PKR 60,000");
  });
});
