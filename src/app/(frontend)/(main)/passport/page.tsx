import { db } from "@/db";
import { visits, coffee_shops as coffeeShops, unlockedRewards, rewards } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, count, desc, and } from "drizzle-orm";
import { Coffee, ChevronRight, Award, Trophy } from "lucide-react";
import Link from "next/link";
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
        <div className="p-6 pt-24 pb-28 space-y-8 animate-in fade-in duration-500">
            <header className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-foreground">Tu Pasaporte</h1>
                <p className="text-sm font-medium text-foreground/40">
                    Has acumulado <span className="text-primary font-bold">{data.totalVisits}</span> visitas en total
                </p>
            </header>

            {/* Resume Section */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-3xl border border-primary/10 shadow-sm space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Award size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-black">{data.unlocked.length}</p>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Premios</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-primary/10 shadow-sm space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                        <Trophy size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-black">{data.shopStats.length}</p>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Cafeterías</p>
                    </div>
                </div>
            </div>

            {/* Shops List */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider ml-1">Tus Cafeterías</h3>
                <div className="space-y-3">
                    {data.shopStats.map((stat) => (
                        <Link 
                            key={stat.shopId} 
                            href={`/shops/${stat.shopId}`}
                            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/5 hover:border-primary/20 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-primary/5 transition-colors">
                                    <Coffee className="text-zinc-400 group-hover:text-primary transition-colors" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{stat.shopName}</h4>
                                    <p className="text-[10px] text-foreground/40 font-medium truncate max-w-[150px]">{stat.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-primary font-black text-sm">{stat.visitCount}</span>
                                <ChevronRight size={16} className="text-foreground/20" />
                            </div>
                        </Link>
                    ))}
                    {data.shopStats.length === 0 && (
                        <div className="p-8 text-center bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                            <p className="text-xs text-zinc-400 font-medium">Empieza a escanear QRs para llenar tu pasaporte</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Unlocked Rewards List */}
            {data.unlocked.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider ml-1">Recompensas Desbloqueadas</h3>
                    <div className="space-y-3">
                        {data.unlocked.map((reward) => (
                            <div key={reward.id} className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                                    <Award size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-primary">{reward.rewardName}</h4>
                                    <p className="text-[10px] font-bold opacity-60 uppercase">{reward.shopName}</p>
                                </div>
                                <div className="text-[10px] font-bold text-primary/40">
                                    {new Date(reward.unlockedAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
