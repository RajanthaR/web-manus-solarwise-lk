import { eq, and, gte, lte, desc, asc, sql, isNull, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  providers, InsertProvider, Provider,
  hardwareBrands, InsertHardwareBrand, HardwareBrand,
  solarPanels, InsertSolarPanel, SolarPanel,
  inverters, InsertInverter, Inverter,
  batteries, InsertBattery, Battery,
  solarPackages, InsertSolarPackage, SolarPackage,
  cebTariffs, InsertCebTariff, CebTariff,
  inquiries, InsertInquiry, Inquiry,
  chatHistory, InsertChatMessage, ChatMessage,
  reviews, InsertReview, Review,
  reviewVotes, InsertReviewVote, ReviewVote
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER HELPERS ============
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ PROVIDER HELPERS ============
export async function getAllProviders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(providers).where(eq(providers.isActive, true)).orderBy(asc(providers.name));
}

export async function getProviderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(providers).where(eq(providers.id, id)).limit(1);
  return result[0] || null;
}

export async function createProvider(data: InsertProvider) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(providers).values(data);
  return result[0].insertId;
}

export async function updateProvider(id: number, data: Partial<InsertProvider>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(providers).set(data).where(eq(providers.id, id));
}

export async function deleteProvider(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(providers).set({ isActive: false }).where(eq(providers.id, id));
}

// ============ HARDWARE BRAND HELPERS ============
export async function getAllBrands() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(hardwareBrands).orderBy(asc(hardwareBrands.name));
}

export async function getBrandById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(hardwareBrands).where(eq(hardwareBrands.id, id)).limit(1);
  return result[0] || null;
}

export async function createBrand(data: InsertHardwareBrand) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(hardwareBrands).values(data);
  return result[0].insertId;
}

export async function updateBrand(id: number, data: Partial<InsertHardwareBrand>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(hardwareBrands).set(data).where(eq(hardwareBrands.id, id));
}

// ============ SOLAR PANEL HELPERS ============
export async function getAllPanels() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(solarPanels).orderBy(desc(solarPanels.qualityScore));
}

export async function getPanelById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(solarPanels).where(eq(solarPanels.id, id)).limit(1);
  return result[0] || null;
}

export async function getPanelsWithBrand() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    panel: solarPanels,
    brand: hardwareBrands
  }).from(solarPanels)
    .leftJoin(hardwareBrands, eq(solarPanels.brandId, hardwareBrands.id))
    .orderBy(desc(solarPanels.qualityScore));
}

export async function createPanel(data: InsertSolarPanel) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(solarPanels).values(data);
  return result[0].insertId;
}

export async function updatePanel(id: number, data: Partial<InsertSolarPanel>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(solarPanels).set(data).where(eq(solarPanels.id, id));
}

// ============ INVERTER HELPERS ============
export async function getAllInverters() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inverters).orderBy(desc(inverters.qualityScore));
}

export async function getInverterById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(inverters).where(eq(inverters.id, id)).limit(1);
  return result[0] || null;
}

export async function getInvertersWithBrand() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    inverter: inverters,
    brand: hardwareBrands
  }).from(inverters)
    .leftJoin(hardwareBrands, eq(inverters.brandId, hardwareBrands.id))
    .orderBy(desc(inverters.qualityScore));
}

export async function createInverter(data: InsertInverter) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inverters).values(data);
  return result[0].insertId;
}

export async function updateInverter(id: number, data: Partial<InsertInverter>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inverters).set(data).where(eq(inverters.id, id));
}

// ============ BATTERY HELPERS ============
export async function getAllBatteries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(batteries).orderBy(desc(batteries.qualityScore));
}

export async function getBatteryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(batteries).where(eq(batteries.id, id)).limit(1);
  return result[0] || null;
}

export async function getBatteriesWithBrand() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    battery: batteries,
    brand: hardwareBrands
  }).from(batteries)
    .leftJoin(hardwareBrands, eq(batteries.brandId, hardwareBrands.id))
    .orderBy(desc(batteries.qualityScore));
}

export async function createBattery(data: InsertBattery) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(batteries).values(data);
  return result[0].insertId;
}

export async function updateBattery(id: number, data: Partial<InsertBattery>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(batteries).set(data).where(eq(batteries.id, id));
}

// ============ SOLAR PACKAGE HELPERS ============
export async function getAllPackages(filters?: {
  type?: 'on-grid' | 'off-grid' | 'hybrid';
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  providerId?: number;
  sortBy?: 'roi' | 'quality' | 'price';
  sortOrder?: 'asc' | 'desc';
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select({
    package: solarPackages,
    provider: providers,
    panel: solarPanels,
    inverter: inverters,
    battery: batteries
  }).from(solarPackages)
    .leftJoin(providers, eq(solarPackages.providerId, providers.id))
    .leftJoin(solarPanels, eq(solarPackages.panelId, solarPanels.id))
    .leftJoin(inverters, eq(solarPackages.inverterId, inverters.id))
    .leftJoin(batteries, eq(solarPackages.batteryId, batteries.id))
    .where(eq(solarPackages.isActive, true));

  // Apply filters using $dynamic
  const conditions = [eq(solarPackages.isActive, true)];
  
  if (filters?.type) {
    conditions.push(eq(solarPackages.type, filters.type));
  }
  if (filters?.providerId) {
    conditions.push(eq(solarPackages.providerId, filters.providerId));
  }

  const results = await db.select({
    package: solarPackages,
    provider: providers,
    panel: solarPanels,
    inverter: inverters,
    battery: batteries
  }).from(solarPackages)
    .leftJoin(providers, eq(solarPackages.providerId, providers.id))
    .leftJoin(solarPanels, eq(solarPackages.panelId, solarPanels.id))
    .leftJoin(inverters, eq(solarPackages.inverterId, inverters.id))
    .leftJoin(batteries, eq(solarPackages.batteryId, batteries.id))
    .where(and(...conditions))
    .orderBy(
      filters?.sortBy === 'roi' ? (filters.sortOrder === 'desc' ? desc(solarPackages.roiYears) : asc(solarPackages.roiYears)) :
      filters?.sortBy === 'quality' ? (filters.sortOrder === 'desc' ? desc(solarPackages.hardwareQualityScore) : asc(solarPackages.hardwareQualityScore)) :
      filters?.sortBy === 'price' ? (filters.sortOrder === 'desc' ? desc(solarPackages.priceLKR) : asc(solarPackages.priceLKR)) :
      desc(solarPackages.hardwareQualityScore)
    );

  // Apply additional filters in memory for complex conditions
  let filtered = results;
  if (filters?.minCapacity) {
    filtered = filtered.filter(r => Number(r.package.systemCapacity) >= filters.minCapacity!);
  }
  if (filters?.maxCapacity) {
    filtered = filtered.filter(r => Number(r.package.systemCapacity) <= filters.maxCapacity!);
  }
  if (filters?.minPrice) {
    filtered = filtered.filter(r => Number(r.package.priceLKR) >= filters.minPrice!);
  }
  if (filters?.maxPrice) {
    filtered = filtered.filter(r => Number(r.package.priceLKR) <= filters.maxPrice!);
  }

  return filtered;
}

export async function getPackageById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select({
    package: solarPackages,
    provider: providers,
    panel: solarPanels,
    inverter: inverters,
    battery: batteries
  }).from(solarPackages)
    .leftJoin(providers, eq(solarPackages.providerId, providers.id))
    .leftJoin(solarPanels, eq(solarPackages.panelId, solarPanels.id))
    .leftJoin(inverters, eq(solarPackages.inverterId, inverters.id))
    .leftJoin(batteries, eq(solarPackages.batteryId, batteries.id))
    .where(eq(solarPackages.id, id))
    .limit(1);
  
  return result[0] || null;
}

export async function getFeaturedPackages() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    package: solarPackages,
    provider: providers
  }).from(solarPackages)
    .leftJoin(providers, eq(solarPackages.providerId, providers.id))
    .where(and(eq(solarPackages.isActive, true), eq(solarPackages.isFeatured, true)))
    .orderBy(desc(solarPackages.hardwareQualityScore))
    .limit(6);
}

export async function createPackage(data: InsertSolarPackage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(solarPackages).values(data);
  return result[0].insertId;
}

export async function updatePackage(id: number, data: Partial<InsertSolarPackage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(solarPackages).set(data).where(eq(solarPackages.id, id));
}

export async function deletePackage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(solarPackages).set({ isActive: false }).where(eq(solarPackages.id, id));
}

// ============ CEB TARIFF HELPERS ============
export async function getActiveTariffs(category: 'domestic' | 'religious' | 'industrial' | 'commercial' = 'domestic') {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(cebTariffs)
    .where(and(eq(cebTariffs.category, category), eq(cebTariffs.isActive, true)))
    .orderBy(asc(cebTariffs.blockNumber));
}

export async function createTariff(data: InsertCebTariff) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(cebTariffs).values(data);
  return result[0].insertId;
}

export async function updateTariff(id: number, data: Partial<InsertCebTariff>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(cebTariffs).set(data).where(eq(cebTariffs.id, id));
}

// ============ INQUIRY HELPERS ============
export async function createInquiry(data: InsertInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inquiries).values(data);
  return result[0].insertId;
}

export async function getAllInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function updateInquiryStatus(id: number, status: 'pending' | 'contacted' | 'converted' | 'closed') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
}

// ============ CHAT HISTORY HELPERS ============
export async function saveChatMessage(data: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(chatHistory).values(data);
}

export async function getChatHistory(sessionId: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatHistory)
    .where(eq(chatHistory.sessionId, sessionId))
    .orderBy(desc(chatHistory.createdAt))
    .limit(limit);
}

// ============ ROI CALCULATOR LOGIC ============
export interface ROICalculation {
  monthlyBillLKR: number;
  estimatedUnits: number;
  recommendedCapacityKW: number;
  estimatedMonthlySavingsLKR: number;
  estimatedAnnualSavingsLKR: number;
  paybackYears: number;
  tariffBreakdown: {
    block: number;
    units: number;
    rate: number;
    amount: number;
  }[];
}

// CEB Tariff blocks for domestic consumers (effective from January 2025)
const CEB_TARIFF_BLOCKS = [
  { block: 1, minUnits: 0, maxUnits: 60, rate: 11.00, fixedCharge: 0 },
  { block: 2, minUnits: 61, maxUnits: 90, rate: 14.00, fixedCharge: 400 },
  { block: 3, minUnits: 91, maxUnits: 120, rate: 25.00, fixedCharge: 1000 },
  { block: 4, minUnits: 121, maxUnits: 180, rate: 33.00, fixedCharge: 1500 },
  { block: 5, minUnits: 181, maxUnits: 99999, rate: 52.00, fixedCharge: 2000 },
];

// Low consumption tariff (0-60 units)
const LOW_CONSUMPTION_BLOCKS = [
  { block: 1, minUnits: 0, maxUnits: 30, rate: 4.00, fixedCharge: 75 },
  { block: 2, minUnits: 31, maxUnits: 60, rate: 6.00, fixedCharge: 200 },
];

// Average solar generation in Sri Lanka: ~4.5 kWh per kW per day = ~135 kWh per kW per month
const MONTHLY_GENERATION_PER_KW = 130; // kWh

export function calculateUnitsFromBill(billLKR: number): number {
  // First check if it's low consumption (bill < ~400 LKR suggests < 60 units)
  if (billLKR <= 560) { // Max for 60 units at low rate: 30*4 + 30*6 + 200 = 560
    // Low consumption calculation
    let remaining = billLKR;
    let units = 0;
    
    // Try block 1 first (0-30 units at 4 LKR)
    if (remaining <= 75 + 30 * 4) {
      units = Math.max(0, (remaining - 75) / 4);
    } else {
      // Block 2 (31-60 units at 6 LKR)
      remaining -= 75; // Remove fixed charge
      units = 30; // First 30 units
      remaining -= 30 * 4;
      units += Math.min(30, remaining / 6);
    }
    return Math.round(units);
  }
  
  // High consumption calculation (>60 units)
  let remaining = billLKR;
  let units = 0;
  
  // Determine which block based on fixed charge
  // Block 5: fixed 2000, rate 52 for >180 units
  // Block 4: fixed 1500, rate 33 for 121-180 units
  // Block 3: fixed 1000, rate 25 for 91-120 units
  // Block 2: fixed 400, rate 14 for 61-90 units
  
  // Start from highest block and work down
  if (remaining > 2000 + 60*11 + 30*14 + 30*25 + 60*33) {
    // Block 5
    remaining -= 2000; // Fixed charge
    units = 60; // Block 1
    remaining -= 60 * 11;
    units += 30; // Block 2
    remaining -= 30 * 14;
    units += 30; // Block 3
    remaining -= 30 * 25;
    units += 60; // Block 4
    remaining -= 60 * 33;
    units += remaining / 52; // Block 5
  } else if (remaining > 1500 + 60*11 + 30*14 + 30*25) {
    // Block 4
    remaining -= 1500;
    units = 60 + 30 + 30;
    remaining -= 60*11 + 30*14 + 30*25;
    units += Math.min(60, remaining / 33);
  } else if (remaining > 1000 + 60*11 + 30*14) {
    // Block 3
    remaining -= 1000;
    units = 60 + 30;
    remaining -= 60*11 + 30*14;
    units += Math.min(30, remaining / 25);
  } else if (remaining > 400 + 60*11) {
    // Block 2
    remaining -= 400;
    units = 60;
    remaining -= 60*11;
    units += Math.min(30, remaining / 14);
  } else {
    // Block 1 (61+ units at 11 LKR)
    units = remaining / 11;
  }
  
  return Math.round(Math.max(0, units));
}

export function calculateBillFromUnits(units: number): { total: number; breakdown: { block: number; units: number; rate: number; amount: number }[] } {
  const breakdown: { block: number; units: number; rate: number; amount: number }[] = [];
  let total = 0;
  let remainingUnits = units;
  
  if (units <= 60) {
    // Low consumption tariff
    const block1Units = Math.min(30, remainingUnits);
    if (block1Units > 0) {
      const amount = block1Units * 4 + 75;
      breakdown.push({ block: 1, units: block1Units, rate: 4, amount });
      total += amount;
      remainingUnits -= block1Units;
    }
    
    if (remainingUnits > 0) {
      const block2Units = Math.min(30, remainingUnits);
      const amount = block2Units * 6 + 200;
      breakdown.push({ block: 2, units: block2Units, rate: 6, amount });
      total += amount;
    }
  } else {
    // High consumption tariff
    // Block 1: 0-60 units at 11 LKR
    const block1Units = Math.min(60, remainingUnits);
    breakdown.push({ block: 1, units: block1Units, rate: 11, amount: block1Units * 11 });
    total += block1Units * 11;
    remainingUnits -= block1Units;
    
    // Block 2: 61-90 units at 14 LKR
    if (remainingUnits > 0) {
      const block2Units = Math.min(30, remainingUnits);
      breakdown.push({ block: 2, units: block2Units, rate: 14, amount: block2Units * 14 });
      total += block2Units * 14 + 400; // Add fixed charge
      remainingUnits -= block2Units;
    }
    
    // Block 3: 91-120 units at 25 LKR
    if (remainingUnits > 0) {
      const block3Units = Math.min(30, remainingUnits);
      breakdown.push({ block: 3, units: block3Units, rate: 25, amount: block3Units * 25 });
      total += block3Units * 25 + 600; // Additional fixed charge
      remainingUnits -= block3Units;
    }
    
    // Block 4: 121-180 units at 33 LKR
    if (remainingUnits > 0) {
      const block4Units = Math.min(60, remainingUnits);
      breakdown.push({ block: 4, units: block4Units, rate: 33, amount: block4Units * 33 });
      total += block4Units * 33 + 500; // Additional fixed charge
      remainingUnits -= block4Units;
    }
    
    // Block 5: >180 units at 52 LKR
    if (remainingUnits > 0) {
      breakdown.push({ block: 5, units: remainingUnits, rate: 52, amount: remainingUnits * 52 });
      total += remainingUnits * 52 + 500; // Additional fixed charge
    }
  }
  
  return { total, breakdown };
}

export function calculateROI(monthlyBillLKR: number, systemPriceLKR: number): ROICalculation {
  const estimatedUnits = calculateUnitsFromBill(monthlyBillLKR);
  const recommendedCapacityKW = Math.ceil(estimatedUnits / MONTHLY_GENERATION_PER_KW * 10) / 10;
  
  // Calculate savings (assuming 100% offset with net metering)
  const monthlyGeneration = recommendedCapacityKW * MONTHLY_GENERATION_PER_KW;
  const newUnits = Math.max(0, estimatedUnits - monthlyGeneration);
  const newBill = calculateBillFromUnits(newUnits);
  
  const estimatedMonthlySavingsLKR = monthlyBillLKR - newBill.total;
  const estimatedAnnualSavingsLKR = estimatedMonthlySavingsLKR * 12;
  const paybackYears = systemPriceLKR / estimatedAnnualSavingsLKR;
  
  const originalBill = calculateBillFromUnits(estimatedUnits);
  
  return {
    monthlyBillLKR,
    estimatedUnits,
    recommendedCapacityKW,
    estimatedMonthlySavingsLKR,
    estimatedAnnualSavingsLKR,
    paybackYears: Math.round(paybackYears * 10) / 10,
    tariffBreakdown: originalBill.breakdown
  };
}

export function getRecommendedSystemSize(monthlyBillLKR: number): {
  capacityKW: number;
  estimatedUnits: number;
  minPriceRange: number;
  maxPriceRange: number;
} {
  const estimatedUnits = calculateUnitsFromBill(monthlyBillLKR);
  const capacityKW = Math.ceil(estimatedUnits / MONTHLY_GENERATION_PER_KW * 10) / 10;
  
  // Rough price estimates per kW in Sri Lanka (2024-2025)
  const pricePerKW = {
    min: 120000, // Budget options
    max: 180000  // Premium options
  };
  
  return {
    capacityKW,
    estimatedUnits,
    minPriceRange: Math.round(capacityKW * pricePerKW.min),
    maxPriceRange: Math.round(capacityKW * pricePerKW.max)
  };
}

// ============ HARDWARE QUALITY SCORING ============
export function calculateHardwareQualityScore(
  panelScore: number | null,
  inverterScore: number | null,
  batteryScore: number | null = null
): number {
  const scores: number[] = [];
  
  if (panelScore !== null) scores.push(panelScore * 0.4); // 40% weight for panels
  if (inverterScore !== null) scores.push(inverterScore * 0.4); // 40% weight for inverter
  if (batteryScore !== null) scores.push(batteryScore * 0.2); // 20% weight for battery
  
  if (scores.length === 0) return 0;
  
  // Normalize if battery is not present
  if (batteryScore === null && panelScore !== null && inverterScore !== null) {
    return (panelScore * 0.5 + inverterScore * 0.5);
  }
  
  return scores.reduce((a, b) => a + b, 0);
}

// ============ KNOWLEDGE BASE FOR RAG ============
export async function getKnowledgeBase() {
  const db = await getDb();
  if (!db) return { panels: [], inverters: [], batteries: [], tariffs: [], packages: [] };
  
  const [panels, invertersList, batteriesList, tariffs, packages] = await Promise.all([
    getPanelsWithBrand(),
    getInvertersWithBrand(),
    getBatteriesWithBrand(),
    getActiveTariffs(),
    getAllPackages()
  ]);
  
  return {
    panels,
    inverters: invertersList,
    batteries: batteriesList,
    tariffs,
    packages
  };
}


// ============ REVIEWS ============
export async function createReview(review: Omit<InsertReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(reviews).values(review);
  return result[0].insertId;
}

export async function getReviewById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getReviewsByPackage(packageId: number, status: 'pending' | 'approved' | 'rejected' | null = 'approved') {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(reviews.packageId, packageId)];
  if (status) {
    conditions.push(eq(reviews.status, status));
  }
  
  const result = await db.select().from(reviews)
    .where(and(...conditions))
    .orderBy(desc(reviews.createdAt));
  
  return result;
}

export async function getReviewsByProvider(providerId: number, status: 'pending' | 'approved' | 'rejected' | null = 'approved') {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(reviews.providerId, providerId)];
  if (status) {
    conditions.push(eq(reviews.status, status));
  }
  
  const result = await db.select().from(reviews)
    .where(and(...conditions))
    .orderBy(desc(reviews.createdAt));
  
  return result;
}

export async function getReviewsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(reviews)
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt));
  
  return result;
}

export async function getAllReviews(status?: 'pending' | 'approved' | 'rejected') {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(reviews);
  if (status) {
    query = query.where(eq(reviews.status, status)) as typeof query;
  }
  
  const result = await query.orderBy(desc(reviews.createdAt));
  return result;
}

export async function getReviewsWithDetails(status?: 'pending' | 'approved' | 'rejected') {
  const db = await getDb();
  if (!db) return [];
  
  const reviewsList = await getAllReviews(status);
  
  // Get user, package, and provider details for each review
  const reviewsWithDetails = await Promise.all(reviewsList.map(async (review) => {
    const [user, pkg, provider] = await Promise.all([
      db.select().from(users).where(eq(users.id, review.userId)).limit(1),
      review.packageId ? db.select().from(solarPackages).where(eq(solarPackages.id, review.packageId)).limit(1) : Promise.resolve([]),
      review.providerId ? db.select().from(providers).where(eq(providers.id, review.providerId)).limit(1) : Promise.resolve([])
    ]);
    
    return {
      review,
      user: user[0] || null,
      package: pkg[0] || null,
      provider: provider[0] || null
    };
  }));
  
  return reviewsWithDetails;
}

export async function updateReview(id: number, data: Partial<InsertReview>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(reviews).set(data).where(eq(reviews.id, id));
}

export async function updateReviewStatus(id: number, status: 'pending' | 'approved' | 'rejected', moderatorNote?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(reviews).set({ status, moderatorNote }).where(eq(reviews.id, id));
}

export async function deleteReview(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(reviews).where(eq(reviews.id, id));
}

export async function getPackageAverageRating(packageId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select({
    avgOverall: sql<number>`AVG(${reviews.overallRating})`,
    avgInstallation: sql<number>`AVG(${reviews.installationRating})`,
    avgPerformance: sql<number>`AVG(${reviews.performanceRating})`,
    avgSupport: sql<number>`AVG(${reviews.supportRating})`,
    avgValue: sql<number>`AVG(${reviews.valueRating})`,
    totalReviews: sql<number>`COUNT(*)`,
  }).from(reviews)
    .where(and(
      eq(reviews.packageId, packageId),
      eq(reviews.status, 'approved')
    ));
  
  if (!result[0] || result[0].totalReviews === 0) return null;
  
  return {
    overall: Math.round(result[0].avgOverall * 10) / 10,
    installation: result[0].avgInstallation ? Math.round(result[0].avgInstallation * 10) / 10 : null,
    performance: result[0].avgPerformance ? Math.round(result[0].avgPerformance * 10) / 10 : null,
    support: result[0].avgSupport ? Math.round(result[0].avgSupport * 10) / 10 : null,
    value: result[0].avgValue ? Math.round(result[0].avgValue * 10) / 10 : null,
    totalReviews: result[0].totalReviews,
  };
}

export async function getProviderAverageRating(providerId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select({
    avgOverall: sql<number>`AVG(${reviews.overallRating})`,
    avgInstallation: sql<number>`AVG(${reviews.installationRating})`,
    avgPerformance: sql<number>`AVG(${reviews.performanceRating})`,
    avgSupport: sql<number>`AVG(${reviews.supportRating})`,
    avgValue: sql<number>`AVG(${reviews.valueRating})`,
    totalReviews: sql<number>`COUNT(*)`,
  }).from(reviews)
    .where(and(
      eq(reviews.providerId, providerId),
      eq(reviews.status, 'approved')
    ));
  
  if (!result[0] || result[0].totalReviews === 0) return null;
  
  return {
    overall: Math.round(result[0].avgOverall * 10) / 10,
    installation: result[0].avgInstallation ? Math.round(result[0].avgInstallation * 10) / 10 : null,
    performance: result[0].avgPerformance ? Math.round(result[0].avgPerformance * 10) / 10 : null,
    support: result[0].avgSupport ? Math.round(result[0].avgSupport * 10) / 10 : null,
    value: result[0].avgValue ? Math.round(result[0].avgValue * 10) / 10 : null,
    totalReviews: result[0].totalReviews,
  };
}

// ============ REVIEW VOTES ============
export async function voteReview(reviewId: number, userId: number, isHelpful: boolean): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if user already voted
  const existingVote = await db.select().from(reviewVotes)
    .where(and(
      eq(reviewVotes.reviewId, reviewId),
      eq(reviewVotes.userId, userId)
    )).limit(1);
  
  if (existingVote.length > 0) {
    // Update existing vote
    await db.update(reviewVotes)
      .set({ isHelpful })
      .where(eq(reviewVotes.id, existingVote[0].id));
  } else {
    // Create new vote
    await db.insert(reviewVotes).values({ reviewId, userId, isHelpful });
  }
  
  // Update helpful count on review
  const helpfulVotes = await db.select({ count: sql<number>`COUNT(*)` })
    .from(reviewVotes)
    .where(and(
      eq(reviewVotes.reviewId, reviewId),
      eq(reviewVotes.isHelpful, true)
    ));
  
  await db.update(reviews)
    .set({ helpfulCount: helpfulVotes[0]?.count || 0 })
    .where(eq(reviews.id, reviewId));
}

export async function getUserVoteForReview(reviewId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(reviewVotes)
    .where(and(
      eq(reviewVotes.reviewId, reviewId),
      eq(reviewVotes.userId, userId)
    )).limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getReviewStats() {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, approved: 0, rejected: 0 };
  
  const [total, pending, approved, rejected] = await Promise.all([
    db.select({ count: sql<number>`COUNT(*)` }).from(reviews),
    db.select({ count: sql<number>`COUNT(*)` }).from(reviews).where(eq(reviews.status, 'pending')),
    db.select({ count: sql<number>`COUNT(*)` }).from(reviews).where(eq(reviews.status, 'approved')),
    db.select({ count: sql<number>`COUNT(*)` }).from(reviews).where(eq(reviews.status, 'rejected')),
  ]);
  
  return {
    total: total[0]?.count || 0,
    pending: pending[0]?.count || 0,
    approved: approved[0]?.count || 0,
    rejected: rejected[0]?.count || 0,
  };
}
