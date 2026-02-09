"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Github, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { brandColor, setBrandColor } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: "/home",
            });

            //setBrandColor(data.brandColor);

            if (error) {
                setError(error.message || "Credenciales inválidas");
            } else {
                router.push("/home");
            }
        } catch (err) {
            setError("Ocurrió un error inesperado");
        } finally {
            setLoading(false);
        }
    };

    const handleGithubSignIn = async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/map",
        });
    };

    return (
        <Card className="w-full bg-white border-none shadow-none rounded-[2.5rem] p-4">
            <CardHeader className="text-center space-y-1 pb-8">
                <CardTitle className="text-2xl font-black tracking-tight" style={{ color: brandColor }}>
                    Inicia sesión
                </CardTitle>
                <CardDescription className="text-[#626262] text-base font-bold max-w-[200px] mx-auto leading-tight">
                    ¡Te extrañamos de vuelta!
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
                    <div className="flex justify-end pr-2">
                        <Link href="#" className="text-[#f35c2e] font-bold text-sm" style={{ color: brandColor }}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-8 px-0 pb-4">
                    <Button
                        type="submit"
                        className="w-full h-16 text-white font-black text-xl rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
                        style={{ 
                            backgroundColor: brandColor,
                            boxShadow: `0 10px 30px ${brandColor}4D` // 30% opacity shadow
                        }}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
                        Entrar
                    </Button>

                    <Link href="/auth/signup" className="text-black font-bold text-base hover:underline transition-all">
                        Crear cuenta nueva
                    </Link>

                    <div className="w-full space-y-6">
                        <div className="relative flex justify-center text-sm font-bold">
                            <span className="bg-white px-4 text-[#f35c2e]" style={{ color: brandColor }}>
                                O continúa con
                            </span>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button type="button" onClick={handleGithubSignIn} className="w-14 h-11 bg-[#ececec] flex items-center justify-center rounded-lg hover:bg-[#e0e0e0] transition-colors">
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.90 3.16-1.78 4.06-1.12 1.14-2.8 2.38-5.74 2.38-4.62 0-8.22-3.72-8.22-8.34s3.6-8.34 8.22-8.34c2.54 0 4.38 1 5.66 2.22l2.32-2.32C20.84 1.76 18.24 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c3.74 0 6.58-1.22 8.74-3.5 2.24-2.24 2.94-5.38 2.94-7.84 0-.74-.06-1.44-.18-2.08l-11.44-.02z"/></svg>
                            </button>
                            <button type="button" className="w-14 h-11 bg-[#ececec] flex items-center justify-center rounded-lg hover:bg-[#e0e0e0] transition-colors">
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </button>
                            <button type="button" className="w-14 h-11 bg-[#ececec] flex items-center justify-center rounded-lg hover:bg-[#e0e0e0] transition-colors">
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05 1.78-3.3 1.78-1.18 0-1.55-.73-2.92-.73-1.38 0-1.8.71-2.92.71-1.17 0-2.36-.93-3.38-2.4C2.45 16.6 1.15 11.23 3.25 7.57c1.04-1.8 2.88-2.94 4.88-2.94 1.53 0 2.97 1.05 3.91 1.05.9 0 2.66-1.25 4.51-1.07 1.9.18 3.32 1 4.14 2.21-3.6 2.16-3.01 6.81.67 8.32-.73 2.1-2.45 5.17-4.31 7.14zM14.65 1.5c-1.18 0-2.6.76-3.4 1.7-.82.97-1.52 2.36-1.32 3.73 1.25.1 2.63-.67 3.44-1.63.8-.96 1.39-2.28 1.28-3.8z"/></svg>
                            </button>
                        </div>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
