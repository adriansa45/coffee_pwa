"use client";

import { useState, useEffect } from "react";
import { registerVisitByCode } from "@/actions/visits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Coffee, Loader2, CheckCircle, AlertCircle, Camera, Keyboard } from "lucide-react";
import { QRScanner } from "@/components/qr-scanner";

export default function ShopDashboardPage() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);
    const [showScanner, setShowScanner] = useState(false);

    // Auto-dismiss message after 3 seconds
    useEffect(() => {
        if (lastResult) {
            const timer = setTimeout(() => {
                setLastResult(null);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [lastResult]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || code.length < 8) return;

        setLoading(true);
        setLastResult(null);

        try {
            const res = await registerVisitByCode(code.toUpperCase());
            
            setLastResult(res);
            if (res.success) {
                setCode("");
            }
        } catch (error) {
            setLastResult({ success: false, message: "Error de conexión" });
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async (scannedCode: string) => {
        setShowScanner(false);
        setCode(scannedCode.toUpperCase());
        
        // Auto-submit after scanning
        setLoading(true);
        setLastResult(null);

        try {
            const res = await registerVisitByCode(scannedCode.toUpperCase());
            setLastResult(res);
            if (res.success) {
                setCode("");
            }
        } catch (error) {
            setLastResult({ success: false, message: "Error de conexión" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showScanner && (
                <QRScanner
                    onScan={handleScan}
                    onClose={() => setShowScanner(false)}
                />
            )}

            <div className="p-6 pt-24 pb-28 flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md border-primary/10 shadow-xl bg-white">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 text-white">
                            <Coffee size={32} />
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground">Panel de Cafetería</CardTitle>
                        <CardDescription>
                            Escanea el QR o ingresa el código del cliente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Scan Button */}
                            <Button
                                type="button"
                                onClick={() => setShowScanner(true)}
                                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                            >
                                <Camera size={24} />
                                Escanear QR
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">o ingresa manualmente</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-foreground/90 font-bold">Código del Cliente</Label>
                                <Input
                                    id="code"
                                    placeholder="Ej. A1B2C3D4"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="text-center text-2xl font-mono tracking-widest uppercase h-14 border-2 focus-visible:ring-primary/60"
                                    maxLength={8}
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 text-lg font-bold bg-primary/90 hover:bg-primary/80"
                                disabled={loading || code.length < 8}
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <Keyboard className="mr-2" size={20} />}
                                Registrar Visita
                            </Button>

                            {lastResult && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                                    lastResult.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                                } animate-in fade-in zoom-in-95`}>
                                    {lastResult.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    <p className="font-medium text-sm">{lastResult.message}</p>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
