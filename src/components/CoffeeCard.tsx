import { cn } from '@/lib/utils';
import { MapPin, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CoffeeCardProps {
    shop: {
        id: string;
        name: string;
        image?: string | null;
        avgRating?: number;
        address?: string | null;
        followerCount?: number;
    };
    className?: string;
}

export function CoffeeCard({ shop, className }: CoffeeCardProps) {
    const rating = Number(shop.avgRating) || 0;
    const image = shop.image || "/images/coffee-placeholder.jpg";

    return (
        <Link href={`/shops/${shop.id}`} className={cn(
            "group relative bg-card/40 backdrop-blur-sm border border-white/5 rounded-4xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 block",
            className
        )}>
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10">
                <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Abierto
                </div>
            </div>

            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                    src={image}
                    alt={shop.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                        {shop.name}
                    </h3>
                    <div className="flex items-center gap-4 text-zinc-400 text-sm">
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-zinc-200">{rating.toFixed(1)}</span>
                        </div>
                        {shop.address && (
                            <div className="flex items-center gap-1 text-zinc-300 truncate max-w-[120px]">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{shop.address}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1 text-zinc-300">
                            <Users className="w-3.5 h-3.5" />
                            <span className="font-medium">{shop.followerCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl text-xs font-bold transition-all duration-300 border border-white/10 active:scale-95 text-center">
                    Ver Detalles
                </div>
            </div>
        </Link>
    );
}
