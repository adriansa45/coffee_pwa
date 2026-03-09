"use client";

import { Card } from "@/components/ui/card";
import { Copy, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PassportQRProps {
    userCode: string | null;
}

export function PassportQR({ userCode }: PassportQRProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!userCode) return;
        navigator.clipboard.writeText(userCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!userCode) return null;

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            <h3 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">Tu Identificador</h3>

            <Card className="relative overflow-hidden p-6 border-border/40 bg-card/50 backdrop-blur-sm shadow-2xl flex flex-col items-center gap-6 group">
                {/* Background Decoration */}
                <div className="absolute -top-10 -right-10 size-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
                <div className="absolute -bottom-10 -left-10 size-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />

                {/* QR Container */}
                <div className="relative p-4 bg-white rounded-2xl border-4 border-primary/20 shadow-inner z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                    <QRCode
                        value={userCode}
                        size={180}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        viewBox={`0 0 256 256`}
                        fgColor="#000000"
                    />

                </div>

                <div className="flex flex-col items-center gap-2 z-10">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 hover:bg-primary/20 transition-all active:scale-95 group/btn"
                    >
                        <span className="font-mono text-xs font-black text-foreground tracking-[0.2em]">{userCode}</span>
                        {/* {copied ? (
                            <span className="text-[10px] text-primary font-bold uppercase animate-in zoom-in-50">¡Copiado!</span>
                        ) : (
                            <Copy size={16} className="text-primary/40 group-hover/btn:text-primary transition-colors" />
                        )} */}
                    </button>
                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest text-center max-w-[250px] mt-1">
                        Muestra este código para registrar tu visita y acumular puntos.
                    </p>
                </div>

                
            </Card>
        </div>
    );
}
