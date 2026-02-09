import { Star, MapPin } from "lucide-react";

interface ShopInfoProps {
    name: string;
    avgRating: number | string;
    reviewCount: number;
    address?: string | null;
}

export function ShopInfo({ name, avgRating, reviewCount, address }: ShopInfoProps) {
    return (
        <div className="space-y-4">
            <h1 className="text-4xl font-bold">{name}</h1>

            <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-foreground">
                        {avgRating ? Number(avgRating).toFixed(1) : '0.0'}
                    </span>
                    <span className="text-sm">({reviewCount || 0})</span>
                </div>
                {address && (
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm truncate max-w-[200px]">{address}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
