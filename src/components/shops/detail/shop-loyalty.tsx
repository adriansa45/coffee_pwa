"use client";

import { useEffect, useState } from "react";
import { getUserLoyalty, getShopRewards } from "@/actions/loyalty";
import { authClient } from "@/lib/auth-client";
import { Award, Gift, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ShopLoyaltyProps {
    shopId: string;
    shopName: string;
}

export function ShopLoyalty({ shopId, shopName }: ShopLoyaltyProps) {
    const { data: session } = authClient.useSession();
    const [loyaltyData, setLoyaltyData] = useState<any>(null);
    const [availableRewards, setAvailableRewards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            Promise.all([
                getUserLoyalty(session.user.id, shopId),
                getShopRewards(shopId)
            ]).then(([loyalty, rewards]) => {
                if (loyalty.success) setLoyaltyData(loyalty.data);
                if (rewards.success) setAvailableRewards(rewards.data as any[]);
                setLoading(false);
            });
        } else {
             getShopRewards(shopId).then(rewards => {
                if (rewards.success) setAvailableRewards(rewards.data as any[]);
                setLoading(false);
            });
        }
    }, [shopId, session?.user?.id]);

    if (loading) return <div className="animate-pulse h-32 bg-zinc-50 rounded-3xl" />;
    
    if (availableRewards.length === 0) return null;

    const currentVisits = loyaltyData?.totalVisits || 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[1.25rem] font-bold text-foreground leading-none">Programa de Lealtad</h3>
                {session?.user && (
                    <div className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {currentVisits} {currentVisits === 1 ? 'visita' : 'visitas'}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {availableRewards.map((reward) => {
                    const isUnlocked = currentVisits >= Number(reward.visitsRequired);
                    const progress = Math.min((currentVisits / Number(reward.visitsRequired)) * 100, 100);
                    
                    return (
                        <div 
                            key={reward.id} 
                            className={cn(
                                "p-5 rounded-[2rem] border transition-all relative overflow-hidden",
                                isUnlocked 
                                    ? "bg-primary/5 border-primary/20 shadow-sm" 
                                    : "bg-white border-zinc-100"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                    isUnlocked ? "bg-primary text-white" : "bg-zinc-100 text-zinc-400"
                                )}>
                                    {isUnlocked ? <Gift size={24} /> : <Lock size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className={cn("font-bold text-sm", isUnlocked ? "text-primary" : "text-zinc-600")}>
                                            {reward.name}
                                        </h4>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 font-medium mb-3">
                                        {reward.description || `Desbloquéalo con ${reward.visitsRequired} visitas`}
                                    </p>
                                    
                                    {!isUnlocked && (
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                                                <span>Progreso</span>
                                                <span>{currentVisits} / {reward.visitsRequired}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary/40 transition-all duration-1000" 
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {isUnlocked && (
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase">
                                            <CheckCircle2 size={12} />
                                            ¡Desbloqueado!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!session?.user && (
                <p className="text-[10px] text-zinc-400 text-center font-medium italic">
                    Inicia sesión para empezar a acumular visitas y ganar premios.
                </p>
            )}
        </div>
    );
}
