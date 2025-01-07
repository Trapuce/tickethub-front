import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { DURATIONS, TICKET_STATUS, WAITING_LIST_STATUS } from "./constants";
import { internal } from "./_generated/api";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("events")
            .filter((q) => q.eq(q.field("is_cancelled"), undefined))
            .collect();
    },
});

export const getById = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, { eventId }) => {
        return await ctx.db.get(eventId);
    },
});

export const getEventAvailability = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, { eventId }) => {
        const event = await ctx.db.get(eventId);

        if (!event) throw new Error("Event not found");

        // Fetch purchased tickets
        const purchased = await ctx.db
            .query("tickets")
            .withIndex("by_event", (q) => q.eq("eventId", eventId))
            .collect()
            .then((tickets) =>
                tickets.filter(
                    (t) =>
                        t.status === TICKET_STATUS.VALID ||
                        t.status === TICKET_STATUS.USED
                )
            );

        // Count valid offers
        const validOffersCount = await ctx.db
            .query("waitingList")
            .withIndex("by_event_status", (q) =>
                q.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.OFFERED)
            )
            .collect()
            .then((offers) =>
                offers.filter((o) => (o.offerExpiresAt ?? 0) > Date.now()).length
            );

        // Calculate total reserved tickets
        const totalReserved = purchased.length + validOffersCount;

        return {
            isSoldout: totalReserved >= event.totalTickets,
            totalTickets: event.totalTickets,
            purchasedCount: purchased.length,
            validOffersCount,
            remainingTickets: Math.max(0, event.totalTickets - totalReserved),
        };
    },
});

// Check event availability
/*export const checkAvailability = async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");

    // Count purchased tickets
    const purchasedCount = await ctx.db
        .query("tickets")
        .withIndex("by_events", (q) => q.eq("eventId", eventId))
        .collect()
        .then((tickets) =>
            tickets.filter(
                (t) =>
                    t.status === TICKET_STATUS.VALID ||
                    t.status === TICKET_STATUS.USED
            ).length
        );

    const now = Date.now();

    // Count valid offers in the waiting list
    const validOffersCount = await ctx.db
        .query("waitingList")
        .withIndex("by_event_status", (q) =>
            q.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.OFFERED)
        )
        .collect()
        .then((entries) => entries.filter((e) => (e.offerExpiresAt ?? 0) > now).length);

    const availableSpots = event.totalTickets - (purchasedCount + validOffersCount);

    return {
        available: availableSpots > 0,
        availableSpots,
        totalTickets: event.totalTickets,
        purchasedCount,
        validOffersCount,
    };
};

// Join waiting list
export const joinWaitingList = mutation({
    args: {
        eventId: v.id("events"),
        userId: v.string(),
    },
    handler: async (ctx, { eventId, userId }) => {
        // Rate limiter check
        const status = await rateLimiter.limit(ctx, "queueJoin", { key: userId });
        if (!status) {
            const retryAfterMinutes = Math.ceil(status.retryAfter / (60 * 1000));
            throw new ConvexError(
                `You have joined the waiting list too many times. Please wait ${retryAfterMinutes} minutes before trying again.`
            );
        }

        // Check if user is already in the waiting list for this event
        const existingEntry = await ctx.db
            .query("waitingList")
            .withIndex("by_user_event", (q) =>
                q.eq("userId", userId).eq("eventId", eventId)
            )
            .filter((q) => q.neq(q.field("status"), WAITING_LIST_STATUS.EXPIRED))
            .first();

        if (existingEntry) {
            throw new Error("You are already in the waiting list for this event.");
        }

        // Validate event existence
        const event = await ctx.db.get(eventId);
        if (!event) throw new Error("Event not found.");

        // Check event availability
        const { available } = await checkAvailability(ctx, { eventId });

        if (available) {
            const now = Date.now();

            // Add user to the waiting list with an offer
            const waitingListEntry = await ctx.db.insert("waitingList", {
                eventId,
                userId,
                status: WAITING_LIST_STATUS.OFFERED,
                offerExpiresAt: now + DURATIONS.TICKET_OFFER,
            });

            // Schedule offer expiration
            await ctx.scheduler.runAfter(
                DURATIONS.TICKET_OFFER,
                internal.waitingList.expireOffer,
                {
                    waitingList: waitingListEntry,
                    eventId,
                }
            );
        } else {
            // Handle case where no spots are available
            throw new Error("No spots available in the waiting list for this event.");
        }
    },
});*/
