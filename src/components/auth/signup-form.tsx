"use client";

import { useTheme } from "@/components/theme-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { brandColor } = useTheme();

    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const requirements = [
        { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
        { label: "Al menos un número", test: (p: string) => /\d/.test(p) },
        { label: "Las contraseñas coinciden", test: (p: string) => p === confirmPassword && p !== "" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!acceptedTerms) {
            setError("Debes aceptar los términos y condiciones");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (!requirements.every(r => r.test(password))) {
            setError("Por favor cumple con todos los requisitos de seguridad");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Read fcm_token from cookie if present
            const fcmTokenFromCookie = document.cookie
                .split("; ")
                .find((row) => row.startsWith("fcm_token="))
                ?.split("=")[1];

            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: "/home",
                ...(fcmTokenFromCookie ? { fcmToken: fcmTokenFromCookie } : {}),
            });

            if (error) {
                setError(error.message || "Ocurrió un error al registrarse");
            } else {
                router.push("/home");
            }
        } catch (err) {
            setError("Ocurrió un error inesperado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full bg-white border-none shadow-none rounded-[2.5rem] p-4">
            <CardHeader className="text-center space-y-1 pb-8">
                <CardTitle className="text-2xl font-black tracking-tight" style={{ color: brandColor }}>
                    Crea una cuenta
                </CardTitle>
                <CardDescription className="text-[#626262] text-base font-bold max-w-[280px] mx-auto leading-tight">
                    Crea una cuenta para poder explorar todas las cafeterías
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
                <CardContent className="space-y-4 px-0">
                    {error && (
                        <Alert className="bg-red-50/50 border-red-200 text-red-600 rounded-2xl">
                            <AlertDescription className="font-medium text-center">{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-1">
                        <Input
                            id="name"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="bg-[#f1f4ff] border-none text-black placeholder:text-[#626262] h-16 rounded-xl px-4 text-lg font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
                        />
                    </div>
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
                    <div className="space-y-1 relative group">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-[#f1f4ff] border-none text-black placeholder:text-[#626262] h-16 rounded-xl px-4 pr-12 text-lg font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#626262] hover:text-black transition-colors p-1"
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

                    {/* Terms and Conditions Checkbox */}
                    <div className="flex items-start gap-3 px-1 py-2">
                        <button
                            type="button"
                            onClick={() => setAcceptedTerms(!acceptedTerms)}
                            className={cn(
                                "mt-1 flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center",
                                acceptedTerms
                                    ? "bg-primary border-primary text-white"
                                    : "border-[#626262]/20 bg-[#f1f4ff]"
                            )}
                        >
                            {acceptedTerms && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                        </button>
                        <div className="text-sm font-medium leading-normal text-[#626262]">
                            Acepto los{" "}
                            <a
                                href="https://espresso.ink/terms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold underline"
                                style={{ color: brandColor }}
                            >
                                términos y condiciones
                            </a>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-8 px-0 pb-4">
                    <Button
                        type="submit"
                        className="w-full h-16 text-white font-black text-xl rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] border-none disabled:opacity-50 disabled:hover:scale-100"
                        style={{
                            backgroundColor: brandColor,
                            boxShadow: acceptedTerms ? `0 10px 30px ${brandColor}4D` : 'none'
                        }}
                        disabled={loading || !acceptedTerms}
                    >
                        {loading && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
                        Registrarse
                    </Button>
                    <Link href="/auth/login" className="text-black font-bold text-base hover:underline transition-all">
                        Ya tengo una cuenta
                    </Link>

                    <div className="w-full space-y-6">
                        <div className="relative flex justify-center text-sm font-bold">
                            <span className="bg-white px-4 text-[#f35c2e]" style={{ color: brandColor }}>
                                O continúa con
                            </span>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button type="button" className="w-14 h-11 bg-[#ececec] flex items-center justify-center rounded-lg hover:bg-[#e0e0e0] transition-colors">
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.90 3.16-1.78 4.06-1.12 1.14-2.8 2.38-5.74 2.38-4.62 0-8.22-3.72-8.22-8.34s3.6-8.34 8.22-8.34c2.54 0 4.38 1 5.66 2.22l2.32-2.32C20.84 1.76 18.24 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c3.74 0 6.58-1.22 8.74-3.5 2.24-2.24 2.94-5.38 2.94-7.84 0-.74-.06-1.44-.18-2.08l-11.44-.02z" /></svg>
                            </button>
                            <button type="button" className="w-14 h-11 bg-[#ececec] flex items-center justify-center rounded-lg hover:bg-[#e0e0e0] transition-colors">
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </button>
                            <button type="button" className="w-14 h-11 bg-[#ececec] flex items-center justify-center rounded-lg hover:bg-[#e0e0e0] transition-colors">
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05 1.78-3.3 1.78-1.18 0-1.55-.73-2.92-.73-1.38 0-1.8.71-2.92.71-1.17 0-2.36-.93-3.38-2.4C2.45 16.6 1.15 11.23 3.25 7.57c1.04-1.8 2.88-2.94 4.88-2.94 1.53 0 2.97 1.05 3.91 1.05.9 0 2.66-1.25 4.51-1.07 1.9.18 3.32 1 4.14 2.21-3.6 2.16-3.01 6.81.67 8.32-.73 2.1-2.45 5.17-4.31 7.14zM14.65 1.5c-1.18 0-2.6.76-3.4 1.7-.82.97-1.52 2.36-1.32 3.73 1.25.1 2.63-.67 3.44-1.63.8-.96 1.39-2.28 1.28-3.8z" /></svg>
                            </button>
                        </div>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
