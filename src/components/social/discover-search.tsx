"use client";

import { useState, useEffect, useTransition } from "react";
import { Search, Loader2, User, ChevronRight } from "lucide-react";
import { getAutocompleteUsers } from "@/actions/user";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function DiscoverSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                const res = await getAutocompleteUsers(query);
                if (res.success) {
                    setResults(res.data);
                    setIsOpen(true);
                }
                setIsLoading(false);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.search-container')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative w-full search-container">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="Busca por nombre..."
                    className="w-full bg-muted/50 border-muted rounded-xl py-3.5 pl-11 pr-11 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/10 transition-all h-12"
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 className="animate-spin text-muted-foreground/30" size={16} />
                    </div>
                )}
            </div>

            {/* Autocomplete Results */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.length > 0 ? (
                        <div className="divide-y divide-border/10">
                            {results.map((user) => (
                                <Link
                                    key={user.id}
                                    href={`/users/${user.id}`}
                                    className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Avatar className="h-9 w-9 border border-border/10 shadow-sm">
                                        <AvatarImage src={user.image || ""} />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                                            {user.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Ver perfil</p>
                                    </div>
                                    <ChevronRight size={14} className="text-muted-foreground/50" />
                                </Link>
                            ))}
                            <Link
                                href={`/discover?q=${query}`}
                                className="block p-3 text-center text-[10px] font-bold text-primary uppercase tracking-widest hover:bg-muted/50 transition-colors border-t border-border/10"
                                onClick={() => setIsOpen(false)}
                            >
                                Ver todos los resultados
                            </Link>
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-xs font-semibold text-muted-foreground">No se encontraron usuarios</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
