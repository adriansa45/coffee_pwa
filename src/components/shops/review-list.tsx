"use client";

import { useTransition, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/star-rating";
import { LikertRating } from "@/components/likert-rating";
import { Coffee, Utensils, Map, CircleDollarSign } from "lucide-react";

export function ReviewList({ initialReviews, shopId }: { initialReviews: any[], shopId: string }) {
    if (initialReviews.length === 0) {
        return (
            <div className="text-center py-12 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/10">
                <p className="text-sm text-foreground/40 font-medium">Sé el primero en compartir tu experiencia</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {initialReviews.map((rev) => (
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

                    {/* Category Ratings Display */}
                    <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2">
                            <Coffee size={14} className="text-primary" />
                            <LikertRating rating={rev.coffeeRating} size="sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Utensils size={14} className="text-primary" />
                            <LikertRating rating={rev.foodRating} size="sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Map size={14} className="text-primary" />
                            <LikertRating rating={rev.placeRating} size="sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <CircleDollarSign size={14} className="text-primary" />
                            <LikertRating rating={rev.priceRating} size="sm" />
                        </div>
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
                    </div>
                </div>
            ))}
        </div>
    );
}
