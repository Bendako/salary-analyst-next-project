import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { QueryCtx, MutationCtx } from "./_generated/server";

export const addIncomeEntry = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    date: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx: MutationCtx, args: {
    userId: Id<"users">;
    amount: number;
    date: string;
    category: string;
    description?: string;
  }) => {
    return await ctx.db.insert("incomeEntries", {
      userId: args.userId,
      amount: args.amount,
      date: args.date,
      category: args.category,
      description: args.description,
    });
  },
});

export const getIncomeEntriesForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx: QueryCtx, args: { userId: Id<"users"> }) => {
    return await ctx.db
      .query("incomeEntries")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const getTotalIncomeByCategory = query({
  args: { userId: v.id("users") },
  handler: async (ctx: QueryCtx, args: { userId: Id<"users"> }) => {
    const entries = await ctx.db
      .query("incomeEntries")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const categoryTotals: Record<string, number> = entries.reduce((acc: Record<string, number>, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
      return acc;
    }, {});

    return categoryTotals;
  },
});
