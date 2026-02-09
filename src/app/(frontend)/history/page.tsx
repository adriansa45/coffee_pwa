import { db } from "@/db";
import { visits, coffee_shops as coffeeShops } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        <div className="p-6 pt-24 pb-28 space-y-6">
            <header className="flex items-center gap-3">
                <Link href="/home" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Historial de Visitas</h1>
                    <p className="text-sm text-gray-500">Tus aventuras cafeteras</p>
                </div>
            </header>

            <div className="space-y-4">
                {history.map((visit) => (
                    <div key={visit.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                <Calendar size={18} />
                            </div>
                            <div className="w-0.5 flex-1 bg-gray-100 my-2"></div>
                        </div>
                        <div className="pb-4">
                            <h3 className="font-bold text-foreground">{visit.shopName}</h3>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <MapPin size={10} /> {visit.shopAddress || "Ubicación no disponible"}
                            </p>
                            <p className="text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-md inline-block">
                                {visit.visitedAt ? new Date(visit.visitedAt).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : ''}
                            </p>
                        </div>
                    </div>
                ))}
                {history.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">Aún no tienes visitas registradas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
