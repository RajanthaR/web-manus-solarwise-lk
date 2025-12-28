import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, boolean } from "drizzle-orm/mysql-core";

// ============ USER TABLE ============
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============ SOLAR PROVIDERS ============
export const providers = mysqlTable("providers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameSinhala: varchar("nameSinhala", { length: 255 }),
  logo: text("logo"),
  website: text("website"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  description: text("description"),
  descriptionSinhala: text("descriptionSinhala"),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Provider = typeof providers.$inferSelect;
export type InsertProvider = typeof providers.$inferInsert;

// ============ HARDWARE BRANDS ============
export const hardwareBrands = mysqlTable("hardware_brands", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }),
  website: text("website"),
  logo: text("logo"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HardwareBrand = typeof hardwareBrands.$inferSelect;
export type InsertHardwareBrand = typeof hardwareBrands.$inferInsert;

// ============ SOLAR PANELS ============
export const solarPanels = mysqlTable("solar_panels", {
  id: int("id").autoincrement().primaryKey(),
  brandId: int("brandId").notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  wattage: int("wattage").notNull(), // in Watts
  efficiency: decimal("efficiency", { precision: 4, scale: 2 }), // percentage e.g., 23.80
  cellType: varchar("cellType", { length: 100 }), // N-type TOPCon, PERC, etc.
  dimensions: varchar("dimensions", { length: 100 }), // LxWxH in mm
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  warrantyYears: int("warrantyYears"),
  performanceWarrantyYears: int("performanceWarrantyYears"),
  degradationYear1: decimal("degradationYear1", { precision: 4, scale: 2 }), // percentage
  degradationAnnual: decimal("degradationAnnual", { precision: 4, scale: 2 }), // percentage per year
  output25Years: decimal("output25Years", { precision: 5, scale: 2 }), // percentage of original
  qualityScore: decimal("qualityScore", { precision: 3, scale: 1 }), // 0-10 score
  pros: json("pros").$type<string[]>(),
  cons: json("cons").$type<string[]>(),
  globalRating: decimal("globalRating", { precision: 2, scale: 1 }), // user rating 0-5
  reviewSummary: text("reviewSummary"),
  reviewSummarySinhala: text("reviewSummarySinhala"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SolarPanel = typeof solarPanels.$inferSelect;
export type InsertSolarPanel = typeof solarPanels.$inferInsert;

// ============ INVERTERS ============
export const inverters = mysqlTable("inverters", {
  id: int("id").autoincrement().primaryKey(),
  brandId: int("brandId").notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["string", "micro", "hybrid", "off-grid"]).notNull(),
  capacity: decimal("capacity", { precision: 6, scale: 2 }).notNull(), // in kW
  maxDcInput: decimal("maxDcInput", { precision: 8, scale: 2 }), // in W
  efficiency: decimal("efficiency", { precision: 5, scale: 2 }), // percentage
  mpptTrackers: int("mpptTrackers"),
  phases: mysqlEnum("phases", ["single", "three"]).default("single"),
  warrantyYears: int("warrantyYears"),
  features: json("features").$type<string[]>(),
  qualityScore: decimal("qualityScore", { precision: 3, scale: 1 }),
  pros: json("pros").$type<string[]>(),
  cons: json("cons").$type<string[]>(),
  globalRating: decimal("globalRating", { precision: 2, scale: 1 }),
  reviewSummary: text("reviewSummary"),
  reviewSummarySinhala: text("reviewSummarySinhala"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inverter = typeof inverters.$inferSelect;
export type InsertInverter = typeof inverters.$inferInsert;

// ============ BATTERIES ============
export const batteries = mysqlTable("batteries", {
  id: int("id").autoincrement().primaryKey(),
  brandId: int("brandId").notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["lithium", "lead-acid", "lfp", "agm"]).notNull(),
  capacityKwh: decimal("capacityKwh", { precision: 6, scale: 2 }).notNull(),
  voltage: int("voltage"),
  cycleLife: int("cycleLife"), // number of cycles
  depthOfDischarge: decimal("depthOfDischarge", { precision: 5, scale: 2 }), // percentage
  warrantyYears: int("warrantyYears"),
  qualityScore: decimal("qualityScore", { precision: 3, scale: 1 }),
  pros: json("pros").$type<string[]>(),
  cons: json("cons").$type<string[]>(),
  globalRating: decimal("globalRating", { precision: 2, scale: 1 }),
  reviewSummary: text("reviewSummary"),
  reviewSummarySinhala: text("reviewSummarySinhala"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Battery = typeof batteries.$inferSelect;
export type InsertBattery = typeof batteries.$inferInsert;

// ============ SOLAR PACKAGES ============
export const solarPackages = mysqlTable("solar_packages", {
  id: int("id").autoincrement().primaryKey(),
  providerId: int("providerId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  nameSinhala: varchar("nameSinhala", { length: 255 }),
  type: mysqlEnum("type", ["on-grid", "off-grid", "hybrid"]).notNull(),
  systemCapacity: decimal("systemCapacity", { precision: 6, scale: 2 }).notNull(), // in kW
  panelId: int("panelId"),
  panelCount: int("panelCount"),
  inverterId: int("inverterId"),
  batteryId: int("batteryId"),
  batteryCount: int("batteryCount"),
  priceLKR: decimal("priceLKR", { precision: 12, scale: 2 }).notNull(),
  installationIncluded: boolean("installationIncluded").default(true),
  warrantyYears: int("warrantyYears"),
  description: text("description"),
  descriptionSinhala: text("descriptionSinhala"),
  features: json("features").$type<string[]>(),
  featuresSinhala: json("featuresSinhala").$type<string[]>(),
  financingAvailable: boolean("financingAvailable").default(false),
  financingDetails: text("financingDetails"),
  estimatedMonthlyGeneration: decimal("estimatedMonthlyGeneration", { precision: 8, scale: 2 }), // kWh
  roiYears: decimal("roiYears", { precision: 4, scale: 2 }), // payback period
  hardwareQualityScore: decimal("hardwareQualityScore", { precision: 3, scale: 1 }), // calculated
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SolarPackage = typeof solarPackages.$inferSelect;
export type InsertSolarPackage = typeof solarPackages.$inferInsert;

// ============ CEB TARIFF BLOCKS ============
export const cebTariffs = mysqlTable("ceb_tariffs", {
  id: int("id").autoincrement().primaryKey(),
  category: mysqlEnum("category", ["domestic", "religious", "industrial", "commercial"]).default("domestic").notNull(),
  blockNumber: int("blockNumber").notNull(),
  minUnits: int("minUnits").notNull(),
  maxUnits: int("maxUnits"), // null means unlimited
  energyChargeLKR: decimal("energyChargeLKR", { precision: 8, scale: 2 }).notNull(),
  fixedChargeLKR: decimal("fixedChargeLKR", { precision: 8, scale: 2 }),
  effectiveFrom: timestamp("effectiveFrom").notNull(),
  effectiveTo: timestamp("effectiveTo"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CebTariff = typeof cebTariffs.$inferSelect;
export type InsertCebTariff = typeof cebTariffs.$inferInsert;

// ============ USER INQUIRIES ============
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  packageId: int("packageId"),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }),
  monthlyBillLKR: decimal("monthlyBillLKR", { precision: 10, scale: 2 }),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "contacted", "converted", "closed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

// ============ CHAT HISTORY ============
export const chatHistory = mysqlTable("chat_history", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  userId: int("userId"),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatHistory.$inferSelect;
export type InsertChatMessage = typeof chatHistory.$inferInsert;


// ============ USER REVIEWS ============
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  packageId: int("packageId"),
  providerId: int("providerId"),
  // Rating fields
  overallRating: int("overallRating").notNull(), // 1-5 stars
  installationRating: int("installationRating"), // 1-5 stars
  performanceRating: int("performanceRating"), // 1-5 stars
  supportRating: int("supportRating"), // 1-5 stars
  valueRating: int("valueRating"), // 1-5 stars
  // Review content
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  pros: json("pros").$type<string[]>(),
  cons: json("cons").$type<string[]>(),
  // Installation details
  installationDate: timestamp("installationDate"),
  systemSize: decimal("systemSize", { precision: 6, scale: 2 }), // kW installed
  monthlyGeneration: decimal("monthlyGeneration", { precision: 8, scale: 2 }), // actual kWh
  previousBill: decimal("previousBill", { precision: 10, scale: 2 }), // LKR before solar
  currentBill: decimal("currentBill", { precision: 10, scale: 2 }), // LKR after solar
  // Media
  photos: json("photos").$type<string[]>(),
  // Verification & moderation
  isVerified: boolean("isVerified").default(false),
  verificationNote: text("verificationNote"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  moderatorNote: text("moderatorNote"),
  // Engagement
  helpfulCount: int("helpfulCount").default(0),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ============ REVIEW HELPFUL VOTES ============
export const reviewVotes = mysqlTable("review_votes", {
  id: int("id").autoincrement().primaryKey(),
  reviewId: int("reviewId").notNull(),
  userId: int("userId").notNull(),
  isHelpful: boolean("isHelpful").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReviewVote = typeof reviewVotes.$inferSelect;
export type InsertReviewVote = typeof reviewVotes.$inferInsert;
