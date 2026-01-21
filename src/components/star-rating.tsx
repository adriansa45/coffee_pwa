import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
    rating: number;
    max?: number;
    size?: number;
    className?: string;
    onRatingChange?: (rating: number) => void;
    interactive?: boolean;
}

export function StarRating({
    rating,
    max = 5,
    size = 14,
    className = "",
    onRatingChange,
    interactive = false
}: StarRatingProps) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= max; i++) {
        if (i <= fullStars) {
            stars.push(
                <Star
                    key={i}
                    size={size}
                    className={`fill-yellow-400 text-yellow-400 ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
                    onClick={() => interactive && onRatingChange?.(i)}
                />
            );
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(
                <div key={i} className="relative">
                    <Star size={size} className="text-gray-300 fill-gray-300" />
                    <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                        <Star size={size} className="fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
            );
        } else {
            stars.push(
                <Star
                    key={i}
                    size={size}
                    className={`text-gray-300 fill-gray-300 ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
                    onClick={() => interactive && onRatingChange?.(i)}
                />
            );
        }
    }

    return (
        <div className={`flex gap-0.5 ${className}`}>
            {stars}
        </div>
    );
}
