"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { ReviewForm } from "./review-form";

interface ShopActionProps {
    shopId: string;
    shopName: string;
}

export function ShopAction({ shopId, shopName }: ShopActionProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsFormOpen(true)}
                className="w-full h-14 bg-white hover:bg-zinc-50 text-primary border-2 border-primary/20 hover:border-primary/40 rounded-[2rem] font-black text-base transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2.5"
            >
                <div className="bg-primary/5 p-1.5 rounded-lg">
                    <MessageSquare size={18} className="text-primary" />
                </div>
                Escribir Reseña
            </button>

            <ReviewForm 
                shopId={shopId} 
                shopName={shopName} 
                isOpen={isFormOpen} 
                onOpenChange={setIsFormOpen} 
            />
        </>
    );
}
