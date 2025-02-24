import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTestUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('🧪 Creating test user:', args);
    
    try {
      const userId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        clerkId: `test_${Date.now()}`, // Temporary mock Clerk ID
        createdAt: Date.now(),
      });

      console.log('✨ Test user created successfully:', userId);
      return userId;
    } catch (error) {
      console.error('❌ Failed to create test user:', error);
      throw error;
    }
  },
});

export const getTestUsers = query({
  args: {},
  handler: async (ctx) => {
    try {
      const users = await ctx.db.query("users").collect();
      console.log('📋 Retrieved test users:', users.length);
      return users;
    } catch (error) {
      console.error('❌ Failed to retrieve test users:', error);
      throw error;
    }
  },
});

export const saveClerkUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log('🔐 Saving Clerk User:', {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
    });

    try {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
        .first();

      if (existingUser) {
        console.log('🔄 Updating existing user:', existingUser._id);
        
        // Update existing user
        await ctx.db.patch(existingUser._id, {
          name: args.name,
          email: args.email,
          imageUrl: args.imageUrl,
          firstName: args.firstName,
          lastName: args.lastName,
        });

        return existingUser._id;
      }

      // Create new user
      const newUserId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        firstName: args.firstName,
        lastName: args.lastName,
        createdAt: Date.now(),
      });

      console.log('✨ New Clerk user saved:', newUserId);
      return newUserId;

    } catch (error) {
      console.error('❌ Error saving Clerk user:', error);
      throw error;
    }
  },
});

export const getCurrentClerkUser = query({
  args: {},
  handler: async (ctx) => {
    // Get the identity of the authenticated user
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      // No user is signed in
      return null;
    }

    // Retrieve the user based on the Clerk ID from the identity
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    return user;
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
