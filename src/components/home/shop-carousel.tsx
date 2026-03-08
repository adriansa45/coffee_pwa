"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { CoffeeCard } from "@/components/CoffeeCard";
import { cn } from "@/lib/utils";

interface ShopCarouselProps {
    shops: any[];
    title: string;
    subtitle?: string;
}

export function ShopCarousel({ shops, title, subtitle }: ShopCarouselProps) {
    if (!shops || shops.length === 0) return null;

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 px-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase">{title}</h2>
                {subtitle && <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.25em]">{subtitle}</p>}
            </div>

            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4 pb-4">
                    {shops.map((shop) => (
                        <CarouselItem key={shop.id} className="pl-4 basis-[85%] sm:basis-[45%] md:basis-[33%]">
                            <CoffeeCard shop={shop} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
}
