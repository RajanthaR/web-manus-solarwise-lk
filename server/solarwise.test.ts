import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context for public procedures
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

// Mock context for authenticated user
function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// Mock context for admin user
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("SolarWise LK - ROI Calculator", () => {
  it("calculates recommended system size for low bill (LKR 5,000)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calculator.getRecommendation({ monthlyBillLKR: 5000 });

    expect(result).toBeDefined();
    expect(result.capacityKW).toBeGreaterThan(0);
    expect(result.estimatedUnits).toBeGreaterThan(0);
  });

  it("calculates recommended system size for medium bill (LKR 15,000)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calculator.getRecommendation({ monthlyBillLKR: 15000 });

    expect(result).toBeDefined();
    expect(result.capacityKW).toBeGreaterThanOrEqual(1);
    expect(result.estimatedUnits).toBeGreaterThan(50);
  });

  it("calculates recommended system size for high bill (LKR 35,000)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calculator.getRecommendation({ monthlyBillLKR: 35000 });

    expect(result).toBeDefined();
    expect(result.capacityKW).toBeGreaterThanOrEqual(3);
    expect(result.estimatedUnits).toBeGreaterThan(150);
  });

  it("calculates full ROI with system price", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.calculator.calculate({
      monthlyBillLKR: 20000,
      systemPriceLKR: 850000,
    });

    expect(result).toBeDefined();
    expect(result.recommendation).toBeDefined();
    expect(result.roi).toBeDefined();
    expect(result.roi?.paybackYears).toBeGreaterThan(0);
  });
});

describe("SolarWise LK - Providers API", () => {
  it("lists all providers", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const providers = await caller.providers.list();

    expect(providers).toBeDefined();
    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBeGreaterThan(0);
    expect(providers[0]).toHaveProperty("name");
  });
});

describe("SolarWise LK - Packages API", () => {
  it("lists all packages", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const packages = await caller.packages.list();

    expect(packages).toBeDefined();
    expect(Array.isArray(packages)).toBe(true);
    expect(packages.length).toBeGreaterThan(0);
  });

  it("filters packages by type", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const onGridPackages = await caller.packages.list({ type: "on-grid" });

    expect(onGridPackages).toBeDefined();
    expect(Array.isArray(onGridPackages)).toBe(true);
    // All returned packages should be on-grid
    onGridPackages.forEach((pkg) => {
      expect(pkg.package.type).toBe("on-grid");
    });
  });

  it("filters packages by capacity range", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const packages = await caller.packages.list({
      minCapacity: 3,
      maxCapacity: 6,
    });

    expect(packages).toBeDefined();
    expect(Array.isArray(packages)).toBe(true);
    // All returned packages should be within capacity range
    packages.forEach((pkg) => {
      const capacity = Number(pkg.package.systemCapacity);
      expect(capacity).toBeGreaterThanOrEqual(3);
      expect(capacity).toBeLessThanOrEqual(6);
    });
  });
});

describe("SolarWise LK - Hardware API", () => {
  it("lists all panels with brand info", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const panels = await caller.panels.list();

    expect(panels).toBeDefined();
    expect(Array.isArray(panels)).toBe(true);
    expect(panels.length).toBeGreaterThan(0);
    expect(panels[0]).toHaveProperty("panel");
    expect(panels[0]).toHaveProperty("brand");
  });

  it("lists all inverters with brand info", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const inverters = await caller.inverters.list();

    expect(inverters).toBeDefined();
    expect(Array.isArray(inverters)).toBe(true);
    expect(inverters.length).toBeGreaterThan(0);
    expect(inverters[0]).toHaveProperty("inverter");
    expect(inverters[0]).toHaveProperty("brand");
  });

  it("lists all batteries with brand info", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const batteries = await caller.batteries.list();

    expect(batteries).toBeDefined();
    expect(Array.isArray(batteries)).toBe(true);
    expect(batteries.length).toBeGreaterThan(0);
    expect(batteries[0]).toHaveProperty("battery");
    expect(batteries[0]).toHaveProperty("brand");
  });

  it("lists all hardware brands", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const brands = await caller.brands.list();

    expect(brands).toBeDefined();
    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);
    expect(brands[0]).toHaveProperty("name");
  });
});

describe("SolarWise LK - Admin Access Control", () => {
  it("denies non-admin access to admin stats", async () => {
    const ctx = createAuthContext(); // Regular user, not admin
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.stats()).rejects.toThrow("Admin access required");
  });

  it("allows admin access to admin stats", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.admin.stats();

    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("totalProviders");
    expect(stats).toHaveProperty("totalPackages");
    expect(stats).toHaveProperty("totalInquiries");
    expect(stats).toHaveProperty("totalPanels");
    expect(stats).toHaveProperty("totalInverters");
  });
});

describe("SolarWise LK - Inquiries", () => {
  it("creates an inquiry from public user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiries.create({
      name: "Test User",
      phone: "+94771234567",
      email: "test@example.com",
      monthlyBillLKR: "15000",
      message: "Interested in 5kW system",
    });

    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
  });
});
