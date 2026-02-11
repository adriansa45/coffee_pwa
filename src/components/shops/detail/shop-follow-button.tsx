"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toggleFollowShop } from "@/actions/coffee-shops";

interface ShopFollowButtonProps {
    shopId: string;
    initialIsFollowing?: boolean;
}

export function ShopFollowButton({ shopId, initialIsFollowing = false }: ShopFollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = authClient.useSession();

    if (!session) return null;

    const toggleFollow = async () => {
        if (isLoading) return;

        setIsLoading(true);
        // Optimistic update
        const prev = isFollowing;
        setIsFollowing(!prev);

        try {
            const result = await toggleFollowShop(shopId);
            if (result.success) {
                setIsFollowing(result.isFollowing ?? !prev);
            } else {
                // Revert on failure
                setIsFollowing(prev);
            }
        } catch (error) {
            setIsFollowing(prev);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFollow}
            disabled={isLoading}
            className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 border-2 shadow-sm",
                isFollowing 
                    ? "bg-rose-50 border-rose-100 text-rose-500 shadow-rose-100" 
                    : "bg-white border-zinc-100 text-zinc-300 hover:text-rose-400 hover:border-rose-100 hover:bg-rose-50/50",
                isLoading && "opacity-70"
            )}
        >
            <Heart className={cn("w-5 h-5 transition-transform", isFollowing && "fill-rose-500 scale-110")} />
        </button>
    );
}
