"use client";

import { useState, useEffect } from "react";
import { Star, Coffee, Utensils, Home, DollarSign, X, Loader2, Tag as TagIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getTags, createReview } from "@/actions/reviews";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
    shopId: string;
    shopName: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReviewForm({ shopId, shopName, isOpen, onOpenChange }: ReviewFormProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [tags, setTags] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    
    const [ratings, setRatings] = useState({
        coffee: 0,
        food: 0,
        place: 0,
        price: 0
    });
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchTags = async () => {
            const response = await getTags();
            if (response.success && response.data) {
                setTags(response.data);
            }
        };
        fetchTags();
    }, []);

    const categories = [
        { key: "coffee", label: "Café", icon: Coffee, color: "text-amber-600", bg: "bg-amber-100" },
        { key: "food", label: "Comida", icon: Utensils, color: "text-orange-600", bg: "bg-orange-100" },
        { key: "place", label: "Lugar", icon: Home, color: "text-blue-600", bg: "bg-blue-100" },
        { key: "price", label: "Precio", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
    ];

    const handleSubmit = async () => {
        if (Object.values(ratings).every(r => r === 0)) {
            alert("Por favor, califica al menos una categoría");
            return;
        }

        setSubmitting(true);
        try {
            const response = await createReview({
                shopId,
                comment,
                tagIds: selectedTags,
                coffeeRating: ratings.coffee,
                foodRating: ratings.food,
                placeRating: ratings.place,
                priceRating: ratings.price
            });

            if (response.success) {
                onOpenChange(false);
                setRatings({ coffee: 0, food: 0, place: 0, price: 0 });
                setComment("");
                setSelectedTags([]);
                router.refresh();
            } else {
                alert(response.error || "Ocurrió un error al enviar la reseña");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Error de conexión");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId) 
                : [...prev, tagId]
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] sm:max-w-[425px] rounded-[2.5rem] p-6 gap-6 outline-none border-none shadow-2xl">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-2xl font-black">Escribir Reseña</DialogTitle>
                    <DialogDescription className="text-sm font-medium text-zinc-400">
                        Comparte tu experiencia en {shopName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2 -mr-2 no-scrollbar">
                    {/* Categories Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => (
                            <div key={cat.key} className="bg-zinc-50 rounded-[2rem] p-4 border border-zinc-100 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className={cn("p-1.5 rounded-lg", cat.bg, cat.color)}>
                                        <cat.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{cat.label}</span>
                                </div>
                                <div className="flex items-center justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRatings(prev => ({ ...prev, [cat.key]: star }))}
                                            className="transition-transform active:scale-125"
                                        >
                                            <Star
                                                className={cn(
                                                    "w-5 h-5 transition-colors",
                                                    star <= (ratings as any)[cat.key]
                                                        ? "fill-primary text-primary"
                                                        : "fill-zinc-200 text-zinc-200"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tags Selector */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <TagIcon className="w-4 h-4 text-zinc-400" />
                            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Etiquetas</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTag(tag.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm",
                                        selectedTags.includes(tag.id)
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200"
                                    )}
                                >
                                    #{tag.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment Area */}
                    <div className="space-y-3">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="¿Qué te pareció este lugar? Cuéntanos más detalles..."
                            className="w-full min-h-[120px] bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none no-scrollbar"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full h-14 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-[2rem] font-black text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            "Publicar Reseña"
                        )}
                    </button>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="w-full h-12 mt-2 text-zinc-400 font-bold text-sm hover:text-zinc-600 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
