"use client";

import { Coffee, User, LogOut, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function TopNav() {
    const { data, isPending } = authClient.useSession();
    const user = data?.user;
    const router = useRouter();

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
        <header className="fixed top-0 left-0 right-0 bg-brand-700 border-b border-brand-800 py-3 px-6 flex items-center justify-between z-[2000] shadow-md">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shadow-sm">
                    <Coffee className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                    Pasaporte de Café
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {isPending ? (
                    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                ) : user ? (
                    <Drawer>
                        <DrawerTrigger asChild>
                            <button className="relative h-9 w-9 rounded-full overflow-hidden border border-white/20 hover:ring-2 hover:ring-white/30 transition-all outline-none">
                                <Avatar className="h-full w-full">
                                    <AvatarImage src={user.image || ""} alt={user.name || "Usuario"} />
                                    <AvatarFallback className="bg-white/10 text-white text-xs font-bold">
                                        {(user.name || "U").charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
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
                                            <Link href="/dashboard/profile">
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
                                            <Link href="/dashboard/profile">
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
                ) : (
                    <Button asChild variant="ghost" className="text-white hover:bg-white/10 font-bold">
                        <Link href="/auth/login">
                            <User className="mr-2 h-4 w-4" />
                            Ingresar
                        </Link>
                    </Button>
                )}
            </div>
        </header>
    );
}
