import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { WAITING_LIST_STATUS } from "./constants";

export const getQueuePosition = query({
    args: {
        eventId: v.id("events"),
        userId: v.string()
    },
    handler: async (ctx, { eventId, userId }) => {
        // Find the user's waiting list entry
        const entry = await ctx.db
            .query("waitingList")
            .withIndex("by_user_event", (q) =>
                q.eq("userId", userId).eq("eventId", eventId)
            )
            .filter((q) => q.neq(q.field("status"), WAITING_LIST_STATUS.EXPIRED))
            .first();

        if (!entry) return null;

        // Count the number of people ahead in the queue
        const peopleAhead = await ctx.db
            .query("waitingList")
            .filter((q) =>
                q.and(
                    q.lt(q.field("_creationTime"), entry._creationTime),
                    q.or(
                        q.eq(q.field("status"), WAITING_LIST_STATUS.WAITING),
                        q.eq(q.field("status"), WAITING_LIST_STATUS.OFFERED)
                    )
                )
            )
            .collect()
            .then((entries) => entries.length);

        // Return the user's entry with their position in the queue
        return {
            ...entry,
            position: peopleAhead + 1
        };
    },
});


export const releaseTicket = mutation({
    args: {
      eventId: v.id('events'),
      waitingListId: v.id('waitingList'),
    },
    handler: async (ctx, { eventId, waitingListId }) => {
      // Fetch the waiting list entry
      const entry = await ctx.db.get(waitingListId);
  
      // Validate the ticket offer
      if (!entry || entry.status !== WAITING_LIST_STATUS.OFFERED) {
        throw new Error('No valid ticket offer found');
      }
  
      // Expire the ticket offer
      await ctx.db.patch(waitingListId, {
        status: WAITING_LIST_STATUS.EXPIRED,
      });
  
      // Optionally process the waiting list queue
      // await processQueue(ctx, { eventId });
    },
  });
  