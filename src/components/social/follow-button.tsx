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
                    "h-8 px-4 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 border shadow-sm text-[10px] uppercase tracking-wider",
                    isFollowing
                        ? "bg-rose-50 border-rose-100 text-rose-600 shadow-rose-100/50"
                        : "bg-white text-zinc-500 border-zinc-100 hover:bg-rose-50/50 hover:text-rose-600 hover:border-rose-100"
                )}
            >
                {isPending ? <Loader2 size={12} className="animate-spin" /> :
                    isFollowing ? <Check size={12} /> : <UserPlus size={12} />}
                <span>{isFollowing ? "Siguiendo" : "Seguir"}</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleAction}
            disabled={isPending}
            className={cn(
                "p-2 rounded-lg transition-all active:scale-90 disabled:opacity-50 border shadow-sm",
                isFollowing
                    ? "bg-rose-50 border-rose-100 text-rose-600 shadow-rose-100/30"
                    : "bg-zinc-50 border-zinc-100 text-zinc-400 hover:text-rose-500 hover:bg-rose-50/50"
            )}
        >
            {isPending ? <Loader2 size={16} className="animate-spin" /> :
                isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
        </button>
    );
}
