import { Star, MapPin, Users, Coffee, Utensils, Home, DollarSign, Check } from "lucide-react";
import { ShopFollowButton } from "./shop-follow-button";
import { cn } from "@/lib/utils";
import * as icons from "lucide-react";

interface ShopInfoProps {
    shopId: string;
    name: string;
    avgRating: number | string;
    reviewCount: number;
    followerCount: number;
    address?: string | null;
    isFollowing?: boolean;
    features?: any[];
    categoryRatings?: {
        avgCoffee: number;
        avgFood: number;
        avgPlace: number;
        avgPrice: number;
    };
}

export function ShopInfo({
    shopId,
    name,
    avgRating,
    reviewCount,
    followerCount,
    address,
    isFollowing,
    features = [],
    categoryRatings
}: ShopInfoProps) {
    const categories = [
        { label: "Café", value: categoryRatings?.avgCoffee || 0, icon: Coffee, color: "text-amber-600", bg: "bg-amber-100" },
        { label: "Comida", value: categoryRatings?.avgFood || 0, icon: Utensils, color: "text-orange-600", bg: "bg-orange-100" },
        { label: "Lugar", value: categoryRatings?.avgPlace || 0, icon: Home, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Precio", value: categoryRatings?.avgPrice || 0, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
    ];

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                    <h1 className="text-4xl font-bold leading-tight">{name}</h1>
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-amber-700">
                            {avgRating ? Number(avgRating).toFixed(1) : '0.0'}
                        </span>
                        <span className="text-xs text-amber-600/70">({reviewCount || 0})</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full text-primary">
                            <Users className="w-4 h-4" />
                            <span className="font-bold text-xs">{followerCount || 0} seguidores</span>
                        </div>
                        <ShopFollowButton shopId={shopId} initialIsFollowing={isFollowing} />
                    </div>

                    {address && (
                        <div className="flex items-center gap-1.5 text-zinc-500">
                            <MapPin className="w-4 h-4" />
                            <span className="text-xs truncate max-w-[180px]">{address}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Ratings */}
            <div className="grid grid-cols-2 gap-2.5">
                {categories.map((cat) => (
                    <div key={cat.label} className="bg-zinc-50/50 rounded-xl p-2.5 border border-zinc-100 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <div className={cn("p-1 rounded-md", cat.bg, cat.color)}>
                                <cat.icon className="w-3 h-3" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{cat.label}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={cn(
                                            "w-2.5 h-2.5",
                                            s <= Math.round(cat.value)
                                                ? "fill-primary text-primary"
                                                : "fill-zinc-200 text-zinc-200"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-black text-foreground">{cat.value ? Number(cat.value).toFixed(1) : '0.0'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Features Section */}
            {features.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Características</h3>
                    <div className="flex flex-wrap gap-2">
                        {features.map((feature) => {
                            const toPascalCase = (str: string) =>
                                str.replace(/(^\w|-\w)/g, clear => clear.replace("-", "").toUpperCase());

                            const iconName = toPascalCase(feature.icon || "");
                            const IconComponent = (icons as any)[iconName] || (icons as any)[feature.icon];

                            return (
                                <div
                                    key={feature.id}
                                    className="px-4 py-2 rounded-2xl text-xs font-bold bg-primary/5 text-primary border border-primary/10 flex items-center gap-2 shadow-sm"
                                >
                                    {IconComponent ? (
                                        <IconComponent size={14} />
                                    ) : (
                                        <div className="w-3.5 h-3.5 flex items-center justify-center bg-foreground/5 rounded-full text-[8px]">
                                            {feature.name.substring(0, 1)}
                                        </div>
                                    )}
                                    {feature.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
