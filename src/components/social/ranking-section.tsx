import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star, Coffee, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RankingItem {
    id: string;
    name: string;
    image?: string | null;
    count: number;
}

interface RankingSectionProps {
    title: string;
    icon: React.ReactNode;
    subtitle: string;
    users: RankingItem[];
    type: "reviews" | "visits" | "followers";
}

export function RankingSection({ title, icon, subtitle, users, type }: RankingSectionProps) {
    const getUnit = (count: number) => {
        if (type === "reviews") return count === 1 ? "reseña" : "reseñas";
        if (type === "visits") return count === 1 ? "visita" : "visitas";
        return count === 1 ? "seguidor" : "seguidores";
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return <Trophy className="text-amber-500" size={16} />;
        if (index === 1) return <Medal className="text-zinc-400" size={16} />;
        if (index === 2) return <Medal className="text-orange-400" size={16} />;
        return null;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900 shadow-sm">
                    {icon}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-zinc-900 leading-none tracking-tight">{title}</h2>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.15em] mt-1">{subtitle}</p>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-zinc-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                {users && users.length > 0 ? (
                    <div className="divide-y divide-zinc-50">
                        {users.map((user, index) => (
                            <Link 
                                key={user.id} 
                                href={`/users/${user.id}`}
                                className="flex items-center gap-4 p-4 hover:bg-zinc-50/80 transition-all group active:scale-[0.99]"
                            >
                                <div className="w-6 flex justify-center shrink-0">
                                    {getRankIcon(index)}
                                </div>

                                <Avatar className="h-10 w-10 border border-zinc-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
                                    <AvatarImage src={user.image || ""} />
                                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                                        {user.name?.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-zinc-900 group-hover:text-primary transition-colors">{user.name}</p>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mt-0.5">
                                        {user.count} {getUnit(user.count)}
                                    </p>
                                </div>

                                <ChevronRight size={14} className="text-zinc-300 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center">
                        <Coffee className="w-8 h-8 text-zinc-100 mx-auto mb-3" />
                        <p className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Aún no hay datos</p>
                    </div>
                )}
            </div>
        </div>
    );
}
