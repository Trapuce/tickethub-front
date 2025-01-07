import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return user;
  }
});

export const updateUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string()
  },
  handler: async (ctx, { userId, name, email }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingUser) {
      // Mettre à jour l'utilisateur existant
      return await ctx.db.patch(existingUser._id, {
        name,
        email
      });
      return existingUser?._id ;
    } 
      // Créer un nouvel utilisateur


      const newUserId =  await ctx.db.insert("users", {
        userId,
        name,
        email,
        stripeConnectedId: undefined
        
      });
      return newUserId ;
    }
  
});