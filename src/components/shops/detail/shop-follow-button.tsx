"use client";

import { toggleFollowShop } from "@/actions/coffee-shops";
import { AuthModal } from "@/components/auth-modal";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";

interface ShopFollowButtonProps {
    shopId: string;
    initialIsFollowing?: boolean;
}

export function ShopFollowButton({ shopId, initialIsFollowing = false }: ShopFollowButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [optimisticFollowing, addOptimisticFollowing] = useOptimistic(
        initialIsFollowing,
        (state: boolean, newState: boolean) => newState
    );
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const toggleFollow = async () => {
        if (!session) {
            setIsAuthModalOpen(true);
            return;
        }

        startTransition(async () => {
            const nextValue = !optimisticFollowing;
            addOptimisticFollowing(nextValue);

            try {
                const result = await toggleFollowShop(shopId);
                // If it fails, the optimistic update will be reverted automatically 
                // when the action finishes because we are using useOptimistic 
                // linked to the state coming from props/parent (though here it's simple initialValue).
                // Note: In a real scenario, the parent should update the prop to persist the change.
                if (!result.success) {
                    console.error("Failed to toggle follow");
                }
            } catch (error) {
                console.error("Error toggling follow:", error);
            }
        });
    };

    return (
        <>
            <button
                onClick={toggleFollow}
                disabled={isPending}
                className={cn(
                    "h-8 px-3 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 border shadow-sm font-bold text-[10px] uppercase tracking-wider",
                    optimisticFollowing
                        ? "bg-destructive/10 border-destructive/20 text-destructive shadow-destructive/5"
                        : "bg-muted border-border text-muted-foreground hover:text-destructive hover:border-destructive/20 hover:bg-destructive/5",
                    isPending && "opacity-70 cursor-not-allowed"
                )}
            >
                <Heart className={cn("w-3.5 h-3.5 transition-transform", optimisticFollowing && "fill-destructive scale-110")} />
                <span>{optimisticFollowing ? "Dejar de seguir" : "Seguir"}</span>
            </button>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}
