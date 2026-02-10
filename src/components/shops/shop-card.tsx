"use client";

import Link from "next/link";
import * as icons from "lucide-react";
import { Star, MapPin, CheckCircle2, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function CoffeeShopCard({ shop }: { shop: any }) {
    return (
        <Link
            href={`/shops/${shop.id}`}
            className="group block bg-white rounded-[32px] overflow-hidden border border-primary/10/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
        >
            <div className="relative h-48 w-full bg-primary/5 overflow-hidden">
                {shop.image ? (
                    <img
                        src={shop.image}
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/20">
                        <Coffee size={48} className="group-hover:scale-110 transition-transform duration-700" />
                    </div>
                )}

                {/* Overlay Tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {shop.isVisited && (
                        <div className="bg-green-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                            <CheckCircle2 size={10} /> Visitada
                        </div>
                    )}
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-foreground px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg border border-primary/10">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span>{Number(shop.avgRating).toFixed(1)}</span>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                        {shop.name}
                    </h3>
                </div>

                <div className="flex items-center gap-1.5 text-foreground/40 text-xs font-medium mb-4">
                    <MapPin size={14} />
                    <span className="truncate">{shop.address || "Dirección no disponible"}</span>
                </div>

                {/* Features Insignias */}
                {shop.features && shop.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {shop.features.map((feature: any) => {
                            const toPascalCase = (str: string) => 
                                str.replace(/(^\w|-\w)/g, clear => clear.replace("-", "").toUpperCase());
                            
                            const iconName = toPascalCase(feature.icon || "");
                            const IconComponent = (icons as any)[iconName] || (icons as any)[feature.icon];
                            
                            return (
                                <div 
                                    key={feature.id}
                                    title={feature.name}
                                    className="w-7 h-7 rounded-full border flex items-center justify-center transition-transform active:scale-110"
                                    style={{ 
                                        backgroundColor: (feature.color || 'var(--primary)') + '10',
                                        color: feature.color || 'var(--primary)',
                                        borderColor: (feature.color || 'var(--primary)') + '20'
                                    }}
                                >
                                    {IconComponent ? (
                                        <IconComponent size={14} />
                                    ) : (
                                        <span className="text-[8px] font-bold">{feature.name.substring(0, 1)}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded">
                        {shop.reviewCount} Reseñas
                    </span>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">
                                {i}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}
