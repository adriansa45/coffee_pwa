"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRScannerProps {
    onScan: (code: string) => void;
    onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const qrCodeRegionId = "qr-reader";

    useEffect(() => {
        const startScanner = async () => {
            try {
                const scanner = new Html5Qrcode(qrCodeRegionId);
                scannerRef.current = scanner;

                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    async (decodedText) => {
                        // Success callback
                        await stopScanner();
                        onScan(decodedText);
                    },
                    (errorMessage) => {
                        // Error callback - can be ignored for scanning errors
                        // console.log("Scanning...", errorMessage);
                    }
                );

                setIsScanning(true);
            } catch (err: any) {
                console.error("Error starting scanner:", err);
                setError("No se pudo acceder a la cámara. Verifica los permisos.");
            }
        };

        startScanner();

        return () => {
            stopScanner();
        };
    }, []);

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                const state = await scannerRef.current.getState();
                if (state === 2) { // 2 = SCANNING state
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
                setIsScanning(false);
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
        }
    };

    const handleClose = async () => {
        await stopScanner();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[3000] bg-black/95 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-primary/90">
                <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-white" />
                    <h2 className="text-white font-bold text-lg">Escanear Código QR</h2>
                </div>
                <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Scanner Area */}
            <div className="flex-1 flex items-center justify-center p-4">
                {error ? (
                    <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-6 max-w-md">
                        <div className="text-center">
                            <p className="text-red-700 font-medium mb-4">{error}</p>
                            <Button onClick={handleClose} variant="outline">
                                Cerrar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md">
                        <div id={qrCodeRegionId} className="rounded-2xl overflow-hidden"></div>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="p-6 bg-foreground/90/50 backdrop-blur-sm">
                <p className="text-white text-center text-sm">
                    Apunta la cámara al código QR del cliente
                </p>
            </div>
        </div>
    );
}
