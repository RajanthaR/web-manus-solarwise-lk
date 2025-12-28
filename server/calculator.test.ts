import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("calculator.calculate", () => {
  it("returns system recommendation for given monthly bill", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calculator.calculate({
      monthlyBillLKR: 15000,
    });

    expect(result).toBeDefined();
    expect(result.recommendation).toBeDefined();
    expect(result.recommendation?.capacityKW).toBeGreaterThan(0);
    expect(result.recommendation?.estimatedUnits).toBeGreaterThan(0);
  });

  it("calculates ROI when system price is provided", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calculator.calculate({
      monthlyBillLKR: 25000,
      systemPriceLKR: 700000,
    });

    expect(result).toBeDefined();
    expect(result.roi).toBeDefined();
    expect(result.roi?.paybackYears).toBeGreaterThan(0);
    expect(result.roi?.estimatedMonthlySavingsLKR).toBeGreaterThan(0);
  });

  it("returns higher capacity for higher bills", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const lowBill = await caller.calculator.calculate({ monthlyBillLKR: 5000 });
    const highBill = await caller.calculator.calculate({ monthlyBillLKR: 50000 });

    expect(highBill.recommendation?.capacityKW).toBeGreaterThan(
      lowBill.recommendation?.capacityKW || 0
    );
  });
});

describe("packages.list", () => {
  it("returns list of packages", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.packages.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("filters packages by type", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.packages.list({ type: "on-grid" });

    expect(result).toBeDefined();
    // All returned packages should be on-grid
    result.forEach((item) => {
      expect(item.package.type).toBe("on-grid");
    });
  });
});

describe("panels.list", () => {
  it("returns list of solar panels with brand info", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.panels.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0].panel).toBeDefined();
      expect(result[0].brand).toBeDefined();
    }
  });
});

describe("inverters.list", () => {
  it("returns list of inverters with brand info", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inverters.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0].inverter).toBeDefined();
      expect(result[0].brand).toBeDefined();
    }
  });
});

describe("providers.list", () => {
  it("returns list of providers", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.providers.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0].name).toBeDefined();
    }
  });
});
