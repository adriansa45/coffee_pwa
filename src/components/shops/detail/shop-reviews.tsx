"use client";

import { useState, useEffect, useRef } from "react";
import { getReviews } from "@/actions/reviews";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopReviewsProps {
    shopId: string;
    initialReviews: any[];
    initialHasMore: boolean;
}

export function ShopReviews({ shopId, initialReviews, initialHasMore }: ShopReviewsProps) {
    const [reviews, setReviews] = useState(initialReviews);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const observerTarget = useRef(null);

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
