"use client";

import { MessageSquare } from "lucide-react";
import { useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { ReviewForm } from "./review-form";

import { authClient } from "@/lib/auth-client";

interface ShopActionProps {
    shopId: string;
    shopName: string;
}

export function ShopAction({ shopId, shopName }: ShopActionProps) {
    const { data: session } = authClient.useSession();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleWriteReview = () => {
        if (!session) {
            setIsAuthModalOpen(true);
            return;
        }
        setIsFormOpen(true);
    };

    return (
        <>
            <button
                onClick={handleWriteReview}
                className="w-full h-12 bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-100 rounded-[1.5rem] font-bold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2.5"
            >
                <div className="bg-zinc-50 p-1.5 rounded-lg text-zinc-400">
                    <MessageSquare size={16} />
                </div>
                Escribir Reseña
            </button>

            <ReviewForm
                shopId={shopId}
                shopName={shopName}
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}
