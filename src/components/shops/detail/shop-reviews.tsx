"use client";

import { getReviews, toggleReviewLike } from "@/actions/reviews";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { CircleDollarSign, Coffee, Heart, Loader2, Map, MessageSquare, Star, Utensils } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ShopReviewsProps {
    shopId: string;
    initialReviews: any[];
    initialHasMore: boolean;
}

export function ShopReviews({ shopId, initialReviews, initialHasMore }: ShopReviewsProps) {
    const [reviews, setReviews] = useState<any[]>(initialReviews);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const { data: session } = authClient.useSession();
    const observerTarget = useRef(null);

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

    const loadMoreReviews = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = page + 1;

        try {
            const response = await getReviews(shopId, nextPage, 10);
            if (response.success && response.data) {
                setReviews(prev => [...prev, ...response.data]);
                setHasMore(response.hasMore || false);
                setPage(nextPage);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more reviews:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMoreReviews();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading, page]);

    return (
        <div className="space-y-6 pt-8">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black flex items-center gap-2">
                    Reseñas <span className="text-sm font-bold text-zinc-400">({reviews.length})</span>
                </h3>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-zinc-100 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 border-2 border-primary/5">
                                    <AvatarImage src={review.userImage} alt={review.userName} />
                                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                        {review.userName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{review.userName}</p>
                                    <p className="text-[10px] font-medium text-zinc-400 capitalize">
                                        {new Date(review.createdAt).toLocaleDateString("es-ES", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-black text-amber-700">{Number(review.rating).toFixed(1)}</span>
                            </div>
                        </div>

                        {/* Category Ratings Display as Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {review.coffeeRating > 0 && (
                                <div className="flex items-center gap-1 bg-amber-50 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-100 text-amber-700">
                                    <Coffee size={10} />
                                    <span>{review.coffeeRating.toFixed(1)}</span>
                                </div>
                            )}
                            {review.foodRating > 0 && (
                                <div className="flex items-center gap-1 bg-orange-50 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-orange-100 text-orange-600">
                                    <Utensils size={10} />
                                    <span>{review.foodRating.toFixed(1)}</span>
                                </div>
                            )}
                            {review.placeRating > 0 && (
                                <div className="flex items-center gap-1 bg-blue-50 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-blue-100 text-blue-600">
                                    <Map size={10} />
                                    <span>{review.placeRating.toFixed(1)}</span>
                                </div>
                            )}
                            {review.priceRating > 0 && (
                                <div className="flex items-center gap-1 bg-green-50 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-green-100 text-green-600">
                                    <CircleDollarSign size={10} />
                                    <span>{review.priceRating.toFixed(1)}</span>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-zinc-600 leading-relaxed pl-1">
                            {review.comment}
                        </p>

                        {review.tags && review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {review.tags.map((tag: string) => (
                                    <span key={tag} className="text-[9px] font-bold px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-lg">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-start items-center pt-2">
                            <button
                                onClick={() => handleToggleLike(review.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-90 ${review.isLiked
                                    ? "bg-red-50 text-red-500 border border-red-100"
                                    : "bg-gray-50 text-gray-400 border border-gray-100 hover:text-red-400"
                                    }`}
                            >
                                <Heart size={14} className={review.isLiked ? "fill-current" : ""} />
                                <span className="text-xs font-bold">{review.likeCount}</span>
                            </button>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-12 bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-200">
                        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <MessageSquare className="w-6 h-6 text-zinc-300" />
                        </div>
                        <p className="text-sm font-bold text-zinc-400">Aún no hay reseñas</p>
                        <p className="text-[10px] text-zinc-300">¡Sé el primero en compartir tu experiencia!</p>
                    </div>
                )}
            </div>

            <div ref={observerTarget} className="py-8 flex justify-center">
                {loading && (
                    <div className="flex items-center gap-2 text-primary animate-pulse">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-bold">Cargando más reseñas...</span>
                    </div>
                )}
                {!hasMore && reviews.length > 0 && (
                    <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
                        Has llegado al final
                    </p>
                )}
            </div>
        </div>
    );
}
