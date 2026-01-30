import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, uuid, doublePrecision, primaryKey } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: text("role").default("customer").notNull(), //$type<"customer" | "admin" | "coffee_shop">(),
    userCode: text("user_code").unique().$defaultFn(() => Math.random().toString(36).substring(2, 10).toUpperCase()),
    shopId: text("shop_id").references(() => coffeeShops.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const coffeeShops = pgTable("coffee_shops", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    address: text("address"),
    googleMapsUrl: text("google_maps_url"),
    rating: doublePrecision("rating").default(0), // Cached average rating
    createdAt: timestamp("created_at").defaultNow(),
});

export const visits = pgTable("visits", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id),
    shopId: text("shop_id").notNull().references(() => coffeeShops.id),
    visitedAt: timestamp("visited_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id),
    shopId: text("shop_id").notNull().references(() => coffeeShops.id),
    rating: text("rating").notNull(), // Numeric string or int, let's use doublePrecision for flexibility or integer
    coffeeRating: doublePrecision("coffee_rating").default(0),
    foodRating: doublePrecision("food_rating").default(0),
    placeRating: doublePrecision("place_rating").default(0),
    priceRating: doublePrecision("price_rating").default(0),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tags = pgTable("tags", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
});

export const reviewsTags = pgTable("reviews_tags", {
    reviewId: text("review_id").notNull().references(() => reviews.id, { onDelete: 'cascade' }),
    tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => [
    primaryKey({ columns: [t.reviewId, t.tagId] })
]);

export const coffeeShopsRelations = relations(coffeeShops, ({ many }) => ({
    visits: many(visits),
    reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
    user: one(user, {
        fields: [reviews.userId],
        references: [user.id],
    }),
    shop: one(coffeeShops, {
        fields: [reviews.shopId],
        references: [coffeeShops.id],
    }),
    tags: many(reviewsTags),
}));

export const visitsRelations = relations(visits, ({ one }) => ({
    user: one(user, {
        fields: [visits.userId],
        references: [user.id],
    }),
    shop: one(coffeeShops, {
        fields: [visits.shopId],
        references: [coffeeShops.id],
    }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
    reviews: many(reviewsTags),
}));

export const reviewsTagsRelations = relations(reviewsTags, ({ one }) => ({
    review: one(reviews, {
        fields: [reviewsTags.reviewId],
        references: [reviews.id],
    }),
    tag: one(tags, {
        fields: [reviewsTags.tagId],
        references: [tags.id],
    }),
}));
