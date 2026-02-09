"use client";

import { LoginForm } from "@/components/auth/login-form";
import { Coffee } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function LoginPage() {
    const { brandColor } = useTheme();

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden bg-[var(--warm-bg)]">
            <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500 py-10">
                <div className="flex flex-col items-center text-center space-y-2 mb-6">
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500" style={{ backgroundColor: brandColor + '15' }}>
                        <Coffee className="w-14 h-14" style={{ color: brandColor }} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-6xl font-black italic tracking-tighter" style={{ color: brandColor }}>
                        Espresso
                    </h1>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
