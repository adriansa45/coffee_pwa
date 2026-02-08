"use client";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export function UserQRDrawer() {
    const { data: session, isPending } = authClient.useSession();
    // Cast user to include userCode as it's added via additionalFields
    const userCode = session?.user ? (session.user as any).userCode as string : null;

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <button className="absolute bottom-40 right-5 z-[500] w-14 h-14 bg-white text-foreground rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border-2 border-primary/10">
                    <QrCode size={24} />
                </button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="text-center">
                        <DrawerTitle className="text-2xl font-bold text-foreground">Tu Pasaporte Café</DrawerTitle>
                        <DrawerDescription>
                            Muestra este código en la caja para registrar tu visita.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col items-center justify-center p-6 pb-8">
                        {isPending ? (
                            <Skeleton className="w-64 h-64 rounded-xl" />
                        ) : userCode ? (
                            <div className="bg-white p-4 rounded-2xl border-2 border-primary/10 shadow-sm">
                                <QRCode
                                    value={userCode}
                                    size={256}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 256 256`}
                                />
                                <p className="text-center mt-4 font-mono text-lg font-bold text-foreground/90 tracking-widest">
                                    {userCode}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-red-50 rounded-xl text-red-600">
                                <p>No se pudo cargar tu código.</p>
                            </div>
                        )}
                        <p className="text-xs text-center text-gray-400 mt-6 max-w-[250px]">
                            El código se actualiza automáticamente. No lo compartas con nadie.
                        </p>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
