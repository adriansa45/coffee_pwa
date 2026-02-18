"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const router = useRouter();

    const handleLogin = () => {
        onClose();
        router.push("/auth/login");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white/80 backdrop-blur-xl border-white/20 rounded-[2rem] shadow-2xl">
                <DialogHeader className="pt-4">
                    <DialogTitle className="text-2xl font-black text-center text-foreground leading-tight">
                        ¡Hola, explorador! ☕
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 font-medium pt-2">
                        Inicia sesión o crea una cuenta para avanzar y disfrutar de todas las funciones.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col gap-3 py-6">
                    <Button
                        onClick={handleLogin}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 text-sm tracking-widest uppercase flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        INICIAR SESIÓN
                    </Button>
                    <Button
                        onClick={handleLogin}
                        variant="outline"
                        className="w-full h-14 border-2 border-primary/20 hover:bg-primary/5 text-primary font-bold rounded-2xl transition-all active:scale-95 text-sm tracking-widest uppercase flex items-center justify-center gap-2"
                    >
                        <UserPlus className="w-5 h-5" />
                        CREAR CUENTA
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
