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
            <div className="bg-zinc-50 p-4 rounded-full mb-4">
                <Coffee size={32} className="text-zinc-300" />
            </div>
            <h2 className="text-xl font-bold text-zinc-800">Usuario no encontrado</h2>
            <p className="text-sm text-zinc-500 mt-1">El perfil que buscas no existe o ha sido eliminado.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white pb-28">
            {/* Header Area - Compact & Subtle */}
            <div className="relative pt-16 pb-8 px-6">
                {isOwnProfile && (
                    <Link 
                        href="/profile" 
                        className="absolute right-6 top-16 text-zinc-400 hover:text-zinc-900 transition-colors"
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

                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{profile.name}</h1>
                    <div className="flex items-center gap-1.5 text-zinc-400 mt-1.5 mb-6 text-xs font-bold uppercase tracking-wide">
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
                                <button className="flex flex-col items-center">
                                    <span className="text-lg font-bold text-zinc-900 leading-none">{(profile as any).stats.followers || 0}</span>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Seguidores</span>
                                </button>
                            }
                        />
                        <SocialDetailDrawer 
                            userId={userId} 
                            type="following" 
                            trigger={
                                <button className="flex flex-col items-center">
                                    <span className="text-lg font-bold text-zinc-900 leading-none">{(profile as any).stats.following || 0}</span>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Siguiendo</span>
                                </button>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="px-6 -mt-6 grid grid-cols-2 gap-3 mb-8">

                <div className="bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm shadow-amber-100">
                        <Star size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-900 leading-none">{profile.stats.reviews}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Reseñas</p>
                    </div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm shadow-emerald-100">
                        <Coffee size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-900 leading-none">{profile.stats.visits}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Visitas</p>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="px-6">
                <Tabs defaultValue="reviews" className="w-full">
                    <TabsList className="w-full bg-zinc-50 rounded-lg p-1 border border-zinc-100 mb-6">
                        <TabsTrigger value="reviews" className="flex-1 rounded-md text-[10px] uppercase tracking-wider font-bold py-1.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all text-zinc-400">
                            Reseñas
                        </TabsTrigger>
                        <TabsTrigger value="visits" className="flex-1 rounded-md text-[10px] uppercase tracking-wider font-bold py-1.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all text-zinc-400">
                            Visitas
                        </TabsTrigger>
                        <TabsTrigger value="shops" className="flex-1 rounded-md text-[10px] uppercase tracking-wider font-bold py-1.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all text-zinc-400">
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
                                        className="block bg-white p-3 rounded-lg border border-zinc-100 active:scale-[0.98] transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                                                    <Coffee size={18} className="text-zinc-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-zinc-900">{visit.shop.name}</h4>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5">
                                                        <Calendar size={10} />
                                                        {new Date(visit.visitedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-zinc-300" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 px-6">
                                <div className="bg-zinc-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin size={20} className="text-zinc-200" />
                                </div>
                                <p className="text-sm font-bold text-zinc-300">Aún no hay visitas registradas</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-0">
                        {reviews && reviews.length > 0 ? (
                            <div className="space-y-3">
                                {reviews.map((rev: any) => (
                                    <div key={rev.id} className="bg-zinc-50/50 p-4 rounded-lg border border-zinc-100 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Link href={`/shops/${rev.shopId}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                                {rev.shopName} <ChevronRight size={10} />
                                            </Link>
                                            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                                <Star size={10} className="fill-amber-400 text-amber-400" />
                                                <span className="text-[10px] font-bold text-amber-700">{rev.rating}</span>
                                            </div>
                                        </div>

                                        {rev.comment && (
                                            <p className="text-sm text-zinc-600 leading-relaxed italic">
                                                "{rev.comment}"
                                            </p>
                                        )}

                                        {/* Category Ratings Display as Badges */}
                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                            {Number(rev.coffeeRating) > 0 && (
                                                <div className="flex items-center gap-0.5 bg-amber-50 text-[8px] font-bold px-1.5 py-0.5 rounded border border-amber-100/50 text-amber-600">
                                                    <Coffee size={8} />
                                                    <span>{Number(rev.coffeeRating).toFixed(1)}</span>
                                                </div>
                                            )}
                                            {Number(rev.foodRating) > 0 && (
                                                <div className="flex items-center gap-0.5 bg-orange-50 text-[8px] font-bold px-1.5 py-0.5 rounded border border-orange-100/50 text-orange-600">
                                                    <Utensils size={8} />
                                                    <span>{Number(rev.foodRating).toFixed(1)}</span>
                                                </div>
                                            )}
                                            {Number(rev.placeRating) > 0 && (
                                                <div className="flex items-center gap-0.5 bg-blue-50 text-[8px] font-bold px-1.5 py-0.5 rounded border border-blue-100/50 text-blue-600">
                                                    <Home size={8} />
                                                    <span>{Number(rev.placeRating).toFixed(1)}</span>
                                                </div>
                                            )}
                                            {Number(rev.priceRating) > 0 && (
                                                <div className="flex items-center gap-0.5 bg-emerald-50 text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-100/50 text-emerald-600">
                                                    <DollarSign size={8} />
                                                    <span>{Number(rev.priceRating).toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-1 border-t border-zinc-100/50">
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <Heart 
                                                    size={12} 
                                                    className={cn(
                                                        rev.isLiked ? "fill-rose-500 text-rose-500" : "fill-zinc-300 text-zinc-300"
                                                    )} 
                                                />
                                                <span className="text-[10px] font-bold">{rev.likeCount}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-300">
                                                {new Date(rev.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 px-6">
                                <div className="bg-zinc-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare size={20} className="text-zinc-200" />
                                </div>
                                <p className="text-sm font-bold text-zinc-300">Aún no hay reseñas escritas</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="shops" className="mt-0">
                        {followedShops && followedShops.length > 0 ? (
                            <div className="space-y-2.5">
                                <div className="px-1 mb-4">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                        Siguiendo {followedShops.length} {followedShops.length === 1 ? "cafetería" : "cafeterías"}
                                    </p>
                                </div>
                                {followedShops.map((shop: any) => (
                                    <Link 
                                        key={shop.id} 
                                        href={`/shops/${shop.id}`}
                                        className="block bg-white p-3 rounded-lg border border-zinc-100 active:scale-[0.98] transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden">
                                                    {shop.image ? (
                                                        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Coffee size={18} className="text-zinc-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-zinc-900">{shop.name}</h4>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5 font-medium">
                                                        <Calendar size={10} />
                                                        Siguiendo desde {new Date(shop.followedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-zinc-300" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 px-6">
                                <div className="bg-zinc-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Coffee size={20} className="text-zinc-200" />
                                </div>
                                <p className="text-sm font-bold text-zinc-300">Aún no sigues cafeterías</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
