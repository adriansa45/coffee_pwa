"use client";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Coffee } from "lucide-react";
export default function ForgotPasswordPage() {

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden bg-background">
            <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500 py-10">
                <div className="flex flex-col items-center text-center space-y-2 mb-6">
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 bg-primary/10">
                        <Coffee className="w-14 h-14 text-primary" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-7xl font-black italic tracking-tighter text-primary">
                        Espresso
                    </h1>
                </div>

                <ForgotPasswordForm />
            </div>
        </div>
    );
}
