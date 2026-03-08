"use client";

import { useState } from "react";
import { registerVisitByCode } from "@/actions/visits";
import { QRScanner } from "@/components/qr-scanner";
import { QRScanner } from "@/components/qr-scanner";
import { 
    QrCode, 
    ArrowLeft, 
    CheckCircle2, 
    XCircle,
    Loader2,
    CalendarCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function StaffScanPage() {
    const { data: session } = authClient.useSession();
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle' | 'loading', message: string }>({ type: 'idle', message: '' });
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle' | 'loading', message: string }>({ type: 'idle', message: '' });
    const router = useRouter();

    const handleScan = async (code: string) => {
        setIsScannerOpen(false);
        setScannedCode(code);
        setStatus({ type: 'loading', message: 'Registrando visita...' });

        const result = await registerVisitByCode(code);

        if (result.success) {
            setStatus({ type: 'success', message: result.message || 'Visita registrada con éxito' });
        } else {
            setStatus({ type: 'error', message: result.message || 'Error al registrar la visita' });
        }
    };

    const reset = () => {
        setScannedCode(null);
        setStatus({ type: 'idle', message: '' });
    };

    if (!session || !["coffee_shop", "CafeStaff", "CafeAdmin"].includes((session.user as any).role)) {
         return (
             <div className="p-12 text-center space-y-4">
                 <p className="font-bold text-red-500">No tienes permisos para acceder a esta área.</p>
                 <Button asChild><Link href="/home">Volver al inicio</Link></Button>
             </div>
         );
    }

    return (
        <div className="p-6 pt-18 pb-28 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto min-h-screen flex flex-col justify-center">
            
            <header className="fixed top-0 left-0 right-0 p-6 bg-card/80 backdrop-blur-md z-40 flex items-center gap-4 border-b border-primary/5">
                <button 
                    onClick={() => router.back()}
                    className="p-2 rounded-xl bg-card border border-primary/10 shadow-sm active:scale-95 transition-all text-primary"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-black tracking-tight text-primary">
                    Registro de Visitas
                </h1>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                
                {status.type === 'idle' && (
                    <div className="text-center space-y-6">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center mx-auto mb-8">
                            <QrCode className="w-12 h-12 text-primary/40" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-foreground">Escaneo de Cliente</h2>
                            <p className="text-sm font-medium text-foreground/40 max-w-[250px] mx-auto">
                                Pide el código QR del cliente y escanéalo para registrar su visita.
                            </p>
                        </div>
                        <Button 
                            onClick={() => setIsScannerOpen(true)}
                            className="w-full py-8 rounded-[2rem] text-lg font-black shadow-xl shadow-primary/20 gap-3"
                        >
                            <QrCode size={24} />
                            Abrir Escáner
                        </Button>
                    </div>
                )}

                {status.type === 'loading' && (
                    <div className="text-center space-y-4">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
                        <p className="font-bold text-foreground/60">{status.message}</p>
                    </div>
                )}

                {status.type === 'success' && (
                    <div className="text-center space-y-8 w-full animate-in zoom-in duration-300">
                        <div className="w-40 h-40 rounded-[3rem] bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-emerald-600">¡Registrado!</h2>
                            <p className="text-lg font-bold text-foreground/60">{status.message}</p>
                        </div>
                        <div className="space-y-3 pt-6">
                            <Button onClick={reset} className="w-full py-7 rounded-2xl font-black text-lg bg-emerald-600 hover:bg-emerald-700">
                                Siguiente Cliente
                            </Button>
                            <Button variant="ghost" asChild className="w-full">
                                <Link href="/shop-admin/dashboard">Ver Dashboard</Link>
                            </Button>
                        </div>
                    </div>
                )}

                {status.type === 'error' && (
                    <div className="text-center space-y-8 w-full animate-in zoom-in duration-300">
                        <div className="w-40 h-40 rounded-[3rem] bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto shadow-inner">
                            <XCircle className="w-20 h-20 text-red-500" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-red-600">Error</h2>
                            <p className="text-base font-bold text-foreground/40 bg-red-50 p-4 rounded-2xl border border-red-100">
                                {status.message}
                            </p>
                        </div>
                        <div className="pt-6">
                            <Button onClick={reset} variant="outline" className="w-full py-7 rounded-2xl font-black text-lg border-red-200 text-red-600 hover:bg-red-50">
                                Reintentar
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {isScannerOpen && (
                <QRScanner 
                    onScan={handleScan}
                    onClose={() => setIsScannerOpen(false)}
                />
            )}

            <div className="text-center text-[10px] font-bold text-foreground/20 uppercase tracking-widest pb-4">
                Staff ID: {session?.user?.id}
            </div>
        </div>
    );
}
