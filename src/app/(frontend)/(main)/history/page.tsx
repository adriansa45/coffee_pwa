import { db } from "@/db";
import { visits, coffee_shops as coffeeShops } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

async function getFullHistory() {
    "use server";
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return [];

    return await db
        .select({
            id: visits.id,
            visitedAt: visits.visitedAt,
            shopName: coffeeShops.name,
            shopAddress: coffeeShops.address,
        })
        .from(visits)
        .innerJoin(coffeeShops, eq(visits.shopId, coffeeShops.id))
        .where(eq(visits.userId, session.user.id))
        .orderBy(desc(visits.visitedAt));
}

export default async function HistoryPage() {
    const history = await getFullHistory();

    return (
        <div className="min-h-screen bg-background pb-28">
            {/* Header Area */}
            <header className="px-6 pt-16 pb-8 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-2">
                    <Link href="/home" className="p-2 -ml-2 rounded-full text-muted-foreground hover:bg-muted/50 transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">Mi Historial</h1>
                        <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mt-1">Tus aventuras cafeteras</p>
                    </div>
                </div>
            </header>

            <div className="px-6 flex flex-col gap-6">
                {history.map((visit) => (
                    <Card key={visit.id} className="p-5 border-border/40 bg-card/50 backdrop-blur-sm shadow-lg hover:border-primary/30 transition-all duration-300 group">
                        <div className="flex gap-5">
                            <div className="flex flex-col items-center">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                                    <Calendar size={22} />
                                </div>
                                <div className="w-0.5 flex-1 bg-border/20 my-2"></div>
                            </div>
                            <div className="flex-1 flex flex-col gap-2 pt-1">
                                <h3 className="text-lg font-black text-foreground uppercase tracking-tight leading-none group-hover:text-primary transition-colors">{visit.shopName}</h3>
                                <div className="flex flex-col gap-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                        <MapPin size={12} className="text-primary/60" /> 
                                        {visit.shopAddress || "Ubicación no disponible"}
                                    </p>
                                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 w-fit">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                                            {visit.visitedAt ? new Date(visit.visitedAt).toLocaleDateString(undefined, {
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                
                {history.length === 0 && (
                    <div className="text-center py-20 bg-muted/20 rounded-[32px] border-2 border-dashed border-border/40 flex flex-col items-center gap-3">
                        <div className="size-12 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground/30">
                            <Calendar size={24} />
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Aún no tienes visitas registradas</p>
                    </div>
                )}
            </div>
        </div>
    );
}
