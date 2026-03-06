import { relations } from "drizzle-orm";
import { boolean, index, numeric, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
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
    staffId: text("staff_id").references(() => user.id),
    method: varchar("method").notNull().default("qr_scan"),
    fraudMetadata: text("fraud_metadata"),
}, (table) => [
    index("visits_user_idx").on(table.userId),
    index("visits_shop_idx").on(table.shopId),
    index("visits_staff_idx").on(table.staffId),
]);

export const rewards = pgTable("rewards", {
    id: varchar("id").primaryKey(),
    shopId: varchar("shop_id")
        .notNull()
        .references(() => coffee_shops.id, { onDelete: "cascade" }),
    name: varchar("name").notNull(),
    description: text("description"),
    visitsRequired: numeric("visits_required").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
}, (table) => [
    index("rewards_shop_idx").on(table.shopId),
]);

export const unlockedRewards = pgTable("unlocked_rewards", {
    id: varchar("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    rewardId: varchar("reward_id")
        .notNull()
        .references(() => rewards.id, { onDelete: "cascade" }),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
    redeemedAt: timestamp("redeemed_at", { withTimezone: true, precision: 3 }),
}, (table) => [
    index("unlocked_rewards_user_idx").on(table.userId),
    index("unlocked_rewards_reward_idx").on(table.rewardId),
]);

export const badges = pgTable("badges", {
    id: varchar("id").primaryKey(),
    shopId: varchar("shop_id")
        .notNull()
        .references(() => coffee_shops.id, { onDelete: "cascade" }),
    name: varchar("name").notNull(),
    description: text("description"),
    criteria: varchar("criteria").notNull(), // e.g., "visits_count"
    criteriaValue: numeric("criteria_value").notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
}, (table) => [
    index("badges_shop_idx").on(table.shopId),
]);

export const userBadges = pgTable("user_badges", {
    id: varchar("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    badgeId: varchar("badge_id")
        .notNull()
        .references(() => badges.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at", { withTimezone: true, precision: 3 })
        .defaultNow()
        .notNull(),
}, (table) => [
    index("user_badges_user_idx").on(table.userId),
    index("user_badges_badge_idx").on(table.badgeId),
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

export const rewardsRelations = relations(rewards, ({ one, many }) => ({
    shop: one(coffee_shops, {
        fields: [rewards.shopId],
        references: [coffee_shops.id],
    }),
    unlockedBy: many(unlockedRewards),
}));

export const unlockedRewardsRelations = relations(unlockedRewards, ({ one }) => ({
    user: one(user, {
        fields: [unlockedRewards.userId],
        references: [user.id],
    }),
    reward: one(rewards, {
        fields: [unlockedRewards.rewardId],
        references: [rewards.id],
    }),
}));

export const badgesRelations = relations(badges, ({ one, many }) => ({
    shop: one(coffee_shops, {
        fields: [badges.shopId],
        references: [coffee_shops.id],
    }),
    earnedBy: many(userBadges),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
    user: one(user, {
        fields: [userBadges.userId],
        references: [user.id],
    }),
    badge: one(badges, {
        fields: [userBadges.badgeId],
        references: [badges.id],
    }),
}));
