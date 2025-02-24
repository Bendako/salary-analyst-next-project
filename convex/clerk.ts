import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createClerkUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('🚨 CRITICAL: Clerk User Creation Mutation Called', {
      email: args.email,
      name: args.name,
      clerkId: args.clerkId,
      imageUrl: args.imageUrl ? 'Present' : 'Not provided'
    });

    try {
      // Extensive input validation
      if (!args.email) {
        console.error('❌ CRITICAL: No email provided');
        throw new Error('Email is required');
      }
      if (!args.name) {
        console.error('❌ CRITICAL: No name provided');
        throw new Error('Name is required');
      }
      if (!args.clerkId) {
        console.error('❌ CRITICAL: No Clerk ID provided');
        throw new Error('Clerk ID is required');
      }

      // Log database query details
      console.log('🔍 Querying users table', {
        filterField: 'clerkId',
        filterValue: args.clerkId
      });

      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
        .first();

      if (existingUser) {
        console.log('🔄 EXISTING USER FOUND:', {
          existingUserId: existingUser._id,
          existingEmail: existingUser.email
        });
        
        // Update existing user
        await ctx.db.patch(existingUser._id, {
          name: args.name,
          email: args.email,
          imageUrl: args.imageUrl,
        });

        console.log('✅ User updated successfully');
        return existingUser._id;
      }

      // Create new user
      console.log('🆕 ATTEMPTING TO CREATE NEW USER');
      const newUserId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        clerkId: args.clerkId,
        createdAt: Date.now(),
      });

      console.log('✨ NEW USER CREATED SUCCESSFULLY:', {
        userId: newUserId,
        email: args.email
      });
      return newUserId;

    } catch (error) {
      console.error('❌ CRITICAL ERROR in createClerkUser mutation:', {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : 'No stack trace',
        userDetails: {
          email: args.email,
          name: args.name,
          clerkId: args.clerkId
        }
      });
      throw error; // Re-throw to ensure error is propagated
    }
  },
});
