"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Map, User, Stamp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Mapa", href: "/dashboard/map", icon: Map },
    { name: "Pasaporte", href: "/dashboard/passport", icon: Stamp },
    { name: "Perfil", href: "/dashboard/profile", icon: User },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-brand-900 border-t border-brand-800 flex justify-around items-center py-2 px-4 shadow-[0_-4px_20px_rgba(39,4,13,0.3)] z-[1000] pb-safe">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all duration-200 py-2 px-4 rounded-2xl",
                            isActive
                                ? "text-white bg-brand-700 shadow-[0_0_15px_rgba(130,14,43,0.3)]"
                                : "text-brand-400 hover:text-brand-200"
                        )}
                    >
                        <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                        <span className="text-[10px] font-medium font-sans">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
