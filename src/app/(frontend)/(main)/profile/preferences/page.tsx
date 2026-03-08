"use client";

import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfilePictureUpload } from "@/components/profile/profile-picture-upload";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PreferencesPage() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const router = useRouter();

    if (isPending) {
        return (
            <div className="w-full h-full flex items-center justify-center p-6 pt-24">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!user) {
        router.push("/auth/login");
        return null;
    }

    return (
        <div className="p-6 pt-16 pb-28 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center gap-4">
                <button 
                    onClick={() => router.back()}
                    className="p-2 rounded-xl bg-card border border-primary/10 shadow-sm active:scale-95 transition-all text-primary"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold tracking-tighter text-foreground uppercase">
                    Preferencias
                </h1>
            </header>

            <div className="space-y-6">
                <ProfilePictureUpload initialImage={user.image} name={user.name} />
                
                <ThemeToggle />
            </div>

            <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-6 leading-relaxed opacity-40">
                Personaliza tu experiencia en Espresso. Estos cambios se aplicarán instantáneamente.
            </p>
        </div>
    );
}
