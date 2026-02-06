"use client";

import { useState } from "react";
import { CoffeeShopCard } from "./shop-card";
import { cn } from "@/lib/utils";

export function CoffeeShopList({ initialShops, tags }: { initialShops: any[], tags: any[] }) {
    const [filter, setFilter] = useState("all");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6">
                {["all", "collected", "missing"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                            filter === f
                                ? "bg-brand-600 text-white border-brand-600 shadow-md"
                                : "bg-white text-brand-900/60 border-brand-100 hover:border-brand-300"
                        )}
                    >
                        {f === "all" ? "Todas" : f === "collected" ? "Visitadas" : "Por visitar"}
                    </button>
                ))}
            </div>

            {/* Shop Cards */}
            <div className="grid grid-cols-1 gap-4">
                {initialShops.map((shop) => (
                    <CoffeeShopCard key={shop.id} shop={shop} />
                ))}
                {initialShops.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-brand-100/50">
                        <p className="text-brand-900/40 font-medium">No se encontraron cafeterías</p>
                    </div>
                )}
            </div>
        </div>
    );
}
