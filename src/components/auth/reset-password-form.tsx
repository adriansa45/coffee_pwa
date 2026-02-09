"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

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
    const { brandColor } = useTheme();

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
            <Card className="w-full bg-white border-none shadow-none rounded-[2.5rem] p-6 text-center">
                <CardHeader className="space-y-4 pb-8">
                    <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: brandColor + '10' }}>
                        <Check className="w-10 h-10" style={{ color: brandColor }} />
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight" style={{ color: brandColor }}>
                        ¡Contraseña actualizada!
                    </CardTitle>
                    <CardDescription className="text-[#626262] text-base font-bold leading-tight">
                        Tu contraseña ha sido cambiada correctamente. Serás redirigido al login en unos segundos.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="w-full bg-white border-none shadow-none rounded-[2.5rem] p-4">
            <CardHeader className="text-center space-y-1 pb-8">
                <CardTitle className="text-2xl font-black tracking-tight" style={{ color: brandColor }}>
                    Nueva contraseña
                </CardTitle>
                <CardDescription className="text-[#626262] text-base font-bold max-w-[250px] mx-auto leading-tight">
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
                            className="bg-[#f1f4ff] border-none text-black placeholder:text-[#626262] h-16 rounded-xl px-4 pr-12 text-lg font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#626262] hover:text-black transition-colors"
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
                            className="bg-[#f1f4ff] border-none text-black placeholder:text-[#626262] h-16 rounded-xl px-4 text-lg font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
                        />
                    </div>

                    <div className="py-2 px-1 space-y-2">
                        {requirements.map((req, i) => {
                            const isMet = req.test(password);
                            return (
                                <div key={i} className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: isMet ? brandColor : '#626262' }}>
                                    {isMet ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current opacity-20" />}
                                    <span>{req.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
                <CardFooter className="px-0 pb-4">
                    <Button
                        type="submit"
                        className="w-full h-16 text-white font-black text-xl rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
                        style={{ 
                            backgroundColor: brandColor,
                            boxShadow: `0 10px 30px ${brandColor}4D`
                        }}
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
