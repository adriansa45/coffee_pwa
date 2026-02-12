import { relations } from "drizzle-orm";
import { index, numeric, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { coffee_shops, tags } from "./payload-generated-schema";

export const visits = pgTable("visits", {
    id: varchar("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    shopId: varchar("shop_id")
        .notNull()
        .references(() => coffee_shops.id, { onDelete: "cascade" }),
    visitedAt: timestamp("visited_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
}, (table) => [
    index("visits_user_idx").on(table.userId),
    index("visits_shop_idx").on(table.shopId),
]);

export const reviews = pgTable("reviews", {
    id: varchar("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    shopId: varchar("shop_id")
        .notNull()
        .references(() => coffee_shops.id, { onDelete: "cascade" }),
    rating: varchar("rating").notNull(),
    coffeeRating: numeric("coffee_rating", { precision: 2, scale: 1 }).default("0"),
    foodRating: numeric("food_rating", { precision: 2, scale: 1 }).default("0"),
    placeRating: numeric("place_rating", { precision: 2, scale: 1 }).default("0"),
    priceRating: numeric("price_rating", { precision: 2, scale: 1 }).default("0"),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
}, (table) => [
    index("reviews_user_idx").on(table.userId),
    index("reviews_shop_idx").on(table.shopId),
]);

export const reviewTags = pgTable("review_tags", {
    reviewId: varchar("review_id")
        .notNull()
        .references(() => reviews.id, { onDelete: "cascade" }),
    tagId: varchar("tag_id")
        .notNull()
        .references(() => tags.id, { onDelete: "cascade" }),
}, (table) => [
    index("review_tags_review_idx").on(table.reviewId),
    index("review_tags_tag_idx").on(table.tagId),
]);

export const follows = pgTable("follows", {
    followerId: text("follower_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    followingId: text("following_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
}, (table) => [
    index("follower_idx").on(table.followerId),
    index("following_idx").on(table.followingId),
]);

export const shopFollows = pgTable("shop_follows", {
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    shopId: varchar("shop_id")
        .notNull()
        .references(() => coffee_shops.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
}, (table) => [
    index("shop_follows_user_idx").on(table.userId),
    index("shop_follows_shop_idx").on(table.shopId),
]);

export const reviewLikes = pgTable("review_likes", {
    id: varchar("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    reviewId: varchar("review_id")
        .notNull()
        .references(() => reviews.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
}, (table) => [
    index("review_likes_user_idx").on(table.userId),
    index("review_likes_review_idx").on(table.reviewId),
]);

export const visitsRelations = relations(visits, ({ one }) => ({
    user: one(user, {
        fields: [visits.userId],
        references: [user.id],
    }),
    shop: one(coffee_shops, {
        fields: [visits.shopId],
        references: [coffee_shops.id],
    }),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
    user: one(user, {
        fields: [reviews.userId],
        references: [user.id],
    }),
    shop: one(coffee_shops, {
        fields: [reviews.shopId],
        references: [coffee_shops.id],
    }),
    reviewTags: many(reviewTags),
    likes: many(reviewLikes),
}));

export const reviewTagsRelations = relations(reviewTags, ({ one }) => ({
    review: one(reviews, {
        fields: [reviewTags.reviewId],
        references: [reviews.id],
    }),
    tag: one(tags, {
        fields: [reviewTags.tagId],
        references: [tags.id],
    }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
    follower: one(user, {
        fields: [follows.followerId],
        references: [user.id],
        relationName: "following",
    }),
    following: one(user, {
        fields: [follows.followingId],
        references: [user.id],
        relationName: "followedBy",
    }),
}));

export const userSocialRelations = relations(user, ({ many }) => ({
    following: many(follows, { relationName: "following" }),
    followers: many(follows, { relationName: "followedBy" }),
    shopFollows: many(shopFollows),
    reviewLikes: many(reviewLikes),
}));

export const reviewLikesRelations = relations(reviewLikes, ({ one }) => ({
    user: one(user, {
        fields: [reviewLikes.userId],
        references: [user.id],
    }),
    review: one(reviews, {
        fields: [reviewLikes.reviewId],
        references: [reviews.id],
    }),
}));

export const shopFollowsRelations = relations(shopFollows, ({ one }) => ({
    user: one(user, {
        fields: [shopFollows.userId],
        references: [user.id],
    }),
    shop: one(coffee_shops, {
        fields: [shopFollows.shopId],
        references: [coffee_shops.id],
    }),
}));
