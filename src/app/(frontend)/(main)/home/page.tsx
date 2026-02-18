import { getTopRatedCoffeeShops } from "@/actions/coffee-shops";
import { CoffeeCard } from "@/components/CoffeeCard";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

const categories = ["Todos", "Cerca de ti", "Populares", "Nuevos"];

export default async function HomePage() {
    const response = await getTopRatedCoffeeShops(4);
    const coffeeShops = response.success ? response.data : [];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-[40vh] overflow-hidden">
                {/* Background with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-700" />
                <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 pb-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm w-fit">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-primary">Descubre cafeterías cerca</span>
                        </div>

                        <h1 className="text-5xl font-bold text-white leading-tight">
                            Tu pasaporte
                            <br />
                            al mejor café
                        </h1>

                        <p className="text-zinc-400 text-lg max-w-md">
                            Explora, visita y colecciona experiencias en las mejores cafeterías de tu ciudad
                        </p>
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
            </section>

            {/* Category Filters */}
            <section className="px-6 -mt-6 relative z-10">
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {categories.map((category) => (
                        <div
                            key={category}
                            className={cn(
                                "px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border cursor-pointer",
                                category === "Todos"
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    : "glass text-foreground border-zinc-200 hover:border-primary/30"
                            )}
                        >
                            {category}
                        </div>
                    ))}
                </div>
            </section>

            {/* Coffee Shops Grid */}
            <section className="px-6 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-zinc-900">Cafeterías destacadas</h2>
                    <Link href="/shops?sortBy=rating" className="text-sm font-bold text-primary hover:underline">
                        Ver todas
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {coffeeShops && coffeeShops.map((shop: any) => (
                        <CoffeeCard
                            key={shop.id}
                            shop={shop}
                        />
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            {/* <section className="px-6 py-8">
                <div className="glass rounded-4xl p-8 space-y-6 border border-zinc-200">
                    <h3 className="text-xl font-bold text-zinc-900">Tu progreso</h3>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <Coffee className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900">12</div>
                            <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Visitas</div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900">8</div>
                            <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Lugares</div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <Star className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-2xl font-bold text-zinc-900">4.8</div>
                            <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Promedio</div>
                        </div>
                    </div>
                </div>
            </section> */}
        </div>
    );
}
