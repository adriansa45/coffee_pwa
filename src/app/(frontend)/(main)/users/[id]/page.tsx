import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserProfile } from "@/actions/user";
import { getUserVisits } from "@/actions/visits";
import { getUserReviews } from "@/actions/reviews";
import { isFollowing, getFollowedShops } from "@/actions/social";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/social/follow-button";
import { Coffee, MapPin, Star, Calendar, MessageSquare, ChevronRight, Heart, Utensils, Home, DollarSign, Users, Settings, Menu } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SocialDetailDrawer } from "@/components/social/social-detail-drawer";

export default async function UserProfilePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const userId = params.id;
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const currentUserId = session?.user?.id;
    const isOwnProfile = currentUserId === userId;

    const { data: profile } = await getUserProfile(userId);
    const following = isOwnProfile ? false : await isFollowing(userId);
    const { data: visits } = await getUserVisits(userId);
    const { data: reviews } = await getUserReviews(userId);
    const { data: followedShops } = await getFollowedShops(userId);

    if (!profile) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
            <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Coffee size={32} className="text-muted-foreground/30" />
            </div>
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Usuario no encontrado</h2>
            <p className="text-sm text-muted-foreground mt-1 lowercase first-letter:uppercase">El perfil que buscas no existe o ha sido eliminado.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background pb-28">
            {/* Header Area - Compact & Subtle */}
            <div className="relative pt-16 pb-8 px-6 animate-in fade-in slide-in-from-top-4 duration-700">
                {isOwnProfile && (
                    <Link 
                        href="/profile" 
                        className="absolute right-6 top-16 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Menu size={20} />
                    </Link>
                )}
                <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 border-2 border-white shadow-sm mb-4">
                        <AvatarImage src={profile.image || ""} />
                        <AvatarFallback className="bg-primary/5 text-primary font-black text-xl">
                            {profile.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <h1 className="text-2xl font-black text-foreground tracking-tighter uppercase">{profile.name}</h1>
                    <div className="flex items-center gap-1.5 text-primary/60 mt-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Coffee size={12} /> Entusiasta del Café
                    </div>

                    {!isOwnProfile && (
                        <div className="mb-6">
                            <FollowButton userId={userId} initialIsFollowing={following} variant="profile" />
                        </div>
                    )}

                    <div className="flex gap-8 mt-2 mb-2">
                        <SocialDetailDrawer 
                            userId={userId} 
                            type="followers" 
                            trigger={
                                <button className="flex flex-col items-center group">
                                    <span className="text-xl font-black text-foreground tracking-tight">{(profile as any).stats.followers || 0}</span>
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">Seguidores</span>
                                </button>
                            }
                        />
                        <SocialDetailDrawer 
                            userId={userId} 
                            type="following" 
                            trigger={
                                <button className="flex flex-col items-center group">
                                    <span className="text-xl font-black text-foreground tracking-tight">{(profile as any).stats.following || 0}</span>
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">Siguiendo</span>
                                </button>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="px-6 -mt-6 grid grid-cols-2 gap-4 mb-8">
                <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/40 shadow-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shadow-inner">
                        <Star size={18} />
                    </div>
                    <div>
                        <p className="text-lg font-black text-foreground leading-none">{profile.stats.reviews}</p>
                        <p className="text-[9px] font-black text-muted-foreground uppercase mt-1 tracking-wider">Reseñas</p>
                    </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/40 shadow-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shadow-inner">
                        <Coffee size={18} />
                    </div>
                    <div>
                        <p className="text-lg font-black text-foreground leading-none">{profile.stats.visits}</p>
                        <p className="text-[9px] font-black text-muted-foreground uppercase mt-1 tracking-wider">Visitas</p>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="px-6">
                <Tabs defaultValue="reviews" className="w-full">
                    <TabsList className="w-full bg-muted/40 rounded-xl p-1 border border-border/40 mb-8 h-12">
                        <TabsTrigger value="reviews" className="flex-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] py-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all text-muted-foreground">
                            Reseñas
                        </TabsTrigger>
                        <TabsTrigger value="visits" className="flex-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] py-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all text-muted-foreground">
                            Visitas
                        </TabsTrigger>
                        <TabsTrigger value="shops" className="flex-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] py-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all text-muted-foreground">
                            Cafés
                        </TabsTrigger>

                    </TabsList>

                    <TabsContent value="visits" className="mt-0">
                        {visits && visits.length > 0 ? (
                            <div className="space-y-2.5">
                                {visits.map((visit: any) => (
                                    <Link 
                                        key={visit.id} 
                                        href={`/shops/${visit.shop.id}`}
                                        className="block group"
                                    >
                                        <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/40 group-hover:border-primary/30 transition-all active:scale-[0.98]">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                                        <Coffee size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{visit.shop.name}</h4>
                                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                                            <Calendar size={10} />
                                                            {new Date(visit.visitedAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={14} className="text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-20 px-6">
                                <div className="bg-muted/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-border/40">
                                    <MapPin size={20} className="text-muted-foreground/30" />
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest text-center">Aún no hay visitas registradas</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-0">
                        {reviews && reviews.length > 0 ? (
                            <div className="space-y-3">
                                {reviews.map((rev: any) => (
                                    <div key={rev.id} className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/40 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Link href={`/shops/${rev.shopId}`} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                                                {rev.shopName} <ChevronRight size={10} />
                                            </Link>
                                            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                                <Star size={10} className="fill-amber-400 text-amber-400" />
                                                <span className="text-[10px] font-black text-amber-700">{rev.rating}</span>
                                            </div>
                                        </div>

                                        {rev.comment && (
                                            <p className="text-sm text-foreground/80 leading-relaxed italic">
                                                "{rev.comment}"
                                            </p>
                                        )}

                                        {/* Category Ratings Display as Badges */}
                                        {/* Category Ratings Display as Badges */}
                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                            {Number(rev.coffeeRating) > 0 && (
                                                <div className="flex items-center gap-1 bg-amber-500/5 text-[8px] font-black px-2 py-0.5 rounded-full border border-amber-500/10 text-amber-500/80 uppercase tracking-wider">
                                                    <Coffee size={8} />
                                                    <span>{Number(rev.coffeeRating).toFixed(1)}</span>
                                                </div>
                                            )}
                                            {Number(rev.foodRating) > 0 && (
                                                <div className="flex items-center gap-1 bg-orange-500/5 text-[8px] font-black px-2 py-0.5 rounded-full border border-orange-500/10 text-orange-500/80 uppercase tracking-wider">
                                                    <Utensils size={8} />
                                                    <span>{Number(rev.foodRating).toFixed(1)}</span>
                                                </div>
                                            )}
                                            {Number(rev.placeRating) > 0 && (
                                                <div className="flex items-center gap-1 bg-blue-500/5 text-[8px] font-black px-2 py-0.5 rounded-full border border-blue-500/10 text-blue-500/80 uppercase tracking-wider">
                                                    <Home size={8} />
                                                    <span>{Number(rev.placeRating).toFixed(1)}</span>
                                                </div>
                                            )}
                                            {Number(rev.priceRating) > 0 && (
                                                <div className="flex items-center gap-1 bg-emerald-500/5 text-[8px] font-black px-2 py-0.5 rounded-full border border-emerald-500/10 text-emerald-500/80 uppercase tracking-wider">
                                                    <DollarSign size={8} />
                                                    <span>{Number(rev.priceRating).toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                            <div className="flex items-center gap-2 group">
                                                <Heart 
                                                    size={14} 
                                                    className={cn(
                                                        "transition-all",
                                                        rev.isLiked ? "fill-rose-500 text-rose-500" : "fill-muted-foreground/30 text-muted-foreground/30 group-hover:text-rose-400"
                                                    )} 
                                                />
                                                <span className="text-[10px] font-black text-muted-foreground/60">{rev.likeCount}</span>
                                            </div>
                                            <span className="text-[9px] font-black text-muted-foreground tracking-widest uppercase">
                                                {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-20 px-6">
                                <div className="bg-muted/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-border/40">
                                    <MessageSquare size={20} className="text-muted-foreground/30" />
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest text-center">Aún no hay reseñas escritas</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="shops" className="mt-0">
                        {followedShops && followedShops.length > 0 ? (
                            <div className="space-y-2.5">
                                <div className="px-1 mb-4">
                                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">
                                        Siguiendo {followedShops.length} {followedShops.length === 1 ? "cafetería" : "cafeterías"}
                                    </p>
                                </div>
                                {followedShops.map((shop: any) => (
                                    <Link 
                                        key={shop.id} 
                                        href={`/shops/${shop.id}`}
                                        className="block group"
                                    >
                                        <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/40 group-hover:border-primary/30 transition-all active:scale-[0.98]">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden group-hover:border-primary/40 transition-all">
                                                        {shop.image ? (
                                                            <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <Coffee size={20} className="text-primary/40" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{shop.name}</h4>
                                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mt-0.5">
                                                            <Calendar size={10} className="text-primary/40" />
                                                            Desde {new Date(shop.followedAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={14} className="text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-20 px-6">
                                <div className="bg-muted/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-border/40">
                                    <Coffee size={20} className="text-muted-foreground/30" />
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest text-center">Aún no sigues cafeterías</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
