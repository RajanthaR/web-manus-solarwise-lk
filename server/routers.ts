import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import { nanoid } from "nanoid";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ PROVIDERS ============
  providers: router({
    list: publicProcedure.query(async () => {
      return db.getAllProviders();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getProviderById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        nameSinhala: z.string().optional(),
        logo: z.string().optional(),
        website: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        description: z.string().optional(),
        descriptionSinhala: z.string().optional(),
        rating: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createProvider(input);
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        nameSinhala: z.string().optional(),
        logo: z.string().optional(),
        website: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        description: z.string().optional(),
        descriptionSinhala: z.string().optional(),
        rating: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProvider(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProvider(input.id);
        return { success: true };
      }),
  }),

  // ============ HARDWARE BRANDS ============
  brands: router({
    list: publicProcedure.query(async () => {
      return db.getAllBrands();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getBrandById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        country: z.string().optional(),
        website: z.string().optional(),
        logo: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createBrand(input);
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        country: z.string().optional(),
        website: z.string().optional(),
        logo: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateBrand(id, data);
        return { success: true };
      }),
  }),

  // ============ SOLAR PANELS ============
  panels: router({
    list: publicProcedure.query(async () => {
      return db.getPanelsWithBrand();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getPanelById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        brandId: z.number(),
        model: z.string(),
        wattage: z.number(),
        efficiency: z.string().optional(),
        cellType: z.string().optional(),
        dimensions: z.string().optional(),
        weight: z.string().optional(),
        warrantyYears: z.number().optional(),
        performanceWarrantyYears: z.number().optional(),
        degradationYear1: z.string().optional(),
        degradationAnnual: z.string().optional(),
        output25Years: z.string().optional(),
        qualityScore: z.string().optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        globalRating: z.string().optional(),
        reviewSummary: z.string().optional(),
        reviewSummarySinhala: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createPanel(input);
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        brandId: z.number().optional(),
        model: z.string().optional(),
        wattage: z.number().optional(),
        efficiency: z.string().optional(),
        cellType: z.string().optional(),
        dimensions: z.string().optional(),
        weight: z.string().optional(),
        warrantyYears: z.number().optional(),
        performanceWarrantyYears: z.number().optional(),
        degradationYear1: z.string().optional(),
        degradationAnnual: z.string().optional(),
        output25Years: z.string().optional(),
        qualityScore: z.string().optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        globalRating: z.string().optional(),
        reviewSummary: z.string().optional(),
        reviewSummarySinhala: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePanel(id, data);
        return { success: true };
      }),
  }),

  // ============ INVERTERS ============
  inverters: router({
    list: publicProcedure.query(async () => {
      return db.getInvertersWithBrand();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getInverterById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        brandId: z.number(),
        model: z.string(),
        type: z.enum(["string", "micro", "hybrid", "off-grid"]),
        capacity: z.string(),
        maxDcInput: z.string().optional(),
        efficiency: z.string().optional(),
        mpptTrackers: z.number().optional(),
        phases: z.enum(["single", "three"]).optional(),
        warrantyYears: z.number().optional(),
        features: z.array(z.string()).optional(),
        qualityScore: z.string().optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        globalRating: z.string().optional(),
        reviewSummary: z.string().optional(),
        reviewSummarySinhala: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createInverter(input);
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        brandId: z.number().optional(),
        model: z.string().optional(),
        type: z.enum(["string", "micro", "hybrid", "off-grid"]).optional(),
        capacity: z.string().optional(),
        maxDcInput: z.string().optional(),
        efficiency: z.string().optional(),
        mpptTrackers: z.number().optional(),
        phases: z.enum(["single", "three"]).optional(),
        warrantyYears: z.number().optional(),
        features: z.array(z.string()).optional(),
        qualityScore: z.string().optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        globalRating: z.string().optional(),
        reviewSummary: z.string().optional(),
        reviewSummarySinhala: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateInverter(id, data);
        return { success: true };
      }),
  }),

  // ============ BATTERIES ============
  batteries: router({
    list: publicProcedure.query(async () => {
      return db.getBatteriesWithBrand();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getBatteryById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        brandId: z.number(),
        model: z.string(),
        type: z.enum(["lithium", "lead-acid", "lfp", "agm"]),
        capacityKwh: z.string(),
        voltage: z.number().optional(),
        cycleLife: z.number().optional(),
        depthOfDischarge: z.string().optional(),
        warrantyYears: z.number().optional(),
        qualityScore: z.string().optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        globalRating: z.string().optional(),
        reviewSummary: z.string().optional(),
        reviewSummarySinhala: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createBattery(input);
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        brandId: z.number().optional(),
        model: z.string().optional(),
        type: z.enum(["lithium", "lead-acid", "lfp", "agm"]).optional(),
        capacityKwh: z.string().optional(),
        voltage: z.number().optional(),
        cycleLife: z.number().optional(),
        depthOfDischarge: z.string().optional(),
        warrantyYears: z.number().optional(),
        qualityScore: z.string().optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        globalRating: z.string().optional(),
        reviewSummary: z.string().optional(),
        reviewSummarySinhala: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateBattery(id, data);
        return { success: true };
      }),
  }),

  // ============ SOLAR PACKAGES ============
  packages: router({
    list: publicProcedure
      .input(z.object({
        type: z.enum(["on-grid", "off-grid", "hybrid"]).optional(),
        minCapacity: z.number().optional(),
        maxCapacity: z.number().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        providerId: z.number().optional(),
        sortBy: z.enum(["roi", "quality", "price"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAllPackages(input);
      }),
    
    featured: publicProcedure.query(async () => {
      return db.getFeaturedPackages();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getPackageById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        providerId: z.number(),
        name: z.string(),
        nameSinhala: z.string().optional(),
        type: z.enum(["on-grid", "off-grid", "hybrid"]),
        systemCapacity: z.string(),
        panelId: z.number().optional(),
        panelCount: z.number().optional(),
        inverterId: z.number().optional(),
        batteryId: z.number().optional(),
        batteryCount: z.number().optional(),
        priceLKR: z.string(),
        installationIncluded: z.boolean().optional(),
        warrantyYears: z.number().optional(),
        description: z.string().optional(),
        descriptionSinhala: z.string().optional(),
        features: z.array(z.string()).optional(),
        featuresSinhala: z.array(z.string()).optional(),
        financingAvailable: z.boolean().optional(),
        financingDetails: z.string().optional(),
        estimatedMonthlyGeneration: z.string().optional(),
        roiYears: z.string().optional(),
        hardwareQualityScore: z.string().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createPackage(input);
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        providerId: z.number().optional(),
        name: z.string().optional(),
        nameSinhala: z.string().optional(),
        type: z.enum(["on-grid", "off-grid", "hybrid"]).optional(),
        systemCapacity: z.string().optional(),
        panelId: z.number().optional(),
        panelCount: z.number().optional(),
        inverterId: z.number().optional(),
        batteryId: z.number().optional(),
        batteryCount: z.number().optional(),
        priceLKR: z.string().optional(),
        installationIncluded: z.boolean().optional(),
        warrantyYears: z.number().optional(),
        description: z.string().optional(),
        descriptionSinhala: z.string().optional(),
        features: z.array(z.string()).optional(),
        featuresSinhala: z.array(z.string()).optional(),
        financingAvailable: z.boolean().optional(),
        financingDetails: z.string().optional(),
        estimatedMonthlyGeneration: z.string().optional(),
        roiYears: z.string().optional(),
        hardwareQualityScore: z.string().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePackage(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePackage(input.id);
        return { success: true };
      }),
  }),

  // ============ ROI CALCULATOR ============
  calculator: router({
    calculate: publicProcedure
      .input(z.object({
        monthlyBillLKR: z.number(),
        systemPriceLKR: z.number().optional(),
      }))
      .query(({ input }) => {
        const recommendation = db.getRecommendedSystemSize(input.monthlyBillLKR);
        const roi = input.systemPriceLKR 
          ? db.calculateROI(input.monthlyBillLKR, input.systemPriceLKR)
          : null;
        
        return {
          recommendation,
          roi,
        };
      }),
    
    getRecommendation: publicProcedure
      .input(z.object({ monthlyBillLKR: z.number() }))
      .query(({ input }) => {
        return db.getRecommendedSystemSize(input.monthlyBillLKR);
      }),
    
    calculateBill: publicProcedure
      .input(z.object({ units: z.number() }))
      .query(({ input }) => {
        return db.calculateBillFromUnits(input.units);
      }),
  }),

  // ============ CEB TARIFFS ============
  tariffs: router({
    list: publicProcedure
      .input(z.object({
        category: z.enum(["domestic", "religious", "industrial", "commercial"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getActiveTariffs(input?.category || 'domestic');
      }),
    
    create: adminProcedure
      .input(z.object({
        category: z.enum(["domestic", "religious", "industrial", "commercial"]),
        blockNumber: z.number(),
        minUnits: z.number(),
        maxUnits: z.number().optional(),
        energyChargeLKR: z.string(),
        fixedChargeLKR: z.string().optional(),
        effectiveFrom: z.date(),
        effectiveTo: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createTariff(input);
        return { id };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        category: z.enum(["domestic", "religious", "industrial", "commercial"]).optional(),
        blockNumber: z.number().optional(),
        minUnits: z.number().optional(),
        maxUnits: z.number().optional(),
        energyChargeLKR: z.string().optional(),
        fixedChargeLKR: z.string().optional(),
        effectiveFrom: z.date().optional(),
        effectiveTo: z.date().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateTariff(id, data);
        return { success: true };
      }),
  }),

  // ============ INQUIRIES ============
  inquiries: router({
    create: publicProcedure
      .input(z.object({
        packageId: z.number().optional(),
        name: z.string(),
        phone: z.string(),
        email: z.string().optional(),
        monthlyBillLKR: z.string().optional(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createInquiry({
          ...input,
          userId: ctx.user?.id,
        });
        return { id };
      }),
    
    list: adminProcedure.query(async () => {
      return db.getAllInquiries();
    }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "contacted", "converted", "closed"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateInquiryStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // ============ RAG CHATBOT ============
  chat: router({
    send: publicProcedure
      .input(z.object({
        message: z.string(),
        sessionId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const sessionId = input.sessionId || nanoid();
        
        // Save user message
        await db.saveChatMessage({
          sessionId,
          userId: ctx.user?.id,
          role: 'user',
          message: input.message,
        });
        
        // Get knowledge base for RAG
        const knowledge = await db.getKnowledgeBase();
        
        // Get chat history
        const history = await db.getChatHistory(sessionId, 10);
        const historyMessages = history.reverse().map(h => ({
          role: h.role as 'user' | 'assistant',
          content: h.message,
        }));
        
        // Build context from knowledge base
        const contextParts: string[] = [];
        
        // Add panel info
        if (knowledge.panels.length > 0) {
          contextParts.push("## Solar Panels Available:\n" + knowledge.panels.map(p => 
            `- ${p.brand?.name} ${p.panel.model}: ${p.panel.wattage}W, ${p.panel.efficiency}% efficiency, Quality Score: ${p.panel.qualityScore}/10. Pros: ${(p.panel.pros || []).join(', ')}. Cons: ${(p.panel.cons || []).join(', ')}`
          ).join('\n'));
        }
        
        // Add inverter info
        if (knowledge.inverters.length > 0) {
          contextParts.push("## Inverters Available:\n" + knowledge.inverters.map(i => 
            `- ${i.brand?.name} ${i.inverter.model}: ${i.inverter.capacity}kW ${i.inverter.type}, Quality Score: ${i.inverter.qualityScore}/10. Pros: ${(i.inverter.pros || []).join(', ')}. Cons: ${(i.inverter.cons || []).join(', ')}`
          ).join('\n'));
        }
        
        // Add package info
        if (knowledge.packages.length > 0) {
          contextParts.push("## Solar Packages:\n" + knowledge.packages.slice(0, 10).map(p => 
            `- ${p.provider?.name} ${p.package.name}: ${p.package.systemCapacity}kW ${p.package.type}, LKR ${Number(p.package.priceLKR).toLocaleString()}, ROI: ${p.package.roiYears} years, Quality: ${p.package.hardwareQualityScore}/10`
          ).join('\n'));
        }
        
        // Add CEB tariff info
        contextParts.push(`## CEB Tariff Rates (January 2025):
- 0-60 units: LKR 11/unit
- 61-90 units: LKR 14/unit + LKR 400 fixed
- 91-120 units: LKR 25/unit + LKR 1000 fixed
- 121-180 units: LKR 33/unit + LKR 1500 fixed
- Above 180 units: LKR 52/unit + LKR 2000 fixed

Low consumption (0-60 units total):
- 0-30 units: LKR 4/unit + LKR 75 fixed
- 31-60 units: LKR 6/unit + LKR 200 fixed

Average solar generation in Sri Lanka: ~130 kWh per 1kW installed per month.
System sizing formula: Monthly Units / 130 = Recommended kW`);
        
        const systemPrompt = `You are a helpful Electrical Engineer assistant for SolarWise LK, a solar energy marketplace in Sri Lanka. 

Your role:
1. Help users understand solar energy systems and their benefits
2. Calculate system sizing based on electricity bills using CEB tariff rates
3. Provide honest assessments of hardware quality (panels, inverters, batteries)
4. Compare packages and recommend based on ROI and quality
5. Answer questions about CEB tariffs and net metering

Language rules:
- Respond primarily in Sinhala (සිංහල) when the user writes in Sinhala
- Keep technical terms in English: Inverter, Units, Grid, Warranty, ROI, kW, kWh, Panel
- Be concise and helpful
- When calculating, show your work briefly

Current Knowledge Base:
${contextParts.join('\n\n')}

Remember: Be honest about pros AND cons of hardware. Don't oversell - help users make informed decisions.`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: 'system', content: systemPrompt },
              ...historyMessages,
              { role: 'user', content: input.message },
            ],
          });
          
          const rawContent = response.choices[0]?.message?.content;
          const assistantMessage = typeof rawContent === 'string' ? rawContent : 'Sorry, I could not process your request.';
          
          // Save assistant response
          await db.saveChatMessage({
            sessionId,
            userId: ctx.user?.id,
            role: 'assistant',
            message: assistantMessage,
          });
          
          return {
            sessionId,
            message: assistantMessage,
          };
        } catch (error) {
          console.error('Chat error:', error);
          return {
            sessionId,
            message: 'Sorry, there was an error processing your request. Please try again.',
          };
        }
      }),
    
    history: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const history = await db.getChatHistory(input.sessionId, 50);
        return history.reverse();
      }),
  }),

  // ============ REVIEWS ============
  reviews: router({
    // Create a new review (requires authentication)
    create: protectedProcedure
      .input(z.object({
        packageId: z.number().optional(),
        providerId: z.number().optional(),
        overallRating: z.number().min(1).max(5),
        installationRating: z.number().min(1).max(5).optional(),
        performanceRating: z.number().min(1).max(5).optional(),
        supportRating: z.number().min(1).max(5).optional(),
        valueRating: z.number().min(1).max(5).optional(),
        title: z.string().min(5).max(255),
        content: z.string().min(20).max(5000),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        installationDate: z.date().optional(),
        systemSize: z.string().optional(),
        monthlyGeneration: z.string().optional(),
        previousBill: z.string().optional(),
        currentBill: z.string().optional(),
        photos: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createReview({
          ...input,
          userId: ctx.user.id,
          status: 'pending',
        });
        return { id };
      }),
    
    // Get reviews for a package
    byPackage: publicProcedure
      .input(z.object({ packageId: z.number() }))
      .query(async ({ input }) => {
        const [reviewsList, avgRating] = await Promise.all([
          db.getReviewsByPackage(input.packageId),
          db.getPackageAverageRating(input.packageId),
        ]);
        return { reviews: reviewsList, averageRating: avgRating };
      }),
    
    // Get reviews for a provider
    byProvider: publicProcedure
      .input(z.object({ providerId: z.number() }))
      .query(async ({ input }) => {
        const [reviewsList, avgRating] = await Promise.all([
          db.getReviewsByProvider(input.providerId),
          db.getProviderAverageRating(input.providerId),
        ]);
        return { reviews: reviewsList, averageRating: avgRating };
      }),
    
    // Get user's own reviews
    myReviews: protectedProcedure.query(async ({ ctx }) => {
      return db.getReviewsByUser(ctx.user.id);
    }),
    
    // Get single review by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getReviewById(input.id);
      }),
    
    // Vote on a review (helpful/not helpful)
    vote: protectedProcedure
      .input(z.object({
        reviewId: z.number(),
        isHelpful: z.boolean(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.voteReview(input.reviewId, ctx.user.id, input.isHelpful);
        return { success: true };
      }),
    
    // Get user's vote for a review
    myVote: protectedProcedure
      .input(z.object({ reviewId: z.number() }))
      .query(async ({ input, ctx }) => {
        return db.getUserVoteForReview(input.reviewId, ctx.user.id);
      }),
    
    // Update own review
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        overallRating: z.number().min(1).max(5).optional(),
        installationRating: z.number().min(1).max(5).optional(),
        performanceRating: z.number().min(1).max(5).optional(),
        supportRating: z.number().min(1).max(5).optional(),
        valueRating: z.number().min(1).max(5).optional(),
        title: z.string().min(5).max(255).optional(),
        content: z.string().min(20).max(5000).optional(),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        photos: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const review = await db.getReviewById(input.id);
        if (!review) throw new TRPCError({ code: 'NOT_FOUND' });
        if (review.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        
        const { id, ...data } = input;
        // Reset to pending if content changed
        if (data.title || data.content) {
          await db.updateReview(id, { ...data, status: 'pending' });
        } else {
          await db.updateReview(id, data);
        }
        return { success: true };
      }),
    
    // Delete own review
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const review = await db.getReviewById(input.id);
        if (!review) throw new TRPCError({ code: 'NOT_FOUND' });
        if (review.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        await db.deleteReview(input.id);
        return { success: true };
      }),
    
    // Admin: List all reviews with details
    listAll: adminProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getReviewsWithDetails(input?.status);
      }),
    
    // Admin: Moderate review
    moderate: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['approved', 'rejected']),
        moderatorNote: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateReviewStatus(input.id, input.status, input.moderatorNote);
        return { success: true };
      }),
    
    // Admin: Verify review
    verify: adminProcedure
      .input(z.object({
        id: z.number(),
        isVerified: z.boolean(),
        verificationNote: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateReview(input.id, {
          isVerified: input.isVerified,
          verificationNote: input.verificationNote,
        });
        return { success: true };
      }),
    
    // Get review statistics
    stats: adminProcedure.query(async () => {
      return db.getReviewStats();
    }),
  }),

  // ============ ADMIN STATS ============
  admin: router({
    stats: adminProcedure.query(async () => {
      const [providers, packages, inquiries, panels, inverters, reviewStats] = await Promise.all([
        db.getAllProviders(),
        db.getAllPackages(),
        db.getAllInquiries(),
        db.getAllPanels(),
        db.getAllInverters(),
        db.getReviewStats(),
      ]);
      
      return {
        totalProviders: providers.length,
        totalPackages: packages.length,
        totalInquiries: inquiries.length,
        pendingInquiries: inquiries.filter(i => i.status === 'pending').length,
        totalPanels: panels.length,
        totalInverters: inverters.length,
        totalReviews: reviewStats.total,
        pendingReviews: reviewStats.pending,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
