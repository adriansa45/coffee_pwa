"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setBrandColor } = useTheme();

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
        <Card className="w-full bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden rounded-3xl">
            <CardHeader className="text-white">
                <CardTitle className="text-2xl font-bold tracking-tight">Inicia sesión</CardTitle>
                <CardDescription className="text-white/60 font-medium">
                    Ingresa tus credenciales para acceder a tu pasaporte.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert className="bg-red-500/10 border-red-500/50 text-red-200">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/80 font-semibold ml-1">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:ring-primary/60 focus:border-primary/60 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white/80 font-semibold ml-1">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:ring-primary/60 focus:border-primary/60 transition-all"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pb-8">
                    <Button
                        type="submit"
                        className="w-full h-14 mt-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        Iniciar sesión
                    </Button>

                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="bg-transparent px-4 text-white/40">
                                O continúa con
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all"
                        onClick={handleGithubSignIn}
                    >
                        <Github className="mr-3 h-5 w-5" />
                        GitHub
                    </Button>

                    <div className="text-sm text-center text-white/60 font-medium">
                        ¿No tienes cuenta?{" "}
                        <Link href="/auth/signup" className="text-primary/40 hover:text-brand-300 font-bold hover:underline transition-colors ml-1">
                            Regístrate
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
