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
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-muted-foreground">Faltan {remaining} para {nextTier.name}</span>
                            <span className="text-primary font-bold">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-muted/50" indicatorClassName="bg-primary" />
                    </div>
                )}
            </Card>
        );
    }

    return (
        <Card className="rounded-xl p-6 border-border flex flex-col gap-6 bg-card">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl flex items-center justify-center border border-primary/20 bg-primary/10 text-primary transition-all duration-500">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-bold leading-none text-primary tracking-tight uppercase">{currentTier}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Estatus Global</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-foreground leading-none">{totalVisits}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Visitas Totales</p>
                </div>
            </div>

            {nextTier && (
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                        <p className="text-xs font-bold text-muted-foreground">
                            Faltan <span className="text-foreground">{remaining} visitas</span> para <span className="text-primary">{nextTier.name}</span>
                        </p>
                        <span className="text-[10px] font-bold text-muted-foreground/40">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-muted p-0.5 rounded-md" indicatorClassName="bg-primary rounded-sm transition-all duration-1000" />
                </div>
            )}

            {!nextTier && (
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3 animate-pulse">
                    <Award className="text-primary" size={20} />
                    <p className="text-xs font-bold text-primary">¡Has alcanzado el nivel máximo! Eres una verdadera leyenda.</p>
                </div>
            )}
        </Card>
    );
}
