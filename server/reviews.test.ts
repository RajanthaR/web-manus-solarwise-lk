import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  createReview: vi.fn().mockResolvedValue(1),
  getReviewById: vi.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    packageId: 1,
    overallRating: 5,
    title: "Great solar system",
    content: "This is a wonderful solar installation experience",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getReviewsByPackage: vi.fn().mockResolvedValue([
    {
      id: 1,
      userId: 1,
      packageId: 1,
      overallRating: 5,
      title: "Great solar system",
      content: "This is a wonderful solar installation experience",
      status: "approved",
      createdAt: new Date(),
    },
  ]),
  getReviewsByProvider: vi.fn().mockResolvedValue([]),
  getReviewsByUser: vi.fn().mockResolvedValue([]),
  getPackageAverageRating: vi.fn().mockResolvedValue({
    overall: 4.5,
    installation: 4.0,
    performance: 5.0,
    support: 4.0,
    value: 4.5,
    totalReviews: 10,
  }),
  getProviderAverageRating: vi.fn().mockResolvedValue(null),
  updateReview: vi.fn().mockResolvedValue(undefined),
  updateReviewStatus: vi.fn().mockResolvedValue(undefined),
  deleteReview: vi.fn().mockResolvedValue(undefined),
  voteReview: vi.fn().mockResolvedValue(undefined),
  getUserVoteForReview: vi.fn().mockResolvedValue(null),
  getReviewsWithDetails: vi.fn().mockResolvedValue([]),
  getReviewStats: vi.fn().mockResolvedValue({
    total: 10,
    pending: 2,
    approved: 7,
    rejected: 1,
  }),
}));

type CookieCall = {
  name: string;
  options: Record<string, unknown>;
};

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "user"): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

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

describe("reviews.byPackage", () => {
  it("returns reviews and average rating for a package", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.byPackage({ packageId: 1 });

    expect(result).toHaveProperty("reviews");
    expect(result).toHaveProperty("averageRating");
    expect(Array.isArray(result.reviews)).toBe(true);
  });
});

describe("reviews.byProvider", () => {
  it("returns reviews and average rating for a provider", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.byProvider({ providerId: 1 });

    expect(result).toHaveProperty("reviews");
    expect(result).toHaveProperty("averageRating");
    expect(Array.isArray(result.reviews)).toBe(true);
  });
});

describe("reviews.create", () => {
  it("creates a new review for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.create({
      packageId: 1,
      overallRating: 5,
      title: "Excellent solar system",
      content: "The installation was smooth and the system performs great!",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });

  it("requires authentication to create a review", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reviews.create({
        packageId: 1,
        overallRating: 5,
        title: "Test review",
        content: "This is a test review content",
      })
    ).rejects.toThrow();
  });

  it("validates minimum title length", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reviews.create({
        packageId: 1,
        overallRating: 5,
        title: "Hi", // Too short
        content: "This is a valid content that is long enough",
      })
    ).rejects.toThrow();
  });

  it("validates minimum content length", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reviews.create({
        packageId: 1,
        overallRating: 5,
        title: "Valid title here",
        content: "Too short", // Too short
      })
    ).rejects.toThrow();
  });

  it("validates rating range", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reviews.create({
        packageId: 1,
        overallRating: 6, // Invalid - max is 5
        title: "Valid title here",
        content: "This is a valid content that is long enough",
      })
    ).rejects.toThrow();
  });
});

describe("reviews.vote", () => {
  it("allows authenticated user to vote on a review", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.vote({
      reviewId: 1,
      isHelpful: true,
    });

    expect(result).toEqual({ success: true });
  });

  it("requires authentication to vote", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reviews.vote({
        reviewId: 1,
        isHelpful: true,
      })
    ).rejects.toThrow();
  });
});

describe("reviews.myReviews", () => {
  it("returns user's own reviews", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.myReviews();

    expect(Array.isArray(result)).toBe(true);
  });

  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.reviews.myReviews()).rejects.toThrow();
  });
});

describe("reviews.stats (admin)", () => {
  it("returns review statistics for admin", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.stats();

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("pending");
    expect(result).toHaveProperty("approved");
    expect(result).toHaveProperty("rejected");
  });

  it("denies access to non-admin users", async () => {
    const { ctx } = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.reviews.stats()).rejects.toThrow();
  });
});

describe("reviews.moderate (admin)", () => {
  it("allows admin to approve a review", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.moderate({
      id: 1,
      status: "approved",
    });

    expect(result).toEqual({ success: true });
  });

  it("allows admin to reject a review with note", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.moderate({
      id: 1,
      status: "rejected",
      moderatorNote: "Contains inappropriate content",
    });

    expect(result).toEqual({ success: true });
  });

  it("denies access to non-admin users", async () => {
    const { ctx } = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reviews.moderate({
        id: 1,
        status: "approved",
      })
    ).rejects.toThrow();
  });
});

describe("reviews.verify (admin)", () => {
  it("allows admin to verify a review", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.verify({
      id: 1,
      isVerified: true,
      verificationNote: "Verified purchase confirmed",
    });

    expect(result).toEqual({ success: true });
  });

  it("denies access to non-admin users", async () => {
    const { ctx } = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reviews.verify({
        id: 1,
        isVerified: true,
      })
    ).rejects.toThrow();
  });
});
