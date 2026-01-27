"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface LikertRatingProps {
    rating: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    size?: "sm" | "md" | "lg";
    className?: string;
    numericLabel?: boolean;
}

const LIKERT_OPTIONS = [
// ...
    { value: 1, color: "bg-red-500", label: "Nada satisfecho" },
    { value: 2, color: "bg-orange-500", label: "Poco satisfecho" },
    { value: 3, color: "bg-yellow-500", label: "Neutral" },
    { value: 4, color: "bg-lime-500", label: "Muy satisfecho" },
    { value: 5, color: "bg-green-600", label: "Totalmente satisfecho" },
];

export function LikertRating({
    rating,
    interactive = false,
    onRatingChange,
    size = "md",
    className,
}: LikertRatingProps) {
    const handleSelect = (val: number) => {
        if (interactive && onRatingChange) {
            if (rating === val) {
                onRatingChange(0);
            } else {
                onRatingChange(val);
            }
        }
    };

    const sizeClasses = {
        sm: "h-6 w-full",
        md: "h-8 w-full",
        lg: "h-14 w-full",
    };

    const itemClasses = {
        sm: "h-2",
        md: "h-4 rounded-md",
        lg: "h-8 rounded-lg",
    };

    return (
        <div className={cn("flex flex-col gap-2 w-full", className)}>
            <div className={cn("flex w-full gap-1 items-end", sizeClasses[size])}>
                {LIKERT_OPTIONS.map((opt) => {
                    const isSelected = rating >= opt.value;
                    const isExact = rating === opt.value;

                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelect(opt.value)}
                            disabled={!interactive}
                            className={cn(
                                "flex-1 transition-all duration-200",
                                itemClasses[size],
                                isSelected ? opt.color : "bg-gray-200",
                                interactive && "hover:opacity-80 active:scale-95",
                                isExact && interactive && "ring-2 ring-offset-2 ring-gray-400",
                                !interactive && "cursor-default"
                            )}
                            title={opt.label}
                        />
                    );
                })}
            </div>
            {onRatingChange && (
                <span className="text-[10px] font-bold text-center text-gray-500 uppercase tracking-tighter w-full">
                    {rating > 0 
                        ? LIKERT_OPTIONS.find(o => o.value === rating)?.label 
                        : "-"}
                </span>
            )}
        </div>
    );
}
