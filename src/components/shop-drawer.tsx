"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Star, Send, Loader2, Tag } from "lucide-react";
import { StarRating } from "./star-rating";
import { authClient } from "@/lib/auth-client";
import { getTags, createReview, getReviews } from "@/actions/reviews";

interface Review {
    id: string;
    userName: string;
    userImage: string | null;
    rating: string;
    comment: string | null;
    createdAt: string; // or Date
    tags?: string[];
}

interface TagType {
    id: string;
    name: string;
}

interface ShopDrawerProps {
    shop: {
        id: string;
        name: string;
        avgRating: number;
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

    // Form state
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [availableTags, setAvailableTags] = useState<TagType[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (isOpen) {
            // Load tags only once or when drawer opens
            loadTags();
        }
        if (shop && isOpen) {
            fetchShopReviews(shop.id);
        }
    }, [shop, isOpen]);

    const loadTags = async () => {
        const res = await getTags();
        if (res.success && res.data) {
            setAvailableTags(res.data);
        }
    };

    const fetchShopReviews = async (shopId: string) => {
        setLoading(true);
        try {
            const res = await getReviews(shopId);
            if (res.success && res.data) {
                // @ts-ignore - Date types mismatch from server action usually strings
                setReviews(res.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    const handleReviewSubmit = async () => {
        if (!shop || newRating === 0) return;
        setIsSubmitting(true);
        try {
            const res = await createReview({
                shopId: shop.id,
                rating: newRating,
                comment: newComment,
                tagIds: selectedTags
            });

            if (res.success) {
                setNewRating(0);
                setNewComment("");
                setSelectedTags([]);
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
        <div className="fixed inset-0 z-[2000] flex flex-col justify-end overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out animate-in fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-lg mx-auto bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out animate-in slide-in-from-bottom-full pb-safe">
                {/* Drag Handle */}
                <div className="flex justify-center p-3">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-brand-950 leading-tight">{shop?.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <StarRating rating={Number(shop?.avgRating || 0)} size={16} />
                                <span className="text-xs font-semibold text-brand-800/70">
                                    {Number(shop?.avgRating || 0).toFixed(1)} ({shop?.reviewCount} reseñas)
                                </span>
                            </div>
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
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                            >
                                <MapPin size={14} />
                                CÓMO LLEGAR
                            </a>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col h-[70vh] md:h-[60vh] overflow-hidden">
                    {/* Scrollable Reviews Section */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <h3 className="text-sm font-bold text-brand-950 mb-4 uppercase tracking-wider">Críticas y Comentarios</h3>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="animate-spin text-brand-600" size={32} />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <div className="text-center py-8 bg-brand-50/30 rounded-2xl border-2 border-dashed border-brand-100">
                                        <p className="text-sm text-gray-400">Sé el primero en calificar este lugar</p>
                                    </div>
                                ) : (
                                    reviews.map((rev) => (
                                        <div key={rev.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                                                        {rev.userName.charAt(0)}
                                                    </div>
                                                    <span className="text-xs font-bold text-brand-950">{rev.userName}</span>
                                                </div>
                                                <StarRating rating={Number(rev.rating)} size={10} />
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">{rev.comment}</p>

                                            {/* Tags Display */}
                                            {rev.tags && rev.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {rev.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] rounded-full font-medium border border-brand-100">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <p className="text-[10px] text-gray-400 mt-2">
                                                {new Date(rev.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Fixed Bottom Review Form */}
                    <div className="px-6 py-6 border-t border-gray-100 bg-white shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
                        {session ? (
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-brand-950">Tu experiencia</h4>
                                <div className="flex flex-col items-center gap-2">
                                    <StarRating
                                        rating={newRating}
                                        interactive
                                        onRatingChange={setNewRating}
                                        size={32}
                                        className="gap-2"
                                    />
                                    <span className="text-xs text-brand-800 font-medium">
                                        {newRating === 5 ? "¡Increíble!" :
                                            newRating === 4 ? "Muy bueno" :
                                                newRating === 3 ? "Aceptable" :
                                                    newRating === 2 ? "Regular" :
                                                        newRating === 1 ? "No me gustó" : "Toca para calificar"}
                                    </span>
                                </div>

                                {/* Tag Selector */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 mb-2">¿Qué destacas?</p>
                                    <div className="flex flex-wrap gap-2">
                                        {availableTags.map(tag => (
                                            <button
                                                key={tag.id}
                                                onClick={() => toggleTag(tag.id)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedTags.includes(tag.id)
                                                        ? "bg-brand-600 text-white border-brand-600"
                                                        : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                                                    }`}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative">
                                    <textarea
                                        className="w-full p-4 text-sm border-2 border-brand-100 rounded-2xl focus:border-brand-500 focus:ring-0 outline-none transition-all placeholder:text-gray-300 resize-none"
                                        placeholder="Comparte tu opinión con la comunidad..."
                                        rows={2}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleReviewSubmit}
                                    disabled={isSubmitting || newRating === 0}
                                    className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-200 text-white font-bold rounded-2xl shadow-lg shadow-brand-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                                    PUBLICAR RESEÑA
                                </button>
                            </div>
                        ) : (
                            <div className="bg-brand-50 p-6 rounded-2xl text-center">
                                <p className="text-sm text-brand-900 font-medium mb-2">¿Te gustó el café?</p>
                                <p className="text-xs text-brand-800/60">Inicia sesión para compartir tu reseña con otros exploradores.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
