import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    clerkId: v.string(),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
      });
      return existingUser._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      clerkId: args.clerkId,
      createdAt: args.createdAt || Date.now(),
    });
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
  },
});

export const manualCreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log('🚨 MANUAL USER CREATION ATTEMPT:', {
      name: args.name,
      email: args.email,
      clerkId: args.clerkId,
      imageUrl: args.imageUrl
    });

    try {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
        .first();

      if (existingUser) {
        console.log('🔄 Existing user found. Skipping creation.');
        return existingUser._id;
      }

      // Create new user
      const newUserId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        clerkId: args.clerkId,
        imageUrl: args.imageUrl,
        createdAt: Date.now(),
      });

      console.log('✨ Manual user creation successful:', newUserId);
      return newUserId;
    } catch (error) {
      console.error('❌ Manual user creation failed:', error);
      throw error;
    }
  },
});

export const listAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    console.log('📋 Total users:', users.length);
    return users;
  },
});
