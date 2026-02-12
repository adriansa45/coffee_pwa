"use client";

import { createReview, getReviews, toggleReviewLike } from "@/actions/reviews";
import { authClient } from "@/lib/auth-client";
import { CircleDollarSign, Coffee, Heart, Loader2, Map, MapPin, Send, Utensils, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LikertRating } from "./likert-rating";
import { StarRating } from "./star-rating";

interface Review {
    id: string;
    userName: string;
    userImage: string | null;
    rating: string;
    coffeeRating: number;
    foodRating: number;
    placeRating: number;
    priceRating: number;
    comment: string | null;
    createdAt: string; // or Date
    tags?: string[];
    likeCount: number;
    isLiked: boolean;
}

interface ShopDrawerProps {
    shop: {
        id: string;
        name: string;
        avgRating: number;
        avgCoffee?: number;
        avgFood?: number;
        avgPlace?: number;
        avgPrice?: number;
        reviewCount: number;
        googleMapsUrl: string | null;
    } | null;
    isOpen: boolean;
    onClose: () => void;
    onReviewSubmitted: () => void;
}

export function ShopDrawer({ shop, isOpen, onClose, onReviewSubmitted }: ShopDrawerProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);

    // Form state
    const [coffeeRating, setCoffeeRating] = useState(0);
    const [foodRating, setFoodRating] = useState(0);
    const [placeRating, setPlaceRating] = useState(0);
    const [priceRating, setPriceRating] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (shop && isOpen) {
            fetchShopReviews(shop.id);
        }
    }, [shop, isOpen]);

    const fetchShopReviews = async (shopId: string) => {
        setLoading(true);
        try {
            const res = await getReviews(shopId);
            if (res.success && 'data' in res) {
                setReviews(res.data as Review[]);
            }
        } finally {
            setLoading(false);
        }
    };

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

    const handleReviewSubmit = async () => {
        if (!shop || (coffeeRating === 0 && foodRating === 0 && placeRating === 0 && priceRating === 0)) return;
        setIsSubmitting(true);
        try {
            const res = await createReview({
                shopId: shop.id,
                coffeeRating,
                foodRating,
                placeRating,
                priceRating,
                comment: newComment,
            });

            if (res.success) {
                setCoffeeRating(0);
                setFoodRating(0);
                setPlaceRating(0);
                setPriceRating(0);
                setNewComment("");
                setIsReviewDrawerOpen(false);
                fetchShopReviews(shop.id);
                onReviewSubmitted();
            } else {
                alert("Error al enviar reseña");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[2000] flex flex-col justify-end overflow-hidden">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out animate-in fade-in"
                    onClick={onClose}
                />

                {/* Main Shop Drawer */}
                <div className="relative w-full max-w-lg mx-auto bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out animate-in slide-in-from-bottom-full pb-safe h-[85vh] flex flex-col">
                    {/* Drag Handle */}
                    <div className="flex justify-center p-3">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="px-6 pb-4 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-foreground leading-tight">{shop?.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <StarRating rating={Number(shop?.avgRating || 0)} size={16} />
                                    <span className="text-xs font-semibold text-foreground/80/70">
                                        {Number(shop?.avgRating || 0).toFixed(1)} ({shop?.reviewCount} reseñas)
                                    </span>
                                </div>

                                {/* Summary Averages */}
                                {shop && (Number(shop.avgCoffee) > 0 || Number(shop.avgFood) > 0) && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {Number(shop.avgCoffee) > 0 && (
                                            <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                                <Coffee size={12} className="text-primary" />
                                                <span className="text-[11px] font-bold text-foreground/80">{Number(shop.avgCoffee).toFixed(1)}</span>
                                            </div>
                                        )}
                                        {Number(shop.avgFood) > 0 && (
                                            <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                                <Utensils size={12} className="text-primary" />
                                                <span className="text-[11px] font-bold text-foreground/80">{Number(shop.avgFood).toFixed(1)}</span>
                                            </div>
                                        )}
                                        {Number(shop.avgPlace) > 0 && (
                                            <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                                <Map size={12} className="text-primary" />
                                                <span className="text-[11px] font-bold text-foreground/80">{Number(shop.avgPlace).toFixed(1)}</span>
                                            </div>
                                        )}
                                        {Number(shop.avgPrice) > 0 && (
                                            <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                                <CircleDollarSign size={12} className="text-primary" />
                                                <span className="text-[11px] font-bold text-foreground/80">{Number(shop.avgPrice).toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="flex gap-3 mt-4">
                            {shop?.googleMapsUrl && (
                                <a
                                    href={shop.googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/80 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                                >
                                    <MapPin size={14} />
                                    CÓMO LLEGAR
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Content Area - Reviews Only */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Críticas y Comentarios</h3>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="animate-spin text-primary" size={32} />
                            </div>
                        ) : (
                            <div className="space-y-4 pb-20">
                                {reviews.length === 0 ? (
                                    <div className="text-center py-12 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/10">
                                        <p className="text-sm text-gray-400">Sin reseñas aún. ¡Sé el primero!</p>
                                    </div>
                                ) : (
                                    reviews.map((rev) => (
                                        <div key={rev.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary/90 font-bold text-xs shadow-inner">
                                                        {rev.userName.charAt(0)}
                                                    </div>
                                                    <span className="text-xs font-bold text-foreground">{rev.userName}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <StarRating rating={Number(rev.rating)} size={10} />
                                                </div>
                                            </div>

                                            {/* Category Ratings Display as Badges */}
                                            <div className="flex flex-wrap gap-1.5 mb-3">
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

                                            <p className="text-sm text-gray-700 leading-relaxed font-medium">{rev.comment}</p>

                                            <div className="flex justify-between items-center mt-3">
                                                <p className="text-[10px] text-gray-400 font-semibold">
                                                    {new Date(rev.createdAt).toLocaleDateString()}
                                                </p>

                                                <button
                                                    onClick={() => handleToggleLike(rev.id)}
                                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-all active:scale-90 ${rev.isLiked
                                                            ? "bg-red-50 text-red-500 border border-red-100"
                                                            : "bg-gray-50 text-gray-400 border border-gray-100 hover:text-red-400"
                                                        }`}
                                                >
                                                    <Heart size={12} className={rev.isLiked ? "fill-current" : ""} />
                                                    <span className="text-[10px] font-bold">{rev.likeCount}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Fixed Add Review Button at the bottom of the drawer */}
                    <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
                        <button
                            onClick={() => setIsReviewDrawerOpen(true)}
                            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 text-sm uppercase tracking-widest"
                        >
                            <Send size={18} />
                            AÑADIR RESEÑA
                        </button>
                    </div>
                </div>
            </div>

            {/* Review Form Modal (Nested Overlay/Drawer) */}
            {isReviewDrawerOpen && (
                <div className="fixed inset-0 z-[3000] flex flex-col justify-end">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
                        onClick={() => setIsReviewDrawerOpen(false)}
                    />
                    <div className="relative w-full max-w-lg mx-auto bg-white rounded-t-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-full duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-foreground uppercase">Tu experiencia</h3>
                            <button onClick={() => setIsReviewDrawerOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {session ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-5">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-gray-400 flex items-center gap-1 tracking-widest uppercase"><Coffee size={14} /> CAFÉ</span>
                                        <LikertRating rating={coffeeRating} interactive onRatingChange={setCoffeeRating} size="md" />
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-gray-400 flex items-center gap-1 tracking-widest uppercase"><Utensils size={14} /> COMIDA</span>
                                        <LikertRating rating={foodRating} interactive onRatingChange={setFoodRating} size="md" />
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-gray-400 flex items-center gap-1 tracking-widest uppercase"><Map size={14} /> LUGAR</span>
                                        <LikertRating rating={placeRating} interactive onRatingChange={setPlaceRating} size="md" />
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-gray-400 flex items-center gap-1 tracking-widest uppercase"><CircleDollarSign size={14} /> COSTO</span>
                                        <LikertRating rating={priceRating} interactive onRatingChange={setPriceRating} size="md" />
                                    </div>
                                </div>

                                <div className="relative pt-2">
                                    <textarea
                                        className="w-full p-4 text-sm border-2 border-primary/10 rounded-2xl focus:border-primary/60 focus:ring-0 outline-none transition-all placeholder:text-gray-300 resize-none bg-gray-50/50"
                                        placeholder="Comparte tu opinión con la comunidad..."
                                        rows={3}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleReviewSubmit}
                                    disabled={isSubmitting || (coffeeRating === 0 && foodRating === 0 && placeRating === 0 && priceRating === 0)}
                                    className="w-full py-5 bg-primary hover:bg-primary/90 disabled:bg-primary/20 text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] tracking-widest"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                                    PUBLICAR RESEÑA
                                </button>
                            </div>
                        ) : (
                            <div className="bg-primary/5 p-8 rounded-3xl text-center border border-primary/10">
                                <p className="text-sm text-foreground/90 font-bold mb-2 uppercase tracking-tight">¿Te gustó el café?</p>
                                <p className="text-xs text-foreground/80/60 font-medium">Inicia sesión para compartir tu reseña con otros exploradores.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
