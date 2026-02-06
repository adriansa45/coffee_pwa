"use client";

import { useState, useTransition } from "react";
import { followUser, unfollowUser } from "@/actions/social";
import { UserPlus, UserMinus, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
    userId: string;
    initialIsFollowing: boolean;
    variant?: "default" | "profile";
}

export function FollowButton({ userId, initialIsFollowing, variant = "default" }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isPending, startTransition] = useTransition();

    const handleAction = () => {
        startTransition(async () => {
            if (isFollowing) {
                const res = await unfollowUser(userId);
                if (res.success) setIsFollowing(false);
            } else {
                const res = await followUser(userId);
                if (res.success) setIsFollowing(true);
            }
        });
    };

    if (variant === "profile") {
        return (
            <button
                onClick={handleAction}
                disabled={isPending}
                className={cn(
                    "px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all duration-300 shadow-md transform hover:scale-105 active:scale-95 disabled:opacity-50",
                    isFollowing
                        ? "bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-white/30"
                        : "bg-white text-brand-600 hover:bg-brand-50 shadow-xl"
                )}
            >
                {isPending ? <Loader2 size={20} className="animate-spin" /> :
                    isFollowing ? <><Check size={20} /> Siguiendo</> : <><UserPlus size={20} /> Seguir</>}
            </button>
        );
    }

    return (
        <button
            onClick={handleAction}
            disabled={isPending}
            className={cn(
                "p-2.5 rounded-2xl transition-all duration-300 transform active:scale-90 disabled:opacity-50 shadow-sm",
                isFollowing
                    ? "bg-brand-100 text-brand-600 hover:bg-red-50 hover:text-red-600"
                    : "bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white"
            )}
        >
            {isPending ? <Loader2 size={18} className="animate-spin" /> :
                isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />}
        </button>
    );
}
