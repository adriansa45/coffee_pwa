"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Map, Users, Home, QrCode, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const customerNavItems = [
    { name: "Inicio", href: "/home", icon: Home },
    { name: "Mapa", href: "/map", icon: Map },
    { name: "Cafeterías", href: "/shops", icon: Coffee },
    { name: "Descubrir", href: "/discover", icon: Search },
];

const shopNavItems = [
    { name: "Escanear", href: "/shop", icon: QrCode },
];

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    // Determine which nav items to show based on role
    const role = user ? (user as any).role : "customer";
    const navItems = role === "coffee_shop" ? shopNavItems : customerNavItems;

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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[min(calc(100%-3rem),400px)] glass rounded-full px-6 py-3 flex justify-around items-center z-[1000] shadow-2xl border-white/5">
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
                        {isActive && (
                            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary animate-in fade-in zoom-in duration-300" />
                        )}
                    </Link>
                );
            })}

            {user && (
                <Drawer>
                    <DrawerTrigger asChild>
                        <button className={cn(
                            "flex flex-col items-center gap-1 transition-all duration-300 text-muted-foreground hover:text-foreground outline-none"
                        )}>
                            <div className="p-2 rounded-full hover:bg-white/5 transition-all duration-300">
                                <User className="w-5 h-5 stroke-2" />
                            </div>
                        </button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader className="text-left border-b border-border pb-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14 border-2 border-primary/20">
                                        <AvatarImage src={user.image || ""} alt={user.name || "Usuario"} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                            {(user.name || "U").charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <DrawerTitle className="text-xl font-bold">
                                            {user.name || "Usuario"}
                                        </DrawerTitle>
                                        <DrawerDescription className="text-muted-foreground font-medium truncate max-w-[200px]">
                                            {user.email}
                                        </DrawerDescription>
                                    </div>
                                </div>
                            </DrawerHeader>
                            <div className="p-4 space-y-2">
                                <DrawerClose asChild>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="w-full justify-start font-semibold h-12 rounded-2xl hover:bg-primary/5 hover:text-primary"
                                    >
                                        <Link href="/profile">
                                            <User className="mr-3 h-5 w-5" />
                                            Mi Perfil
                                        </Link>
                                    </Button>
                                </DrawerClose>
                                <DrawerClose asChild>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="w-full justify-start font-semibold h-12 rounded-2xl hover:bg-primary/5 hover:text-primary"
                                    >
                                        <Link href="/profile">
                                            <Settings className="mr-3 h-5 w-5" />
                                            Configuración
                                        </Link>
                                    </Button>
                                </DrawerClose>
                                <div className="pt-2">
                                    <Button
                                        onClick={handleSignOut}
                                        className="w-full justify-start text-destructive font-bold h-12 rounded-2xl hover:bg-destructive/5 hover:text-destructive"
                                        variant="ghost"
                                    >
                                        <LogOut className="mr-3 h-5 w-5" />
                                        Cerrar Sesión
                                    </Button>
                                </div>
                            </div>
                            <DrawerFooter className="pt-0 pb-8">
                                <DrawerClose asChild>
                                    <Button variant="outline" className="h-12 rounded-2xl font-bold border-border">Cancelar</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            )}
        </div>
    );
}

