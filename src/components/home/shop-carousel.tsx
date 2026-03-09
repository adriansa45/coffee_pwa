"use client";

import { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { CoffeeCard } from "@/components/CoffeeCard";
import { cn } from "@/lib/utils";

interface ShopSection {
    id: string;
    title: string;
    subtitle?: string;
    shops: any[];
}

interface ShopCarouselProps {
    sections: ShopSection[];
}

export function ShopCarousel({ sections }: ShopCarouselProps) {
    const [activeTab, setActiveTab] = useState(sections[0]?.id || "");

    const activeSection = sections.find(s => s.id === activeTab) || sections[0];
    if (!activeSection || !activeSection.shops.length) return null;

    return (
        <section className="flex flex-col gap-8">
            {/* Header and Pill Switcher */}
            <div className="flex flex-col gap-6 px-1">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase">Explorar</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Encuentra tu próximo lugar favorito</p>
                </div>

                {/* Pills */}
                <div className="relative -mx-1">
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 items-center">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveTab(section.id)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border whitespace-nowrap",
                                    activeTab === section.id
                                        ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_12px_rgba(var(--primary),0.4)] scale-[1.05]"
                                        : "bg-muted/10 text-muted-foreground border-border/40 hover:bg-muted/20"
                                )}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Carousel Content */}
            <div key={activeTab} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
                {activeSection.subtitle && (
                    <div className="px-1">
                        <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.25em]">{activeSection.subtitle}</p>
                    </div>
                )}
                
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-3 pb-6">
                        {activeSection.shops.map((shop) => (
                            <CarouselItem key={shop.id} className="pl-3 basis-[82%] sm:basis-[48%] md:basis-[33%]">
                                <CoffeeCard shop={shop} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}
