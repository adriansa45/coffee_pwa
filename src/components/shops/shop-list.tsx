"use client";

import { useState, useMemo } from "react";
import { CoffeeShopCard } from "./shop-card";
import { cn } from "@/lib/utils";
import * as icons from "lucide-react";
import { Search, Filter, Check, X } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function CoffeeShopList({ 
    initialShops, 
    tags, 
    features = [] 
}: { 
    initialShops: any[], 
    tags: any[],
    features?: any[]
}) {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const filteredShops = useMemo(() => {
        return initialShops.filter(shop => {
            // Search filter
            if (search && !shop.name.toLowerCase().includes(search.toLowerCase()) && !shop.address?.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }

            // Status filter (collected/missing)
            if (filter === "collected" && !shop.isVisited) return false;
            if (filter === "missing" && shop.isVisited) return false;

            // Features filter
            if (selectedFeatures.length > 0) {
                const shopFeatureIds = shop.features?.map((f: any) => f.id) || [];
                if (!selectedFeatures.every(fid => shopFeatureIds.includes(fid))) {
                    return false;
                }
            }

            return true;
        });
    }, [initialShops, search, filter, selectedFeatures]);

    const toggleFeature = (id: string) => {
        setSelectedFeatures(prev => 
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-6">
            {/* Search Input with Integrated Filter Button */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={20} />
                <input
                    type="text"
                    placeholder="Busca por nombre o dirección..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white rounded-3xl py-4 pl-12 pr-14 text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm border border-primary/5"
                />
                
                <Drawer>
                    <DrawerTrigger asChild>
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-2xl bg-primary/5 hover:bg-primary/10 text-primary transition-colors">
                            <Filter size={18} className={selectedFeatures.length > 0 ? "fill-primary" : ""} />
                            {selectedFeatures.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                    {selectedFeatures.length}
                                </span>
                            )}
                        </button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle>Filtros</DrawerTitle>
                                <DrawerDescription>Selecciona las características que buscas</DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {features.map((feature) => {
                                        const toPascalCase = (str: string) => 
                                            str.replace(/(^\w|-\w)/g, clear => clear.replace("-", "").toUpperCase());
                                        
                                        const iconName = toPascalCase(feature.icon || "");
                                        const IconComponent = (icons as any)[iconName] || (icons as any)[feature.icon];
                                        const isSelected = selectedFeatures.includes(feature.id);
                                        
                                        return (
                                            <button
                                                key={feature.id}
                                                onClick={() => toggleFeature(feature.id)}
                                                className={cn(
                                                    "px-4 py-2 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2",
                                                    isSelected
                                                        ? "bg-primary text-white border-primary shadow-md"
                                                        : "bg-white text-foreground/60 border-primary/10"
                                                )}
                                                style={isSelected ? {} : { 
                                                    color: feature.color || 'inherit',
                                                    borderColor: feature.color ? feature.color + '40' : undefined 
                                                }}
                                            >
                                                {IconComponent ? (
                                                    <IconComponent size={14} />
                                                ) : (
                                                    <div className="w-3.5 h-3.5 flex items-center justify-center bg-foreground/5 rounded-full text-[8px]">
                                                        {feature.name.substring(0, 1)}
                                                    </div>
                                                )}
                                                {feature.name}
                                                {isSelected && <Check size={14} className="ml-auto" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedFeatures.length > 0 && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setSelectedFeatures([])}
                                        className="w-full text-foreground/40 text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        Limpiar filtros
                                    </Button>
                                )}
                            </div>
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button className="rounded-2xl py-6 font-bold">Ver {filteredShops.length} resultados</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6">
                {["all", "collected", "missing"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                            filter === f
                                ? "bg-primary text-white border-primary shadow-md"
                                : "bg-white text-foreground/60 border-primary/10 hover:border-brand-300"
                        )}
                    >
                        {f === "all" ? "Todas" : f === "collected" ? "Visitadas" : "Por visitar"}
                    </button>
                ))}
            </div>

            {/* Shop Cards */}
            <div className="grid grid-cols-1 gap-4">
                {filteredShops.map((shop) => (
                    <CoffeeShopCard key={shop.id} shop={shop} />
                ))}
                {filteredShops.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-primary/10/50">
                        <p className="text-foreground/40 font-medium">No se encontraron cafeterías</p>
                    </div>
                )}
            </div>
        </div>
    );
}

