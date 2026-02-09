"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, ChevronRight, Bell, Shield, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ColorPicker } from "@/components/profile/color-picker";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
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

    if (isPending) {
        return (
            <div className="w-full h-full flex items-center justify-center p-6 pt-24">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6 pt-24 flex flex-col items-center justify-center space-y-4">
                <p className="text-foreground/60 font-medium">Inicia sesión para ver tu perfil</p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/auth/login text-white">Ingresar</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 pt-16 pb-28 space-y-8">
            <header className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/10 shadow-sm">
                    <AvatarImage src={user.image || ""} alt={user.name || "Usuario"} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                        {(user.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-foreground">{user.name || "Usuario"}</h1>
                    <p className="text-sm text-foreground/60 break-all">{user.email}</p>
                </div>
            </header>

            <div className="space-y-4">
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider ml-1">Cuenta</h3>
                <div className="bg-white rounded-2xl border border-primary/10 divide-y divide-primary/5 shadow-sm overflow-hidden">
                    <Link 
                        href="/profile/preferences"
                        className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Settings className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-foreground/90">Preferencias</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Bell className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-foreground/90">Notificaciones</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Shield className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-foreground/90">Privacidad</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>


            </div>

            <div className="pt-4">
                <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full py-6 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl gap-2 font-bold shadow-sm active:scale-95 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                </Button>
            </div>

            <footer className="text-center">
                <p className="text-[10px] text-foreground/20">Versión 1.0.0 (Beta)</p>
            </footer>
        </div>
    );
}
