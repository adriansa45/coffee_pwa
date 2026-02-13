"use client";

import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, User } from "lucide-react";
import Link from "next/link";
import { getUserFollowers, getUserFollowing } from "@/actions/social";

interface SocialDetailDrawerProps {
    userId: string;
    type: "followers" | "following";
    trigger: React.ReactNode;
}

export function SocialDetailDrawer({ userId, type, trigger }: SocialDetailDrawerProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                setLoading(true);
                const res = type === "followers" 
                    ? await getUserFollowers(userId) 
                    : await getUserFollowing(userId);
                
                if (res.success) {
                    setUsers(res.data);
                }
                setLoading(false);
            };
            fetchData();
        }
    }, [open, userId, type]);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {trigger}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>
                            {type === "followers" ? "Seguidores" : "Siguiendo"}
                        </DrawerTitle>
                        <DrawerDescription>
                            {type === "followers" 
                                ? "Usuarios que siguen a esta persona" 
                                : "Usuarios a los que esta persona sigue"}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : users.length > 0 ? (
                            <div className="space-y-4">
                                {users.map((u) => (
                                    <DrawerClose key={u.id} asChild>
                                        <Link 
                                            href={`/users/${u.id}`}
                                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                                        >
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={u.image || ""} />
                                                <AvatarFallback className="bg-primary/5 text-primary font-bold text-xs">
                                                    {u.name?.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-bold text-sm text-zinc-800">{u.name}</span>
                                        </Link>
                                    </DrawerClose>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-zinc-400 font-medium text-sm">
                                <User className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                No hay usuarios para mostrar
                            </div>
                        )}
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Cerrar</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
