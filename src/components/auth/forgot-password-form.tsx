"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { brandColor } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await authClient.requestPasswordReset({
                email,
                redirectTo: "/auth/reset-password",
            });

            if (error) {
                setError(error.message || "No se pudo enviar el correo de recuperación");
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError("Ocurrió un error inesperado");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="w-full bg-white border-none shadow-none rounded-[2.5rem] p-6 text-center">
                <CardHeader className="space-y-4 pb-8">
                    <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: brandColor + '10' }}>
                        <Mail className="w-10 h-10" style={{ color: brandColor }} />
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight" style={{ color: brandColor }}>
                        ¡Correo enviado!
                    </CardTitle>
                    <CardDescription className="text-[#626262] text-base font-bold leading-tight">
                        Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor revisa tu bandeja de entrada.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="px-0">
                    <Link 
                        href="/auth/login" 
                        className="w-full h-16 flex items-center justify-center gap-2 text-black font-black text-xl hover:opacity-70 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver al login
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full bg-white border-none shadow-none rounded-[2.5rem] p-4">
            <CardHeader className="text-center space-y-1 pb-8">
                <CardTitle className="text-2xl font-black tracking-tight" style={{ color: brandColor }}>
                    Recuperar acceso
                </CardTitle>
                <CardDescription className="text-[#626262] text-base font-bold max-w-[250px] mx-auto leading-tight">
                    Ingresa tu correo y te enviaremos un enlace para restaurar tu contraseña.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
                <CardContent className="space-y-5 px-0">
                    {error && (
                        <Alert className="bg-red-50/50 border-red-200 text-red-600 rounded-2xl">
                            <AlertDescription className="font-medium text-center">{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-1">
                        <Input
                            id="email"
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-[#f1f4ff] border-none text-black placeholder:text-[#626262] h-16 rounded-xl px-4 text-lg font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-6 px-0 pb-4">
                    <Button
                        type="submit"
                        className="w-full h-16 text-white font-black text-xl rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
                        style={{ 
                            backgroundColor: brandColor,
                            boxShadow: `0 10px 30px ${brandColor}4D`
                        }}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
                        Enviar enlace
                    </Button>

                    <Link 
                        href="/auth/login" 
                        className="flex items-center gap-2 text-black font-bold text-base hover:underline transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al login
                    </Link>
                </CardFooter>
            </form>
        </Card>
    );
}
