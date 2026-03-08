"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const requirements = [
        { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
        { label: "Al menos un número", test: (p: string) => /\d/.test(p) },
        { label: "Las contraseñas coinciden", test: (p: string) => p === confirmPassword && p !== "" },
    ];

    useEffect(() => {
        if (!token) {
            setError("Token de recuperación inválido o expirado");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (!requirements.every(r => r.test(password))) {
            setError("Por favor cumple con todos los requisitos de seguridad");
            return;
        }

        if (!token) {
            setError("Falta el token de recuperación");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token: token || "",
            });

            if (error) {
                setError(error.message || "No se pudo restablecer la contraseña");
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000);
            }
        } catch (err) {
            setError("Ocurrió un error inesperado");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="w-full border-none shadow-none p-6 text-center">
                <CardHeader className="space-y-4 pb-8">
                    <div className="mx-auto w-24 h-24 rounded-3xl flex items-center justify-center bg-primary/10 rotate-3">
                        <Check className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tighter text-foreground uppercase">
                        ¡Contraseña actualizada!
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-base font-bold leading-tight">
                        Tu contraseña ha sido cambiada correctamente. Serás redirigido al login en unos segundos.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="w-full border-none shadow-none p-4">
            <CardHeader className="text-center space-y-1 pb-8">
                <CardTitle className="text-3xl font-bold tracking-tighter text-foreground uppercase">
                    Nueva contraseña
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base font-bold max-w-[250px] mx-auto leading-tight">
                    Crea una nueva contraseña segura para tu cuenta.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
                <CardContent className="space-y-4 px-0">
                    {error && (
                        <Alert className="bg-red-50/50 border-red-200 text-red-600 rounded-2xl">
                            <AlertDescription className="font-medium text-center">{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    <div className="space-y-1 relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Nueva contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-16 px-4 pr-12 text-lg font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                        </button>
                    </div>

                    <div className="space-y-1">
                        <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="h-16 px-4 text-lg font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-sm"
                        />
                    </div>

                    <div className="py-2 px-1 space-y-2">
                        {requirements.map((req, i) => {
                            const isMet = req.test(password);
                            return (
                                <div key={i} className={cn("flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors", isMet ? "text-primary" : "text-muted-foreground/30")}>
                                    {isMet ? <Check className="w-4 h-4 stroke-[3px]" /> : <div className="size-4 rounded-full border-2 border-current opacity-20" />}
                                    <span>{req.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
                <CardFooter className="px-0 pb-4">
                    <Button
                        type="submit"
                        className="w-full h-16 text-white font-bold text-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                        disabled={loading || !token}
                    >
                        {loading && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
                        Actualizar contraseña
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
