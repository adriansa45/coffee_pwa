export const CACHE_TAGS = {
    COFFEE_SHOPS: "coffee-shops",
    REVIEWS: "reviews",
    VISITS: "visits",
    FOLLOWS: "follows",
} as const;

export const getShopTag = (id: string) => `shop-${id}`;
export const getShopReviewsTag = (id: string) => `shop-reviews-${id}`;
export const getUserVisitsTag = (userId: string) => `user-visits-${userId}`;
export const getUserFollowsTag = (userId: string) => `user-follows-${userId}`;
