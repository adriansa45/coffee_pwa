"use client";

import { MapPin, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
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
    
    // Manage image state to handle fallbacks gracefully
    const [imgSrc, setImgSrc] = useState<string>(
        (typeof shop.image === 'string' && shop.image) ? shop.image : "/images/placeholder.jpg"
    );

    // Sync state if shop prop changes
    useEffect(() => {
        setImgSrc((typeof shop.image === 'string' && shop.image) ? shop.image : "/images/placeholder.jpg");
    }, [shop.image]);

    return (
        <Link href={`/shops/${shop.id}`} className={cn("block group h-full", className)}>
            <Card className="relative h-full flex flex-col overflow-hidden p-0 gap-0 border-border/40 hover:border-primary/50 transition-all duration-500 hover:-translate-y-1.5 bg-card/50 backdrop-blur-sm">
                {/* Image Container - Flush to top */ }
                <div className="relative aspect-[16/11] overflow-hidden w-full bg-muted/10 flex-shrink-0">
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-20">
                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20 font-bold tracking-widest text-[10px] uppercase py-1 px-3 backdrop-blur-md">
                            Abierto
                        </Badge>
                    </div>
                    
                    <Image
                        src={imgSrc}
                        alt={shop.name}
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        priority
                        unoptimized={imgSrc.startsWith('/api/') || imgSrc.includes('localhost')}
                        onError={() => setImgSrc("/images/placeholder.jpg")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                </div>

                <CardContent className="p-4 grid grid-rows-[44px_1fr_auto] gap-6 h-full">
                    {/* Title Row - Fixed height for 2 lines */}
                    <div className="flex justify-between items-start gap-4 h-[44px]">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight tracking-tight uppercase line-clamp-2 flex-1">
                            {shop.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg border border-primary/20 flex-shrink-0">
                            <Star className="size-3 fill-primary text-primary" />
                            <span className="text-[11px] font-bold text-primary">{rating.toFixed(1)}</span>
                        </div>
                    </div>
                    
                    {/* Info Row - Metadata aligned to the bottom of its area */}
                    <div className="flex flex-col justify-end gap-1.5 text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-t border-border/20 pt-4">
                        {shop.address && (
                            <div className="flex items-center gap-2">
                                <MapPin className="size-3 text-primary/60" />
                                <span className="truncate">{shop.address}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Users className="size-3 text-primary/60" />
                            <span>{shop.followerCount || 0} SEGUIDORES</span>
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="w-full py-3.5 bg-primary/5 group-hover:bg-primary group-hover:text-primary-foreground text-primary rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 border border-primary/20 group-hover:border-primary text-center">
                        Explorar Lugar
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
