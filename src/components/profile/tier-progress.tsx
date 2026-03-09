"use client";

import { Award, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TierProgressProps {
    totalVisits: number;
    currentTier: string;
    variant?: "default" | "mini";
}

export function TierProgress({ totalVisits, currentTier, variant = "default" }: TierProgressProps) {
    const tiers = [
        { name: "Explorador/a", min: 0, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", bar: "bg-emerald-500" },
        { name: "Coffee Lover", min: 11, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", bar: "bg-blue-500" },
        { name: "Barista Pro", min: 31, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", bar: "bg-amber-500" },
        { name: "Coffee Legend", min: 71, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", bar: "bg-purple-500" },
    ];

    const currentIdx = tiers.findIndex(t => t.name === currentTier) === -1 ? 0 : tiers.findIndex(t => t.name === currentTier);
    const nextTier = tiers[currentIdx + 1];
    
    // Calculate progress to next tier
    let progress = 100;
    let remaining = 0;
    
    if (nextTier) {
        const currentMin = tiers[currentIdx].min;
        const nextMin = nextTier.min;
        progress = Math.max(0, Math.min(100, ((totalVisits - currentMin) / (nextMin - currentMin)) * 100));
        remaining = nextMin - totalVisits;
    }

    const tierInfo = tiers[currentIdx];

    const totalSegments = 15;
    const filledSegments = Math.round((progress / 100) * totalSegments);
    const nextTierColor = nextTier ? nextTier.bar : "bg-primary";

    if (variant === "mini") {
        return (
            <Card className="bg-card/40 backdrop-blur-md rounded-xl p-5 border-border flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("size-10 rounded-xl flex items-center justify-center border border-primary/20 bg-primary/10 text-primary")}>
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-sm font-bold leading-none text-foreground uppercase">{currentTier}</h3>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Estatus Global</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-foreground leading-none">{totalVisits}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Visitas</p>
                    </div>
                </div>

                {nextTier && (
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <span>Faltan {remaining} para {nextTier.name}</span>
                            <span className="text-foreground">{Math.round(progress)}%</span>
                        </div>
                        {/* Segmented Bar for Mini Variant */}
                        <div className="flex gap-1 h-2 w-full">
                            {Array.from({ length: totalSegments }).map((_, i) => (
                                <div 
                                    key={i}
                                    className={cn(
                                        "flex-1 rounded-full transition-all duration-500",
                                        i < filledSegments 
                                            ? cn(nextTierColor, "opacity-100 shadow-[0_0_8px_rgba(59,130,246,0.3)]") 
                                            : "bg-white/10"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        );
    }

    return (
        <Card className="rounded-3xl p-6 border-border/50 flex flex-col gap-8 bg-card shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl flex items-center justify-center border border-primary/20 bg-primary/10 text-primary transition-all duration-500">
                        <Zap size={28} fill="currentColor" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-2xl font-black leading-none text-foreground tracking-tighter uppercase">{currentTier}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Estatus Global</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-foreground leading-none tracking-tighter">{totalVisits}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Visitas Totales</p>
                </div>
            </div>

            {nextTier && (
                <div className="flex flex-col gap-5 relative z-10">
                    <div className="flex justify-between items-end">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Faltan <span className="text-foreground">{remaining} visitas</span> para <span className="text-primary">{nextTier.name}</span>
                        </p>
                        <span className="text-xs font-black text-foreground">{Math.round(progress)}%</span>
                    </div>
                    
                    {/* Segmented Progress Bar - Steps styling */}
                    <div className="flex gap-2 h-2.5 w-full">
                        {Array.from({ length: totalSegments }).map((_, i) => (
                            <div 
                                key={i}
                                className={cn(
                                    "flex-1 rounded-full transition-all duration-500 ease-out",
                                    i < filledSegments 
                                        ? cn(nextTierColor, "shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)] border-t border-white/20") 
                                        : "bg-white/10"
                                )}
                                style={i < filledSegments ? { 
                                    transitionDelay: `${i * 40}ms`
                                } : {}}
                            />
                        ))}
                    </div>
                </div>
            )}

            {!nextTier && (
                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-3 animate-in fade-in zoom-in duration-700">
                    <Award className="text-primary" size={24} />
                    <p className="text-xs font-bold text-primary uppercase tracking-widest leading-relaxed">¡Has alcanzado el nivel máximo! Eres una leyenda.</p>
                </div>
            )}
        </Card>
    );
}
