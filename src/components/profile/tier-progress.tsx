"use client";

import { Award, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TierProgressProps {
    totalVisits: number;
    currentTier: string;
}

export function TierProgress({ totalVisits, currentTier }: TierProgressProps) {
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

    return (
        <div className="bg-white rounded-[2.5rem] p-6 border border-primary/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border transition-all duration-500", tierInfo.bg, tierInfo.color, tierInfo.border)}>
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h3 className={cn("text-lg font-black leading-none", tierInfo.color)}>{currentTier}</h3>
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mt-1">Estatus Global</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-foreground leading-none">{totalVisits}</p>
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Visitas Totales</p>
                </div>
            </div>

            {nextTier && (
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <p className="text-xs font-bold text-foreground/60">
                            Faltan <span className="text-foreground">{remaining} visitas</span> para <span className={nextTier.color}>{nextTier.name}</span>
                        </p>
                        <span className="text-[10px] font-black text-foreground/20">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 w-full bg-zinc-50 rounded-full border border-zinc-100 overflow-hidden p-0.5 shadow-inner">
                        <div 
                            className={cn("h-full rounded-full transition-all duration-1000", tierInfo.bar)} 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {!nextTier && (
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center gap-3 animate-pulse">
                    <Award className="text-purple-600" size={20} />
                    <p className="text-xs font-bold text-purple-700">¡Has alcanzado el nivel máximo! Eres una verdadera leyenda.</p>
                </div>
            )}
        </div>
    );
}
