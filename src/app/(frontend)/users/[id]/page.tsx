import { getUserProfile } from "@/actions/user";
import { getUserVisits } from "@/actions/visits";
import { getReviews } from "@/actions/reviews";
import { isFollowing } from "@/actions/social";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/social/follow-button";
import { Coffee, MapPin, Calendar, Star, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function UserProfilePage({ params }: { params: { id: string } }) {
    const userId = params.id;
    const { data: profile } = await getUserProfile(userId);
    const following = await isFollowing(userId);

    if (!profile) return <div>Usuario no encontrado</div>;

    return (
        <div className="min-h-screen bg-brand-50/20 pb-28">
            {/* Profile Header */}
            <div className="bg-brand-600 px-6 pt-24 pb-12 rounded-b-[48px] shadow-lg relative overflow-hidden">
                <Coffee className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 rotate-12 text-white" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-xl mb-4">
                        <AvatarImage src={profile.image || ""} />
                        <AvatarFallback className="bg-brand-100 text-brand-700 font-bold text-2xl">
                            {profile.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <h1 className="text-2xl font-bold text-white mb-1">{profile.name}</h1>
                    <p className="text-brand-100/60 text-sm font-medium mb-6 flex items-center gap-1.5">
                        <MapPin size={14} /> Entusiasta del Café
                    </p>

                    <div className="flex gap-8 mb-8">
                        <div className="text-center">
                            <p className="text-white text-xl font-bold">{profile.stats.followers}</p>
                            <p className="text-brand-100/60 text-[10px] font-bold uppercase tracking-widest">Seguidores</p>
                        </div>
                        <div className="text-center">
                            <p className="text-white text-xl font-bold">{profile.stats.following}</p>
                            <p className="text-brand-100/60 text-[10px] font-bold uppercase tracking-widest">Siguiendo</p>
                        </div>
                    </div>

                    <FollowButton userId={userId} initialIsFollowing={following} variant="profile" />
                </div>
            </div>

            {/* Profile Stats Cards */}
            <div className="px-6 -mt-6 grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-brand-100/50 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
                        <Coffee size={20} />
                    </div>
                    <p className="text-lg font-bold text-brand-950">{profile.stats.visits}</p>
                    <p className="text-[10px] font-bold text-brand-900/40 uppercase">Visitas</p>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-brand-100/50 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                        <Star size={20} />
                    </div>
                    <p className="text-lg font-bold text-brand-950">{profile.stats.reviews}</p>
                    <p className="text-[10px] font-bold text-brand-900/40 uppercase">Reseñas</p>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="px-6">
                <Tabs defaultValue="visits" className="w-full">
                    <TabsList className="w-full bg-white rounded-2xl p-1 shadow-sm border border-brand-100/50 mb-6">
                        <TabsTrigger value="visits" className="flex-1 rounded-xl text-xs font-bold py-2 data-[state=active]:bg-brand-600 data-[state=active]:text-white transition-all">
                            Visitas
                        </TabsTrigger>
                        <TabsTrigger value="reviews" className="flex-1 rounded-xl text-xs font-bold py-2 data-[state=active]:bg-brand-600 data-[state=active]:text-white transition-all">
                            Reseñas
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="visits">
                        <div className="space-y-4">
                            {/* In a real app we'd fetch visits specifically for this user. 
                                For now, showing a simple message if we don't have the action ready for other users.
                            */}
                            <p className="text-sm text-center text-brand-900/40 mt-10 font-medium">Historial de visitas próximamente</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews">
                        <div className="space-y-4">
                            <p className="text-sm text-center text-brand-900/40 mt-10 font-medium">Reseñas próximamente</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
