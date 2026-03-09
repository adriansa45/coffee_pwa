"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Coffee, Home, LogIn, Map, QrCode, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const customerNavItems = [
    { name: "Inicio", href: "/home", icon: Home },
    { name: "Explorar", href: "/shops", icon: Search },
    { name: "", href: "/passport", icon: QrCode }, // QR central manda al pasaporte
    { name: "Mapa", href: "/map", icon: Map },
];

const shopNavItems = [
    { name: "", href: "/shop", icon: QrCode },
];

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    if (!mounted) {
        return (
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t flex items-center justify-between px-2 z-[1000]">
                {/* Skeleton/Placeholder to avoid layout shift */}
                {customerNavItems.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-center gap-1 opacity-20">
                        <div className="size-6 bg-muted rounded-full" />
                        <div className="h-2 w-8 bg-muted rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t  flex items-center justify-between px-2 z-[1000] animate-in fade-in slide-in-from-bottom-5 duration-500">
            {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.name === "Inicio" && pathname === "/");
                const isCenter = index === 2;

                if (isCenter) {
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex-1 flex flex-col items-center justify-center group"
                        >
                            <div className={cn(
                                "size-16 rounded-full flex items-center justify-center transition-all duration-300",
                                isActive ? "bg-primary text-primary-foreground scale-110" : "bg-primary text-primary-foreground hover:scale-105"
                            )}>
                                <Icon className="size-8 stroke-[2.5px]" />
                            </div>
                            <span className={cn(
                                "mt-1.5 text-xs uppercase tracking-widest transition-colors duration-300",
                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300 h-full",
                            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Icon className={cn("size-6 transition-all duration-300", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                        <span className={cn(
                            "text-[9px] uppercase tracking-widest transition-colors duration-300",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}>
                            {item.name}
                        </span>
                    </Link>
                );
            })}

            {user && (
                <Link
                    href={`/users/${user.id}`}
                    className={cn(
                        "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300 h-full",
                        pathname === `/users/${user.id}` ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <UserRound className={cn("size-6 transition-all duration-300", pathname === `/users/${user.id}` ? "stroke-[2.5px]" : "stroke-2")} />
                    <span className={cn(
                        "text-[9px] uppercase tracking-widest transition-colors duration-300",
                        pathname === `/users/${user.id}` ? "text-primary" : "text-muted-foreground"
                    )}>
                        Perfil
                    </span>
                </Link>
            )}
        </div>
    );
}
