import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    profileImageUrl: v.optional(v.string()),
  }),
  
  incomeEntries: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    date: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
  }).index("by_user", ["userId"]),
  
  financialGoals: defineTable({
    userId: v.id("users"),
    title: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    deadline: v.string(),
  }).index("by_user", ["userId"])
});
