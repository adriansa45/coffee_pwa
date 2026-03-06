"use client";

import { useEffect, useState } from "react";
import { getShopDashboardMetrics } from "@/actions/loyalty";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/components/theme-provider";
import { 
    Users, 
    Calendar, 
    TrendingUp, 
    Award, 
    Trophy,
    ArrowLeft,
    Loader2,
    MoreHorizontal,
    UserCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ShopAdminDashboard() {
    const { data: session, isPending: authPending } = authClient.useSession();
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { brandColor } = useTheme();
    const router = useRouter();

    const shopId = (session?.user as any)?.shopId;

    useEffect(() => {
        if (shopId) {
            getShopDashboardMetrics(shopId).then(res => {
                if (res.success) setMetrics(res.data);
                setLoading(false);
            });
        }
    }, [shopId]);

    if (authPending || loading) {
        return (
            <div className="w-full h-full min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!session || !["coffee_shop", "CafeAdmin"].includes((session.user as any).role)) {
        router.push("/auth/login");
        return null;
    }

    return (
        <div className="p-6 pt-18 pb-28 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/home"
                        className="p-2 rounded-xl bg-white border border-primary/10 shadow-sm active:scale-95 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" style={{ color: brandColor }} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight" style={{ color: brandColor }}>
                            Admin Dashboard
                        </h1>
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest leading-none mt-1">
                            Tu Cafetería
                        </p>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <UserCircle size={24} />
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Visitas Totales" 
                    value={metrics?.totalVisits || 0} 
                    icon={Calendar} 
                    color="text-blue-600" 
                    bg="bg-blue-50" 
                />
                <StatCard 
                    title="Usuarios Únicos" 
                    value={metrics?.uniqueUsers || 0} 
                    icon={Users} 
                    color="text-indigo-600" 
                    bg="bg-indigo-50" 
                />
                <StatCard 
                    title="Recurrentes" 
                    value={metrics?.recurrentUsers || 0} 
                    icon={TrendingUp} 
                    color="text-emerald-600" 
                    bg="bg-emerald-50" 
                />
                <StatCard 
                    title="Premios Dados" 
                    value={metrics?.rewardStats?.reduce((acc: any, curr: any) => acc + Number(curr.unlockCount), 0) || 0} 
                    icon={Award} 
                    color="text-amber-600" 
                    bg="bg-amber-50" 
                />
            </div>

            {/* Bottom Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Top Clients */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider ml-1">Top Clientes</h3>
                    <div className="bg-white rounded-[2.5rem] border border-primary/10 shadow-sm overflow-hidden divide-y divide-primary/5">
                        {metrics?.topClients?.map((client: any, i: number) => (
                            <div key={client.userId} className="flex items-center justify-between p-4 px-6 hover:bg-primary/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center font-bold text-xs text-foreground/40 overflow-hidden">
                                        {client.image ? (
                                            <img src={client.image} alt={client.name} className="w-full h-full object-cover" />
                                        ) : (
                                            client.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{client.name}</h4>
                                        <p className="text-[10px] font-bold text-foreground/40 uppercase">Cliente VIP</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-primary leading-none">{client.visitCount}</p>
                                    <p className="text-[9px] font-bold text-foreground/40 uppercase">Visitas</p>
                                </div>
                            </div>
                        ))}
                        {!metrics?.topClients?.length && (
                            <p className="p-8 text-center text-xs text-foreground/40 font-medium">No hay clientes frecuentes aún</p>
                        )}
                    </div>
                </div>

                {/* Popular Rewards */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider ml-1">Premios Desbloqueados</h3>
                    <div className="bg-white rounded-[2.5rem] border border-primary/10 shadow-sm p-6 space-y-6">
                        {metrics?.rewardStats?.map((reward: any) => (
                            <div key={reward.rewardName} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold">{reward.rewardName}</span>
                                    <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{reward.unlockCount}</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary transition-all duration-1000" 
                                        style={{ width: `${(reward.unlockCount / (metrics?.totalVisits || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                         {!metrics?.rewardStats?.length && (
                            <p className="py-4 text-center text-xs text-foreground/40 font-medium italic">Sin datos de premios todavía</p>
                        )}
                    </div>
                </div>

            </div>

            {/* Actions Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Link 
                    href="/staff/scan"
                    className="flex flex-col items-center justify-center p-8 bg-primary rounded-[2.5rem] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-white space-y-3"
                 >
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <span className="font-black text-lg">Registrar Visita</span>
                    <span className="text-xs font-medium opacity-80">Escanear QR de cliente</span>
                 </Link>

                 <div className="grid grid-cols-1 gap-4">
                    <button className="flex items-center justify-between p-6 bg-white rounded-2xl border border-primary/10 shadow-sm hover:border-primary/30 transition-all font-bold group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Award size={20} />
                            </div>
                            <span>Gestionar Premios</span>
                        </div>
                        <MoreHorizontal className="text-foreground/20 group-hover:text-primary transition-colors" />
                    </button>
                    <button className="flex items-center justify-between p-6 bg-white rounded-2xl border border-primary/10 shadow-sm hover:border-primary/30 transition-all font-bold group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Trophy size={20} />
                            </div>
                            <span>Editar Insignias</span>
                        </div>
                        <MoreHorizontal className="text-foreground/20 group-hover:text-primary transition-colors" />
                    </button>
                 </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-5 rounded-3xl border border-primary/10 shadow-sm space-y-3 hover:border-primary/30 transition-all">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", bg, color)}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-2xl font-black tracking-tight leading-none">{value}</p>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider mt-1">{title}</p>
            </div>
        </div>
    );
}
