"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, ChevronRight, Loader2, LogOut, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

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
        <div className="min-h-screen bg-background pb-32">
            {/* Header Area */}
            <div className="px-6 pt-16 pb-8 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold text-foreground tracking-tighter uppercase leading-none">Mi Cuenta</h1>
                        <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.3em] mt-1">{user.email}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-10">
                {/* Account Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] ml-1">Configuración</h3>
                    <Card className="bg-card/50 backdrop-blur-sm border-border/40 overflow-hidden shadow-xl rounded-xl">
                        <div className="flex flex-col divide-y divide-border/40">
                            <Link
                                href="/profile/preferences"
                                className="w-full flex items-center justify-between p-5 hover:bg-primary/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Settings className="size-5" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground uppercase tracking-tight">Preferencias</span>
                                </div>
                                <ChevronRight className="size-4 text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/profile/privacy"
                                className="w-full flex items-center justify-between p-5 hover:bg-primary/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Shield className="size-5" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground uppercase tracking-tight">Privacidad</span>
                                </div>
                                <ChevronRight className="size-4 text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* Logout Button */}
                <div className="pt-4 flex flex-col gap-6">
                    <Button
                        onClick={handleSignOut}
                        variant="destructive"
                        className="w-full py-7 rounded-xl flex gap-3 text-xs font-bold uppercase tracking-[0.25em] shadow-lg shadow-destructive/20 hover:scale-[0.98] transition-all"
                    >
                        <LogOut className="size-4" />
                        Cerrar Sesión
                    </Button>

                    <footer className="text-center">
                        <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.3em]">
                            Coffee PWA &copy; 2026 - Versión 1.0.0 (Beta)
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
