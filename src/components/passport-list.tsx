"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { PassportStamp } from "@/components/passport-stamp";
import { getCoffeeShops } from "@/actions/coffee-shops";
import { Loader2, Search, ArrowUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "collected" | "missing";

interface Shop {
    id: string;
    name: string;
    isVisited: boolean;
    visitedAt: string | null;
}

export function PassportList({ initialShops }: { initialShops?: Shop[] }) {
    const [shops, setShops] = useState<Shop[]>(initialShops || []);
    const [filter, setFilter] = useState<FilterType>("all");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Scroll listener for FAB
    useEffect(() => {
        const mainElement = document.querySelector('main');
        if (!mainElement) return;

        const handleScroll = () => {
            if (mainElement.scrollTop > 10) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        mainElement.addEventListener("scroll", handleScroll);
        // Check initial position
        handleScroll();

        return () => mainElement.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        const mainElement = document.querySelector('main');
        mainElement?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const loadShops = async (pageNum: number, currentFilter: FilterType, search: string, reset = false) => {
        if (loading) return;
        setLoading(true);
        try {
            // @ts-ignore
            const result = await getCoffeeShops({
                page: pageNum,
                limit: 10,
                filter: currentFilter,
                search: search // Ensure getCoffeeShops supports this
            });
            if (result.success && result.data) {
                // @ts-ignore
                setShops((prev) => (reset ? result.data : [...prev, ...result.data]));
                setHasMore(result.hasMore);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (value: string) => {
        const newFilter = value as FilterType;
        setFilter(newFilter);
        setPage(1);
        setShops([]);
        setHasMore(true);
        loadShops(1, newFilter, debouncedSearch, true);
    };

    // Effect for Search
    useEffect(() => {
        setPage(1);
        setShops([]);
        setHasMore(true);
        loadShops(1, filter, debouncedSearch, true);
    }, [debouncedSearch]);


    const lastElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    const nextPage = page + 1;
                    loadShops(nextPage, filter, debouncedSearch);
                    setPage(nextPage);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore, filter, page, debouncedSearch]
    );

    return (
        <div className="space-y-6 pb-20">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Buscar cafetería..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-white border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60/20 transition-shadow shadow-sm"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <div className="grid w-full grid-cols-3 bg-primary/10/50 p-1 rounded-2xl mb-6 text-sm">
                <button
                    type="button"
                    onClick={() => handleFilterChange("all")}
                    className={`rounded-xl py-1.5 font-medium ${filter === 'all' ? 'bg-white text-foreground/90 shadow-sm' : ''}`}
                >
                    Todos
                </button>
                <button
                    type="button"
                    onClick={() => handleFilterChange("collected")}
                    className={`rounded-xl py-1.5 font-medium ${filter === 'collected' ? 'bg-white text-foreground/90 shadow-sm' : ''}`}
                >
                    Coleccionados
                </button>
                <button
                    type="button"
                    onClick={() => handleFilterChange("missing")}
                    className={`rounded-xl py-1.5 font-medium ${filter === 'missing' ? 'bg-white text-foreground/90 shadow-sm' : ''}`}
                >
                    Faltantes
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {shops.map((shop, index) => (
                    <div key={shop.id} ref={index === shops.length - 1 ? lastElementRef : null}>
                        <PassportStamp
                            id={shop.id}
                            name={shop.name}
                            date={shop.visitedAt}
                            collected={shop.isVisited}
                        />
                    </div>
                ))}
                {shops.length === 0 && !loading && (
                    <p className="col-span-2 text-center text-sm text-gray-500 py-10">No se encontraron cafeterías.</p>
                )}
            </div>

            {loading && (
                <div className="flex justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary/60" />
                </div>
            )}

            {/* Scroll to Top FAB */}
            <button
                onClick={scrollToTop}
                className={cn(
                    "fixed bottom-24 right-4 z-50 w-12 h-12 bg-white/80 backdrop-blur-md border border-gray-200 text-primary rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
                    showScrollTop ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
                )}
            >
                <ArrowUp size={20} strokeWidth={2.5} />
            </button>
        </div>
    );
}
