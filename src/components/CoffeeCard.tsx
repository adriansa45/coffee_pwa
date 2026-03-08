import { MapPin, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <Link href={`/shops/${shop.id}`} className={cn("block group", className)}>
            <Card className="overflow-hidden border-border/40 hover:border-primary/50 transition-all duration-500 hover:-translate-y-1.5 bg-card/50 backdrop-blur-sm">
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-20">
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20 font-bold tracking-widest text-[9px] uppercase py-1">
                        Abierto
                    </Badge>
                </div>

                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                        src={image}
                        alt={shop.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                </div>

                <CardContent className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight tracking-tight uppercase">
                                {shop.name}
                            </h3>
                            <div className="flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
                                <Star className="size-3 fill-primary text-primary" />
                                <span className="text-[11px] font-bold text-primary">{rating.toFixed(1)}</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-muted-foreground text-[9px] font-bold uppercase tracking-widest">
                            {shop.address && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="size-3 text-primary/60" />
                                    <span className="truncate max-w-[150px]">{shop.address}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Users className="size-3 text-primary/60" />
                                <span>{shop.followerCount || 0} SEGUIDORES</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full py-3 bg-primary/5 group-hover:bg-primary group-hover:text-primary-foreground text-primary rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-500 border border-primary/10 group-hover:border-primary text-center">
                        Explorar Lugar
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
