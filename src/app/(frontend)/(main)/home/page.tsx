import { getTopRatedCoffeeShops, getCoffeeShops } from "@/actions/coffee-shops";
import { getFriendsActivity } from "@/actions/social";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HomeStatsCard } from "@/components/home/home-stats-card";
import { ShopCarousel } from "@/components/home/shop-carousel";
import { SocialFeed } from "@/components/home/social-feed";
import { TrendingUp, MapPin, Coffee } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function HomePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const user = session?.user;

    // Fetch popular shops
    const popularResponse = await getTopRatedCoffeeShops(8);
    const popularShops = (popularResponse as any).data || [];

    // Fetch recently visited shops (using getCoffeeShops with "collected" filter if logged in, or just recent ones)
    const recentResponse = await getCoffeeShops({ limit: 8, sortBy: "name", sortOrder: "asc" });
    const nearbyShops = (recentResponse as any).data || [];

    // Fetch friends activity
    const activityResponse = await getFriendsActivity(5);
    const activities = activityResponse.success ? activityResponse.data : [];

    return (
        <div className="min-h-screen bg-background text-foreground pb-32">
            {/* Header / Hero */}
            <div className="relative pt-12 pb-8 px-6 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Coffee className="size-5 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Tu Pasaporte Café</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tighter leading-none uppercase">
                            Hola, {user?.name?.split(' ')[0] || "Explorador"}
                        </h1>
                    </div>

                    {user && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <HomeStatsCard 
                                totalVisits={Number((user as any).totalVisitsCount || 0)} 
                                currentTier={(user as any).currentTier || "Explorador/a"}
                            />
                        </div>
                    )}
                </div>
            </div>

            <main className="flex flex-col gap-12 mt-4 px-6">
                {/* Combined Shop Carousel with Tabs */}
                <ShopCarousel 
                    sections={[
                        {
                            id: "popular",
                            title: "Populares",
                            subtitle: "Los favoritos de la comunidad",
                            shops: popularShops
                        },
                        {
                            id: "nearby",
                            title: "Cerca de ti",
                            subtitle: "Cafeterías que debes conocer",
                            shops: nearbyShops
                        }
                    ]}
                />

                {/* Social Feed */}
                <SocialFeed activities={activities as any} />
                
                {/* Explore More Button */}
                <div className="flex justify-center mt-4">
                    <Link 
                        href="/shops" 
                        className="w-full py-4 rounded-2xl bg-muted/50 border border-border text-center text-xs font-bold uppercase tracking-widest hover:bg-muted transition-colors active:scale-[0.98]"
                    >
                        Ver todas las cafeterías
                    </Link>
                </div>
            </main>
        </div>
    );
}
