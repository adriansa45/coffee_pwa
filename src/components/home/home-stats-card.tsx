"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeStatsCardProps {
    totalVisits: number;
    currentTier: string;
}

export function HomeStatsCard({ totalVisits, currentTier }: HomeStatsCardProps) {
    const tiers = [
        { name: "Explorador/a", min: 0, max: 10 },
        { name: "Coffee Lover", min: 11, max: 30 },
        { name: "Barista Pro", min: 31, max: 70 },
        { name: "Coffee Legend", min: 71, max: Infinity },
    ];

    const currentIdx = tiers.findIndex(t => t.name === currentTier) === -1 ? 0 : tiers.findIndex(t => t.name === currentTier);
    const tier = tiers[currentIdx];
    const nextTier = tiers[currentIdx + 1];
    
    let progress = 100;
    let remaining = 0;
    
    if (nextTier) {
        const currentMin = tier.min;
        const nextMin = nextTier.min;
        progress = Math.max(0, Math.min(100, ((totalVisits - currentMin) / (nextMin - currentMin)) * 100));
        remaining = nextMin - totalVisits;
    }

    return (
        <Card className="bg-card border-border p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-bold leading-none text-foreground uppercase tracking-tight">{currentTier}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Estatus Global</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-foreground leading-none">{totalVisits}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Visitas Totales</p>
                </div>
            </div>

            {nextTier ? (
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                        <p className="text-xs font-bold text-muted-foreground">
                            Faltan <span className="text-foreground">{remaining} visitas</span> para <span className="text-primary">{nextTier.name}</span>
                        </p>
                        <span className="text-[10px] font-bold text-muted-foreground/40">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative pt-1">
                        <Progress value={progress} className="h-2 bg-muted rounded-full" indicatorClassName="bg-primary rounded-full transition-all duration-1000" />
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-3">
                    <Award className="text-primary" size={20} />
                    <p className="text-xs font-bold text-primary">¡Nivel Máximo Alcanzado!</p>
                </div>
            )}
        </Card>
    );
}
