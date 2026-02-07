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
        <nav className="fixed bottom-0 left-0 right-0 bg-brand-600 flex justify-around items-center py-2 px-4 shadow-[0_-4px_20px_rgba(39,4,13,0.3)] z-[1000] pb-safe">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.name === "Inicio" && pathname === "/");
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all duration-200 py-1 px-4 rounded-2xl",
                            isActive
                                ? "text-white bg-brand-500 shadow-[0_0_15px_rgba(130,14,43,0.3)]"
                                : "text-brand-400 hover:text-brand-200"
                        )}
                    >
                        <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                        <span className="text-[10px] font-medium font-sans">{item.name}</span>
                    </Link>
                );
            })}
            
            {user && (
                <Drawer>
                    <DrawerTrigger asChild>
                        <button className={cn(
                            "flex flex-col items-center gap-1 transition-all duration-200 py-1 px-4 rounded-2xl text-brand-400 hover:text-brand-200 outline-none"
                        )}>
                            <User className="w-5 h-5 stroke-2" />
                            <span className="text-[10px] font-medium font-sans">Perfil</span>
                        </button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader className="text-left border-b border-gray-100 pb-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14 border-2 border-brand-100">
                                        <AvatarImage src={user.image || ""} alt={user.name || "Usuario"} />
                                        <AvatarFallback className="bg-brand-50 text-brand-700 text-xl font-bold">
                                            {(user.name || "U").charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <DrawerTitle className="text-xl font-bold text-brand-950">
                                            {user.name || "Usuario"}
                                        </DrawerTitle>
                                        <DrawerDescription className="text-brand-800/60 font-medium truncate max-w-[200px]">
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
                                        className="w-full justify-start text-brand-950 font-bold h-12 rounded-xl hover:bg-brand-50 hover:text-brand-700"
                                    >
                                        <Link href="/profile">
                                            <User className="mr-3 h-5 w-5 text-brand-600" />
                                            Mi Perfil
                                        </Link>
                                    </Button>
                                </DrawerClose>
                                <DrawerClose asChild>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="w-full justify-start text-brand-950 font-bold h-12 rounded-xl hover:bg-brand-50 hover:text-brand-700"
                                    >
                                        <Link href="/profile">
                                            <Settings className="mr-3 h-5 w-5 text-brand-600" />
                                            Configuración
                                        </Link>
                                    </Button>
                                </DrawerClose>
                                <div className="pt-2">
                                    <Button
                                        onClick={handleSignOut}
                                        className="w-full justify-start text-red-600 font-bold h-12 rounded-xl hover:bg-red-50 hover:text-red-700"
                                        variant="ghost"
                                    >
                                        <LogOut className="mr-3 h-5 w-5" />
                                        Cerrar Sesión
                                    </Button>
                                </div>
                            </div>
                            <DrawerFooter className="pt-0">
                                <DrawerClose asChild>
                                    <Button variant="outline" className="h-12 rounded-xl font-bold border-gray-200">Cancelar</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            )}
        </nav>
    );
}
