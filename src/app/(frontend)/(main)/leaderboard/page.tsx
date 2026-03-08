"use client";

import { getCoffeeShops } from "@/actions/coffee-shops";
import { getLeaderboard } from "@/actions/stats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { ArrowLeft, Filter, Loader2, Medal, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserRank {
    userId: string;
    userName: string | null;
    userImage: string | null;
    visitCount: number;
}

interface Shop {
    id: string;
    name: string;
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<UserRank[]>([]);
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShopId, setSelectedShopId] = useState<string>("all");
    const [selectedShopName, setSelectedShopName] = useState<string>("Global");

    useEffect(() => {
        // Load shops for filter
        getCoffeeShops({ limit: 100 }).then(res => {
            if (res.success && 'data' in res) {
                setShops(res.data as Shop[]);
            }
        });
    }, []);

    useEffect(() => {
        fetchLeaderboard(selectedShopId);
    }, [selectedShopId]);

    const fetchLeaderboard = async (shopId: string) => {
        setLoading(true);
        try {
            const res = await getLeaderboard({ shopId });
            if (res.success && 'data' in res) {
                setLeaderboard(res.data as UserRank[]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleShopSelect = (shopId: string, shopName: string) => {
        setSelectedShopId(shopId);
        setSelectedShopName(shopName);
    };

    return (
        <div className="p-6 pt-24 pb-28 space-y-6">
            <header className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/home" className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
                        <p className="text-foreground/60 text-sm">Top exploradores - <span className="text-primary font-bold">{selectedShopName}</span></p>
                    </div>
                </div>

                <Drawer>
                    <DrawerTrigger asChild>
                        <button className="w-10 h-10 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
                            <Filter size={20} />
                        </button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle>Filtrar por Cafetería</DrawerTitle>
                                <DrawerDescription>Ver quién ha visitado más una cafetería específica.</DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 h-[50vh] overflow-y-auto">
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleShopSelect("all", "Global")}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors",
                                            selectedShopId === 'all' ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        🌍 Global (Todas las cafeterías)
                                    </button>
                                    <div className="h-px bg-border my-2" />
                                    {shops.map(shop => (
                                        <button
                                            key={shop.id}
                                            onClick={() => handleShopSelect(shop.id, shop.name)}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors truncate",
                                                selectedShopId === shop.id ? "bg-primary text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            {shop.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button className="w-full bg-primary text-primary-foreground font-bold h-12 rounded-xl">Listo</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Top 3 Podium (Visual) if more than 3 users */}
                    {leaderboard.length >= 3 && (
                        <div className="flex justify-center items-end gap-2 mb-8 px-4">
                            {/* 2nd Place */}
                            <div className="flex flex-col items-center">
                                <Avatar className="w-14 h-14 border-4 border-muted">
                                    <AvatarImage src={leaderboard[1].userImage || ""} />
                                    <AvatarFallback>{leaderboard[1].userName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted w-20 h-24 rounded-t-xl flex flex-col items-center justify-start pt-2 mt-[-10px] relative z-[-1] shadow-sm">
                                    <span className="text-2xl font-bold text-muted-foreground/50">2</span>
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-xs font-bold text-foreground w-20 truncate">{leaderboard[1].userName}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold">{leaderboard[1].visitCount} pts</p>
                                </div>
                            </div>

                            {/* 1st Place */}
                            <div className="flex flex-col items-center z-10">
                                <div className="relative">
                                    <Avatar className="w-20 h-20 border-4 border-yellow-300">
                                        <AvatarImage src={leaderboard[0].userImage || ""} />
                                        <AvatarFallback>{leaderboard[0].userName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Trophy className="absolute -top-3 -right-2 text-yellow-500 w-8 h-8 fill-current drop-shadow-sm" />
                                </div>
                                <div className="bg-gradient-to-b from-yellow-300 to-yellow-400 w-24 h-32 rounded-t-xl flex flex-col items-center justify-start pt-3 mt-[-15px] relative z-[-1] shadow-md">
                                    <span className="text-4xl font-bold text-yellow-700/50">1</span>
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-sm font-bold text-foreground w-24 truncate">{leaderboard[0].userName}</p>
                                    <p className="text-xs text-primary font-bold">{leaderboard[0].visitCount} pts</p>
                                </div>
                            </div>

                            {/* 3rd Place */}
                            <div className="flex flex-col items-center">
                                <Avatar className="w-14 h-14 border-4 border-orange-200">
                                    <AvatarImage src={leaderboard[2].userImage || ""} />
                                    <AvatarFallback>{leaderboard[2].userName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="bg-orange-200 w-20 h-16 rounded-t-xl flex flex-col items-center justify-start pt-2 mt-[-10px] relative z-[-1] shadow-sm">
                                    <span className="text-2xl font-bold text-orange-700/50">3</span>
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-xs font-bold text-foreground w-20 truncate">{leaderboard[2].userName}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold">{leaderboard[2].visitCount} pts</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* List for everyone */}
                    <div className="bg-card rounded-xl p-2 shadow-sm border border-border">
                        {leaderboard.map((user, index) => (
                            <div key={user.userId} className={cn(
                                "flex items-center gap-4 p-3 rounded-xl transition-colors",
                                index < 3 ? "bg-primary/5 mb-1" : "hover:bg-muted/50"
                            )}>
                                <span className={cn(
                                    "text-lg font-bold w-6 text-center",
                                    index === 0 ? "text-yellow-500" :
                                        index === 1 ? "text-gray-500" :
                                            index === 2 ? "text-orange-500" : "text-gray-300"
                                )}>
                                    {index + 1}
                                </span>
                                <Avatar className="h-10 w-10 border border-border">
                                    <AvatarImage src={user.userImage || ""} />
                                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                                        {user.userName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h4 className="font-bold text-foreground text-sm">{user.userName}</h4>
                                    <div className="w-full bg-muted h-1.5 rounded-full mt-1.5 overflow-hidden">
                                        <div
                                            className="bg-primary/60 h-full rounded-full"
                                            style={{ width: `${(user.visitCount / (leaderboard[0]?.visitCount || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-bold text-foreground">{user.visitCount}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Visitas</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {leaderboard.length === 0 && (
                        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
                            <Medal className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground font-bold">No hay exploradores en esta categoría aún.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

