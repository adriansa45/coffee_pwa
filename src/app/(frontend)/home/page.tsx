import { getVisitStats, getLeaderboard } from "@/actions/stats";
import { Coffee, Trophy, User, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function HomePage() {
    const { data: stats } = await getVisitStats();
    // Get global leaderboard preview (top 3)
    const { data: leaderboard } = await getLeaderboard();

    if (!stats) return null; // Or skeleton

    const { totalVisits, recentVisits, frequentVisits, userName } = stats;

    return (
        <div className="p-6 pt-24 pb-28 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-brand-950">
                    Hola, <span className="text-brand-600">{userName}</span> 👋
                </h1>
                <p className="text-brand-900/60 font-medium mt-1">
                    ¿Listo para tu próxima taza de café?
                </p>
            </div>

            {/* Main Stats Card */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <Coffee className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 rotate-12" />
                <div className="relative z-10">
                    <p className="text-brand-100 text-sm font-medium mb-1">Total de Visitas</p>
                    <h2 className="text-5xl font-bold mb-4">{totalVisits}</h2>
                    <div className="flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                        <Trophy size={12} className="text-yellow-300" />
                        <span>¡Sigue explorando!</span>
                    </div>
                </div>
            </div>

            {/* Leaderboard Preview */}
            <section>
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold text-brand-950">Top Exploradores</h3>
                    <Link href="/leaderboard" className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">
                        Ver todo <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-4">
                    {leaderboard?.slice(0, 3).map((user, index) => (
                        <div key={user.userId} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                index === 1 ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                                    'bg-orange-100 text-orange-800 border border-orange-200'
                                }`}>
                                #{index + 1}
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage src={user.userImage || ""} />
                                <AvatarFallback className="bg-brand-100 text-brand-700 font-bold text-xs">
                                    {user.userName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-brand-950 truncate">{user.userName}</p>
                                <p className="text-xs text-brand-500 font-semibold">{user.visitCount} visitas</p>
                            </div>
                            {index === 0 && <Trophy className="text-yellow-500 w-5 h-5 fill-current" />}
                        </div>
                    ))}
                    {!leaderboard?.length && <p className="text-sm text-gray-400 text-center py-2">No hay datos aún.</p>}
                </div>
            </section>


            {/* Recent Activity Timeline Card */}
            <section>
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold text-brand-950">Actividad Reciente</h3>
                    <Link href="/history" className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">
                        Ver historial <ArrowRight size={12} />
                    </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="relative pl-2">
                        {/* Vertical Line */}
                        <div className="absolute left-[27px] top-2 bottom-4 w-0.5 bg-gray-100"></div>

                        <div className="space-y-6">
                            {recentVisits?.slice(0, 5).map((visit) => (
                                <div key={visit.id} className="relative flex items-start gap-4">
                                    {/* Timeline Dot */}
                                    <div className="z-10 w-10 h-10 rounded-full bg-brand-50 border-1 border-white flex items-center justify-center shrink-0 shadow-sm"> {/* slight fix border-4 -> border-1 visually maybe? No user didn't ask, keep border-4 */}
                                        <div className="w-10 h-10 rounded-full bg-brand-50 border-4 border-white flex items-center justify-center shrink-0 shadow-sm">
                                            <Calendar size={16} className="text-brand-600" />
                                        </div>
                                    </div>

                                    {/* Logic for item mapping same as before, just need to be careful with structure */}
                                    {/* Content */}
                                    <div className="flex-1 pt-1">
                                        <h4 className="font-bold text-brand-950 text-sm">{visit.shopName}</h4>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {visit.visitedAt ? new Date(visit.visitedAt).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' }) : ''}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(!recentVisits || recentVisits.length === 0) && (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Aún no has registrado visitas.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Frequent Shops */}
            <section>
                <h3 className="text-lg font-bold text-brand-950 mb-4">Tus Favoritos</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none]">
                    {frequentVisits?.map((shop) => (
                        <div key={shop.shopId} className="min-w-[140px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-3 shadow-sm">
                                <Coffee size={24} />
                            </div>
                            <h4 className="font-bold text-brand-950 text-xs line-clamp-2 h-8">{shop.shopName}</h4>
                            <span className="mt-2 text-[10px] font-bold bg-brand-50 text-brand-700 px-2 py-1 rounded-full border border-brand-100">
                                {Number(shop.visitCount)} Visitas
                            </span>
                        </div>
                    ))}
                    {(!frequentVisits || frequentVisits.length === 0) && (
                        <p className="text-sm text-gray-500 w-full text-center py-4">No hay favoritos aún.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
