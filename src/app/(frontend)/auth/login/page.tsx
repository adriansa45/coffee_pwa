import { LoginForm } from "@/components/auth/login-form";
import { Coffee } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
            <div
                className="absolute inset-0 z-0 scale-110"
                style={{
                    backgroundImage: 'url("/images/auth-bg.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(8px) brightness(0.4)'
                }}
            />

            <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/90 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Coffee className="w-12 h-12 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                            Pasaporte del Café
                        </h1>
                        <p className="text-primary/10/60 font-medium">Tu viaje cafetero comienza aquí</p>
                    </div>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
