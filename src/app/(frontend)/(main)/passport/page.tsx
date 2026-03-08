import { db } from "@/db";
import { visits, coffee_shops as coffeeShops, unlockedRewards, rewards } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, count, desc, and } from "drizzle-orm";
import { Coffee, ChevronRight, Award, Trophy } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getPassportData() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return null;

    // Get visits grouped by shop
    const shopStats = await db.select({
        shopId: coffeeShops.id,
        shopName: coffeeShops.name,
        address: coffeeShops.address,
        visitCount: count(visits.id),
    })
    .from(visits)
    .innerJoin(coffeeShops, eq(visits.shopId, coffeeShops.id))
    .where(eq(visits.userId, session.user.id))
    .groupBy(coffeeShops.id, coffeeShops.name, coffeeShops.address)
    .orderBy(desc(count(visits.id)));

    // Get unlocked rewards
    const unlocked = await db.select({
        id: unlockedRewards.id,
        rewardName: rewards.name,
        shopName: coffeeShops.name,
        unlockedAt: unlockedRewards.unlockedAt
    })
    .from(unlockedRewards)
    .innerJoin(rewards, eq(unlockedRewards.rewardId, rewards.id))
    .innerJoin(coffeeShops, eq(rewards.shopId, coffeeShops.id))
    .where(eq(unlockedRewards.userId, session.user.id))
    .orderBy(desc(unlockedRewards.unlockedAt));

    return { shopStats, unlocked, totalVisits: shopStats.reduce((acc, s) => acc + s.visitCount, 0) };
}

export default async function PassportPage() {
    const data = await getPassportData();

    if (!data) return null;

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header Area */}
            <header className="px-6 pt-16 pb-8 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">Mi Pasaporte</h1>
                <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mt-1">
                    Has acumulado <span className="text-primary">{data.totalVisits}</span> visitas en total
                </p>
            </header>

            <div className="px-6 flex flex-col gap-10">
                {/* Resume Section */}
                <div className="grid grid-cols-2 gap-5">
                    <Card className="p-5 border-border/40 bg-card/50 backdrop-blur-sm shadow-xl flex flex-col gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <Award size={22} />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-3xl font-black text-foreground leading-none">{data.unlocked.length}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Premios</p>
                        </div>
                    </Card>
                    <Card className="p-5 border-border/40 bg-card/50 backdrop-blur-sm shadow-xl flex flex-col gap-3">
                        <div className="size-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent shadow-inner">
                            <Trophy size={22} />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-3xl font-black text-foreground leading-none">{data.shopStats.length}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Cafeterías</p>
                        </div>
                    </Card>
                </div>

                {/* Shops List */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">Tus Cafeterías</h3>
                    <div className="flex flex-col gap-3">
                        {data.shopStats.map((stat) => (
                            <Link 
                                key={stat.shopId} 
                                href={`/shops/${stat.shopId}`}
                                className="block group"
                            >
                                <Card className="flex items-center justify-between p-4 border-border/40 bg-card/50 backdrop-blur-sm group-hover:border-primary/30 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                            <Coffee className="size-6 transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-black text-sm uppercase text-foreground group-hover:text-primary transition-colors">{stat.shopName}</h4>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide truncate max-w-[150px]">{stat.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary font-black text-lg">{stat.visitCount}</span>
                                        <ChevronRight size={16} className="text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                        {data.shopStats.length === 0 && (
                            <div className="p-10 text-center bg-muted/20 rounded-[32px] border-2 border-dashed border-border/40 flex flex-col items-center gap-2">
                                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest text-center">Empieza a escanear QRs para llenar tu pasaporte</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Unlocked Rewards List */}
                {data.unlocked.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">Recompensas</h3>
                        <div className="flex flex-col gap-3">
                            {data.unlocked.map((reward) => (
                                <Card key={reward.id} className="p-4 bg-primary/10 border-primary/20 flex items-center gap-4 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 size-16 bg-primary/5 rounded-bl-full -mr-4 -mt-4 group-hover:size-20 transition-all duration-700" />
                                    <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-lg shadow-primary/20 z-10">
                                        <Award size={22} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1 z-10">
                                        <h4 className="font-black text-sm text-foreground uppercase tracking-tight">{reward.rewardName}</h4>
                                        <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{reward.shopName}</p>
                                    </div>
                                    <div className="text-[9px] font-black text-primary/40 uppercase z-10">
                                        {new Date(reward.unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
