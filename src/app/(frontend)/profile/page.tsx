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
                <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6 pt-24 flex flex-col items-center justify-center space-y-4">
                <p className="text-brand-900/60 font-medium">Inicia sesión para ver tu perfil</p>
                <Button asChild className="bg-brand-600 hover:bg-brand-700">
                    <Link href="/auth/login text-white">Ingresar</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 pb-28 space-y-8">
            <header className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-brand-100 shadow-sm">
                    <AvatarImage src={user.image || ""} alt={user.name || "Usuario"} />
                    <AvatarFallback className="bg-brand-200 text-brand-600 text-xl font-bold">
                        {(user.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-brand-950">{user.name || "Usuario"}</h1>
                    <p className="text-sm text-brand-900/60 break-all">{user.email}</p>
                </div>
            </header>

            <div className="space-y-4">
                <h3 className="text-xs font-bold text-brand-900/40 uppercase tracking-wider ml-1">Cuenta</h3>
                <div className="bg-white rounded-2xl border border-brand-100 divide-y divide-brand-50 shadow-sm overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-brand-50/50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                                <Settings className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-brand-900">Preferencias</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-brand-900/20 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 hover:bg-brand-50/50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                                <Bell className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-brand-900">Notificaciones</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-brand-900/20 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 hover:bg-brand-50/50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                                <Shield className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-brand-900">Privacidad</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-brand-900/20 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <ColorPicker />
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
                <p className="text-[10px] text-brand-900/20">Versión 1.0.0 (Beta)</p>
            </footer>
        </div>
    );
}
