import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Tickets } from "lucide-react";
import { Amarante } from "next/font/google";

export default defineSchema({
    events: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        price: v.number(),
        totalTickets: v.number(),
        location: v.string(),
        eventDate: v.number(),
        userId: v.string(),
        imageStorageId: v.optional(v.id("_storage")),
        is_cancelled: v.optional(v.boolean())
    }),

    tickets: defineTable({
        eventId: v.id("events"),
        userId: v.string(),
        purchaseAt: v.number(),
        status: v.union(
            v.literal("valid"),
            v.literal("used"),
            v.literal("refunded"),
            v.literal("canacelled")
        ),
        paymentIntentId: v.optional(v.string()),
        amount: v.optional(v.number())
    })
        .index("by_event", ["eventId"])
        .index("by_user", ["userId"])
        .index("by_user_event", ["userId", "eventId"])
        .index("by_payment_intent", ["paymentIntentId"]),



    waitingList: defineTable({
        eventId: v.id("events"),
        userId: v.string(),
        status: v.union(
            v.literal("waiting"),
            v.literal("offered"),
            v.literal("purchased"),
            v.literal("expired")

        ),
        offerExpiresAt: v.optional(v.number())
    })
        .index("by_user_event", ["userId", "eventId"])
        .index("by_user", ["userId"])
        .index("by_event_status", ["eventId", "status"]),

    users: defineTable({
        name: v.string(),
        email: v.string(),
        userId: v.string(),
        stripeConnectedId: v.optional(v.string())
    })
        .index("by_email", ["email"])
        .index("by_userId", ["userId"])


});