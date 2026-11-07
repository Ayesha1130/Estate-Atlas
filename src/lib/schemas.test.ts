import { describe, it, expect } from "vitest";
import { ListingBody } from "./schemas";
import { toSqft, totalPrice, pricePerSqft } from "./units";
import { rateLimit } from "./api";

const ok = { title: "3 Bed House", listing: "buy", type: "house", city: "Lahore", price: "5000000" };
describe("ListingBody", () => {
  it("accepts a valid listing and coerces price", () => { const r = ListingBody.parse(ok); expect(r.price).toBe(5000000); });
  it("treats empty bedrooms as undefined", () => { expect(ListingBody.parse({ ...ok, bedrooms: "" }).bedrooms).toBeUndefined(); });
  it("rejects unknown city, bad listing, negative price, short title", () => {
    expect(ListingBody.safeParse({ ...ok, city: "Mars" }).success).toBe(false);
    expect(ListingBody.safeParse({ ...ok, listing: "steal" }).success).toBe(false);
    expect(ListingBody.safeParse({ ...ok, price: "-5" }).success).toBe(false);
    expect(ListingBody.safeParse({ ...ok, title: "ab" }).success).toBe(false);
  });
  it("rejects overlong description", () => { expect(ListingBody.safeParse({ ...ok, description: "x".repeat(1501) }).success).toBe(false); });
});
describe("units", () => {
  it("converts marla and kanal", () => { expect(toSqft(1, "marla")).toBe(272.25); expect(toSqft(1, "kanal")).toBe(5445); });
  it("computes total and per-sqft price", () => {
    expect(totalPrice(5, "marla", 1000000)).toBe(5000000);
    expect(pricePerSqft(1, "sqft", 500)).toBe(500);
    expect(pricePerSqft(0, "marla", 1000)).toBe(0);
  });
});
describe("rateLimit (memory fallback)", () => {
  it("blocks after the limit", async () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "9.9.9.9" } });
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await rateLimit(req, "t", 3));
    expect(results).toEqual([true, true, true, false]);
  });
});

import { SearchFilters } from "./schemas";
describe("SearchFilters (AI extraction)", () => {
  it("accepts valid filters with nulls", () => { expect(SearchFilters.safeParse({ city: "Lahore", max_price: 30000000, size_marla: 10, type: null }).success).toBe(true); });
  it("rejects invented cities and negative budgets", () => {
    expect(SearchFilters.safeParse({ city: "Atlantis" }).success).toBe(false);
    expect(SearchFilters.safeParse({ max_price: -1 }).success).toBe(false);
  });
});
