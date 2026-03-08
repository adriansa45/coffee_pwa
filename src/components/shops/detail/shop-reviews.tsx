"use client";

import { getReviews, toggleReviewLike } from "@/actions/reviews";
import { AuthModal } from "@/components/auth-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { CircleDollarSign, Coffee, Heart, Loader2, Map, MessageSquare, Star, Utensils } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ShopReviewsProps {
    shopId: string;
    initialReviews?: any[];
    initialHasMore?: boolean;
}

export function ShopReviews({ shopId, initialReviews = [], initialHasMore = true }: ShopReviewsProps) {
    const [reviews, setReviews] = useState<any[]>(initialReviews);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const observerTarget = useRef(null);

    const handleToggleLike = async (reviewId: string) => {
        if (!session) {
            setIsAuthModalOpen(true);
            return;
        }

        // Optimistic update
        setReviews(prev => prev.map(rev => {
            if (rev.id === reviewId) {
                const currentLikeCount = Number(rev.likeCount) || 0;
                return {
                    ...rev,
                    isLiked: !rev.isLiked,
                    likeCount: rev.isLiked ? Math.max(0, currentLikeCount - 1) : currentLikeCount + 1
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
                        const currentLikeCount = Number(rev.likeCount) || 0;
                        return {
                            ...rev,
                            isLiked: !rev.isLiked,
                            likeCount: rev.isLiked ? Math.max(0, currentLikeCount - 1) : currentLikeCount + 1
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
                <h3 className="text-xl font-bold flex items-center gap-2">
                    Reseñas <span className="text-sm font-bold text-muted-foreground">({reviews.length})</span>
                </h3>
            </div>

            <div className="space-y-2">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-2">
                        <div className="flex items-center justify-between">
                            <Link href={`/users/${review.userId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <Avatar className="w-10 h-10 border-2 border-primary/5">
                                    <AvatarImage src={review.userImage} alt={review.userName} />
                                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                        {review.userName.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-sm leading-none">{review.userName}</h4>
                                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </Link>
                            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-lg">
                                <Star className="w-3 h-3 fill-primary text-primary" />
                                <span className="text-xs font-bold text-primary">{Number(review.rating).toFixed(1)}</span>
                            </div>
                        </div>

                        {/* Category Ratings Display as Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {review.coffeeRating > 0 && (
                                <div className="flex items-center gap-1 bg-primary/5 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-primary/10 text-primary">
                                    <Coffee size={10} />
                                    <span>{review.coffeeRating.toFixed(1)}</span>
                                </div>
                            )}
                            {review.foodRating > 0 && (
                                <div className="flex items-center gap-1 bg-primary/5 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-primary/10 text-primary">
                                    <Utensils size={10} />
                                    <span>{review.foodRating.toFixed(1)}</span>
                                </div>
                            )}
                            {review.placeRating > 0 && (
                                <div className="flex items-center gap-1 bg-primary/5 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-primary/10 text-primary">
                                    <Map size={10} />
                                    <span>{review.placeRating.toFixed(1)}</span>
                                </div>
                            )}
                            {review.priceRating > 0 && (
                                <div className="flex items-center gap-1 bg-primary/5 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-primary/10 text-primary">
                                    <CircleDollarSign size={10} />
                                    <span>{review.priceRating.toFixed(1)}</span>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-foreground leading-relaxed px-1">
                            {review.comment}
                        </p>

                        {review.tags && review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {review.tags.map((tag: string) => (
                                    <span key={tag} className="text-[9px] font-bold px-2 py-0.5 bg-muted text-muted-foreground rounded-lg">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-start items-center pt-2">
                            <button
                                onClick={() => handleToggleLike(review.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-90 ${review.isLiked
                                    ? "bg-destructive/10 text-destructive border border-destructive/10"
                                    : "bg-muted text-muted-foreground border border-border hover:text-destructive"
                                    }`}
                            >
                                <Heart size={13} className={review.isLiked ? "fill-current" : ""} />
                                <span className="text-xs font-bold">{Number(review.likeCount) || 0}</span>
                            </button>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-border">
                        <div className="bg-card w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm border border-border">
                            <MessageSquare className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-bold text-foreground">Aún no hay reseñas</p>
                        <p className="text-[10px] text-muted-foreground">¡Sé el primero en compartir tu experiencia!</p>
                    </div>
                )}
            </div>

            <div ref={observerTarget} className="py-8 flex justify-center">
                {loading && (
                    <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
                    </div>
                )}
                {!hasMore && reviews.length > 0 && (
                    <p className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-widest">
                        Has llegado al final
                    </p>
                )}
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}
