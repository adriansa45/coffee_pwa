"use client";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Coffee } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Suspense } from "react";

export default function ResetPasswordPage() {
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

                <Suspense fallback={<div className="text-center py-10"><Loader2 className="w-10 h-10 animate-spin mx-auto" /></div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
