"use client";

import { Coffee, MapPin, Star, TrendingUp } from "lucide-react";
import { CoffeeCard } from "@/components/CoffeeCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = ["Todos", "Cerca de ti", "Populares", "Nuevos"];

// Mock data - replace with real data from your API
const coffeeShops = [
    {
        id: 1,
        name: "Café Aroma",
        image: "/images/coffee-1.jpg",
        rating: 4.8,
        distance: "0.5 km",
        status: "open" as const,
    },
    {
        id: 2,
        name: "Espresso House",
        image: "/images/coffee-2.jpg",
        rating: 4.6,
        distance: "1.2 km",
        status: "open" as const,
    },
    {
        id: 3,
        name: "Bean & Brew",
        image: "/images/coffee-3.jpg",
        rating: 4.9,
        distance: "2.1 km",
        status: "closed" as const,
    },
    {
        id: 4,
        name: "Morning Cup",
        image: "/images/coffee-4.jpg",
        rating: 4.7,
        distance: "0.8 km",
        status: "open" as const,
    },
];

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[40vh] overflow-hidden">
                {/* Background with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
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
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border",
                                selectedCategory === category
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    : "glass text-foreground border-white/5 hover:border-primary/30"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Coffee Shops Grid */}
            <section className="px-6 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Cafeterías destacadas</h2>
                    <button className="text-sm font-bold text-primary hover:underline">
                        Ver todas
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {coffeeShops.map((shop) => (
                        <CoffeeCard
                            key={shop.id}
                            name={shop.name}
                            image={shop.image}
                            rating={shop.rating}
                            distance={shop.distance}
                            status={shop.status}
                        />
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="px-6 py-8">
                <div className="glass rounded-4xl p-8 space-y-6">
                    <h3 className="text-xl font-bold">Tu progreso</h3>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <Coffee className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-2xl font-bold">12</div>
                            <div className="text-xs text-muted-foreground">Visitas</div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-2xl font-bold">8</div>
                            <div className="text-xs text-muted-foreground">Lugares</div>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <Star className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-2xl font-bold">4.8</div>
                            <div className="text-xs text-muted-foreground">Promedio</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
