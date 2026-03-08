"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Coffee, MessageSquare, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface SocialActivity {
    id: string;
    type: 'visit' | 'review';
    userId: string;
    userName: string;
    userImage?: string | null;
    shopId: string;
    shopName: string;
    rating?: string;
    comment?: string | null;
    date: Date;
}

interface SocialFeedProps {
    activities: SocialActivity[];
}

export function SocialFeed({ activities }: SocialFeedProps) {
    if (!activities || activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-2xl border border-dashed border-border text-center">
                <Coffee className="size-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No hay actividad de tus amigos aún.</p>
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mt-1">¡Sigue a más personas para ver sus visitas!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 px-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase">Actividad Social</h2>
                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.25em]">De tus amigos</p>
            </div>

            <div className="flex flex-col gap-4">
                {activities.map((activity) => (
                    <Card key={activity.id} className="p-4 bg-card border-border flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-10 border border-border">
                                    <AvatarImage src={activity.userImage || ""} />
                                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                                        {activity.userName.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold text-foreground leading-none">{activity.userName}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1 lowercase first-letter:uppercase">
                                        {formatDistanceToNow(activity.date, { addSuffix: true, locale: es })}
                                    </p>
                                </div>
                            </div>
                            <div className={cn(
                                "px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border",
                                activity.type === 'visit' ? "bg-success/10 text-success border-success/20" : "bg-primary/10 text-primary border-primary/20"
                            )}>
                                {activity.type === 'visit' ? 'Visita' : 'Reseña'}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pl-1.5 border-l-2 border-primary/10">
                            <p className="text-xs text-foreground/80">
                                {activity.type === 'visit' ? (
                                    <>Visitó <span className="font-bold text-foreground">{activity.shopName}</span></>
                                ) : (
                                    <>Reseñó <span className="font-bold text-foreground">{activity.shopName}</span></>
                                )}
                            </p>

                            {activity.type === 'review' && (
                                <div className="flex flex-col gap-2 bg-muted/30 p-3 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={10} 
                                                className={cn(
                                                    "fill-muted-foreground/20 text-muted-foreground/20",
                                                    i < Math.round(Number(activity.rating || 0)) && "fill-primary text-primary"
                                                )} 
                                            />
                                        ))}
                                    </div>
                                    {activity.comment && (
                                        <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                                            "{activity.comment}"
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
