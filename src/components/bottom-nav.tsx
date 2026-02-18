"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Coffee, Home, LogIn, Map, QrCode, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const customerNavItems = [
    { name: "Inicio", href: "/home", icon: Home },
    { name: "Mapa", href: "/map", icon: Map },
    { name: "Cafeterías", href: "/shops", icon: Coffee },
    { name: "Descubrir", href: "/discover", icon: Search },
];

const shopNavItems = [
    { name: "Escanear", href: "/shop", icon: QrCode },
];

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    // Determine which nav items to show based on role
    const role = user ? (user as any).role : "customer";
    let navItems = role === "coffee_shop" ? shopNavItems : customerNavItems;

    // Filter out protected items if not logged in
    if (!user) {
        navItems = navItems.filter(item => item.name !== "Descubrir");
        // Add Login option for guests
        navItems = [...navItems, { name: "Acceder", href: "/auth/login", icon: LogIn }];
    }

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/login");
                },
            },
        });
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[min(calc(100%-3rem),400px)] glass rounded-full px-6 py-3 flex justify-around items-center z-[1000] shadow-2xl border-white/10">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.name === "Inicio" && pathname === "/");
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "relative flex flex-col items-center gap-1 transition-all duration-300",
                            isActive ? "text-primaryScale" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-full transition-all duration-300",
                            isActive ? "bg-primary/20 text-primary scale-110" : "hover:bg-white/5"
                        )}>
                            <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                        </div>
                    </Link>
                );
            })}

            {user && (
                <Link
                    href={`/users/${user.id}`}
                    className={cn(
                        "relative flex flex-col items-center gap-1 transition-all duration-300",
                        pathname === `/users/${user.id}` ? "text-primaryScale" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <div className={cn(
                        "p-2 rounded-full transition-all duration-300",
                        pathname === `/users/${user.id}` ? "bg-primary/20 text-primary scale-110" : "hover:bg-white/5"
                    )}>
                        <UserRound className={cn("w-5 h-5", pathname === `/users/${user.id}` ? "stroke-[2.5px]" : "stroke-2")} />
                    </div>
                </Link>
            )}
        </div>
    );
}
