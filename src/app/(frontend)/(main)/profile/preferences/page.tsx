"use client";

import { authClient } from "@/lib/auth-client";
import { ColorPicker } from "@/components/profile/color-picker";
import { ProfilePictureUpload } from "@/components/profile/profile-picture-upload";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

export default function PreferencesPage() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const router = useRouter();
    const { brandColor } = useTheme();

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
                    className="p-2 rounded-xl bg-white border border-primary/10 shadow-sm active:scale-95 transition-all"
                >
                    <ChevronLeft className="w-6 h-6" style={{ color: brandColor }} />
                </button>
                <h1 className="text-2xl font-black tracking-tight" style={{ color: brandColor }}>
                    Preferencias
                </h1>
            </header>

            <div className="space-y-6">
                <ProfilePictureUpload initialImage={user.image} name={user.name} />
                
                <ColorPicker />
            </div>

            <p className="text-center text-xs text-foreground/30 px-6 leading-relaxed">
                Personaliza tu experiencia en Espresso. Estos cambios se aplicarán instantáneamente a tu cuenta.
            </p>
        </div>
    );
}
