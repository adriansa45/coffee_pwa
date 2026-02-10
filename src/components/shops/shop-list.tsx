"use client";

import { getCoffeeShops } from "@/actions/coffee-shops";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import * as icons from "lucide-react";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Filter, Loader2, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CoffeeShopCard } from "./shop-card";

export function CoffeeShopList({
    initialShops,
    tags,
    features = [],
    initialSortBy = "name",
    initialSortOrder = "desc"
}: {
    initialShops: any[],
    tags: any[],
    features?: any[],
    initialSortBy?: "name" | "rating",
    initialSortOrder?: "asc" | "desc"
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [shops, setShops] = useState(initialShops);
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState<"name" | "rating">(initialSortBy);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
    const [search, setSearch] = useState("");
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialShops.length >= 10);
    const observerTarget = useRef(null);

    // Sync state with props when server-side navigation happens
    useEffect(() => {
        setShops(initialShops);
        setSortBy(initialSortBy);
        setSortOrder(initialSortOrder);
        setPage(1);
        setHasMore(initialShops.length >= 10);
    }, [initialShops, initialSortBy, initialSortOrder]);

    const handleSortChange = (newSort: "name" | "rating") => {
        let newOrder: "asc" | "desc" = "desc";

        if (newSort === sortBy) {
            newOrder = sortOrder === "asc" ? "desc" : "asc";
        }

        // Update URL will trigger server re-render and update initialShops
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', newSort);
        params.set('sortOrder', newOrder);
        router.push(`/shops?${params.toString()}`, { scroll: false });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = page + 1;

        try {
            const response = await getCoffeeShops({
                page: nextPage,
                limit: 10,
                filter: filter as any,
                featureIds: selectedFeatures,
                search: search,
                sortBy: sortBy,
                sortOrder: sortOrder
            });

            if (response.success && response.data) {
                setShops(prev => {
                    const existingIds = new Set(prev.map(s => s.id));
                    const newShops = response.data!.filter(s => !existingIds.has(s.id));
                    return [...prev, ...newShops];
                });
                setPage(nextPage);
                setHasMore(response.data.length >= 10);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more shops:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading, page, sortBy, sortOrder, filter, search, selectedFeatures]);

    const filteredShops = useMemo(() => {
        return shops.filter(shop => {
            if (search && !shop.name.toLowerCase().includes(search.toLowerCase()) && !shop.address?.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }

            if (selectedFeatures.length > 0) {
                const shopFeatureIds = shop.features?.map((f: any) => f.id) || [];
                if (!selectedFeatures.every(fid => shopFeatureIds.includes(fid))) {
                    return false;
                }
            }

            return true;
        });
    }, [shops, search, selectedFeatures]);

    const toggleFeature = (id: string) => {
        setSelectedFeatures(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-6">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={20} />
                <input
                    type="text"
                    placeholder="Busca por nombre o dirección..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-zinc-50 rounded-3xl py-4 pl-12 pr-14 text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm border border-primary/5"
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

            <div className="space-y-3">
                <div className="flex gap-2 items-center overflow-x-auto pb-2 no-scrollbar -mx-6 px-6 border-t border-primary/5 pt-3">
                    <div className="flex items-center gap-2 mr-2">
                        <ArrowUpDown size={14} className="text-muted-foreground" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ordenar:</span>
                    </div>
                    {[
                        { id: "name", label: "Nombre" },
                        { id: "rating", label: "Rating" }
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => handleSortChange(s.id as any)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5",
                                sortBy === s.id
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-zinc-50 text-foreground/60 border-primary/10 hover:border-primary/20"
                            )}
                        >
                            {s.label}
                            {sortBy === s.id && (
                                sortOrder === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredShops.map((shop) => (
                    <CoffeeShopCard key={shop.id} shop={shop} />
                ))}
                {filteredShops.length === 0 && !loading && (
                    <div className="text-center py-20 bg-zinc-50 rounded-[32px] border border-primary/10/50">
                        <p className="text-foreground/40 font-medium">No se encontraron cafeterías</p>
                    </div>
                )}
            </div>

            <div ref={observerTarget} className="py-8 flex justify-center">
                {loading && (
                    <div className="flex items-center gap-2 text-primary animate-pulse">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-bold">Cargando más...</span>
                    </div>
                )}
                {!hasMore && shops.length > 0 && (
                    <div className="text-zinc-400 text-xs font-medium py-4">
                        Has llegado al final de la lista
                    </div>
                )}
            </div>
        </div>
    );
}
