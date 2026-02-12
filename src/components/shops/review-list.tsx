"use client";

import { toggleReviewLike } from "@/actions/reviews";
import { StarRating } from "@/components/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { CircleDollarSign, Coffee, Heart, Map, Utensils } from "lucide-react";
import { useState } from "react";

interface Review {
    id: string;
    userImage?: string | null;
    userName?: string | null;
    rating: string | number;
    coffeeRating: number;
    foodRating: number;
    placeRating: number;
    priceRating: number;
    comment?: string | null;
    createdAt: string;
    likeCount: number;
    isLiked: boolean;
}

export function ReviewList({ initialReviews, shopId }: { initialReviews: Review[], shopId: string }) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const { data: session } = authClient.useSession();

    const handleToggleLike = async (reviewId: string) => {
        if (!session) return;

        // Optimistic update
        setReviews(prev => prev.map(rev => {
            if (rev.id === reviewId) {
                return {
                    ...rev,
                    isLiked: !rev.isLiked,
                    likeCount: rev.isLiked ? rev.likeCount - 1 : rev.likeCount + 1
                };
            }
            return rev;
        }));

        try {
            const res = await toggleReviewLike(reviewId);
            if (!res.success) {
                // Rollback if failed
                setReviews(prev => prev.map(rev => {
                    if (rev.id === reviewId) {
                        return {
                            ...rev,
                            isLiked: !rev.isLiked,
                            likeCount: rev.isLiked ? rev.likeCount - 1 : rev.likeCount + 1
                        };
                    }
                    return rev;
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/10">
                <p className="text-sm text-foreground/40 font-medium">Sé el primero en compartir tu experiencia</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-[28px] border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm font-bold text-xs uppercase">
                                <AvatarImage src={rev.userImage || ""} />
                                <AvatarFallback className="bg-primary/5 text-primary/90">
                                    {rev.userName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-foreground">{rev.userName}</p>
                                <p className="text-[10px] text-primary/40 font-bold uppercase tracking-wider">Explorador</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg">
                            <StarRating rating={Number(rev.rating)} size={10} />
                        </div>
                    </div>

                    {/* Category Ratings Display as Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {rev.coffeeRating > 0 && (
                            <div className="flex items-center gap-1 bg-amber-50 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-100 text-amber-700">
                                <Coffee size={10} />
                                <span>{rev.coffeeRating.toFixed(1)}</span>
                            </div>
                        )}
                        {rev.foodRating > 0 && (
                            <div className="flex items-center gap-1 bg-orange-50 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-orange-100 text-orange-600">
                                <Utensils size={10} />
                                <span>{rev.foodRating.toFixed(1)}</span>
                            </div>
                        )}
                        {rev.placeRating > 0 && (
                            <div className="flex items-center gap-1 bg-blue-50 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-blue-100 text-blue-600">
                                <Map size={10} />
                                <span>{rev.placeRating.toFixed(1)}</span>
                            </div>
                        )}
                        {rev.priceRating > 0 && (
                            <div className="flex items-center gap-1 bg-green-50 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-green-100 text-green-600">
                                <CircleDollarSign size={10} />
                                <span>{rev.priceRating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    {rev.comment && (
                        <p className="text-sm text-foreground/80 leading-relaxed font-medium pl-1">
                            {rev.comment}
                        </p>
                    )}

                    <div className="mt-4 pt-4 border-t border-primary/5 flex justify-between items-center">
                        <span className="text-[10px] text-primary/40 font-bold">
                            {new Date(rev.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>

                        <button
                            onClick={() => handleToggleLike(rev.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-90 ${rev.isLiked
                                    ? "bg-red-50 text-red-500 border border-red-100"
                                    : "bg-gray-50 text-gray-400 border border-gray-100 hover:text-red-400"
                                }`}
                        >
                            <Heart size={14} className={rev.isLiked ? "fill-current" : ""} />
                            <span className="text-xs font-bold">{rev.likeCount}</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
