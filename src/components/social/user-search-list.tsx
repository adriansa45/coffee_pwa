"use client";

import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "./follow-button";
import Link from "next/link";

export function UserSearchList({ initialUsers, query }: { initialUsers: any[], query: string }) {
    if (!query) {
        return (
            <div className="text-center py-20">
                <p className="text-brand-900/40 font-medium">Empieza a escribir para buscar personas</p>
            </div>
        );
    }

    if (initialUsers.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-brand-900/40 font-medium">No se encontraron usuarios con "{query}"</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xs font-bold text-brand-900/30 uppercase tracking-[0.2em]">Resultados</h2>
            <div className="divide-y divide-brand-50">
                {initialUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 py-4 group">
                        <Link href={`/users/${user.id}`} className="flex items-center gap-4 flex-1">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="bg-brand-100 text-brand-700 font-bold">
                                    {user.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-brand-950 group-hover:text-brand-600 transition-colors">{user.name}</p>
                                <p className="text-xs text-brand-500 font-medium">Fan del café</p>
                            </div>
                        </Link>

                        <FollowButton userId={user.id} initialIsFollowing={false} />
                    </div>
                ))}
            </div>
        </div>
    );
}
