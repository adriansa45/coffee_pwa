import { searchUsers, getUserRankings } from "@/actions/user";
import { UserSearchList } from "@/components/social/user-search-list";
import { DiscoverSearch } from "@/components/social/discover-search";
import { RankingSection } from "@/components/social/ranking-section";
import { Star, Coffee, Users, Search as SearchIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function DiscoverPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const query = typeof searchParams.q === 'string' ? searchParams.q : "";
    
    // Fetch rankings for the main view
    const { data: rankings } = await getUserRankings();

    // Fetch full results if there is a query (for the "Ver todos" or manual search)
    let searchResults: any[] = [];
    if (query) {
        const { data } = await searchUsers(query);
        searchResults = data || [];
    }

    return (
        <div className="min-h-screen bg-white pb-28">
            {/* Header Area */}
            <div className="px-6 pt-16 pb-8">
                {query ? (
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/discover"
                            className="p-2 -ml-2 rounded-full text-zinc-400 hover:bg-zinc-50 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Búsqueda</h1>
                            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mt-1">Resultados para "{query}"</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Comunidad</h1>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mt-1">Conoce a otros exploradores</p>
                    </div>
                )}
            </div>

            {/* Search Bar - Always visible or slightly different in results view? */}
            <div className="px-6 mb-10">
                <DiscoverSearch />
            </div>

            {/* Content Area */}
            <div className="px-6">
                {query ? (
                    <div className="bg-white rounded-[32px] border border-zinc-100 p-6 shadow-sm min-h-[400px]">
                        <UserSearchList initialUsers={searchResults} query={query} />
                    </div>
                ) : (
                    <div className="space-y-12">
                        <RankingSection 
                            title="Top Reseñadores"
                            subtitle="Más críticas compartidas"
                            icon={<Star className="fill-amber-400 text-amber-400" size={20} />}
                            users={rankings?.topReviewers || []}
                            type="reviews"
                        />

                        <RankingSection 
                            title="Top Exploradores"
                            subtitle="Más cafeterías visitadas"
                            icon={<Coffee className="text-emerald-500" size={20} />}
                            users={rankings?.topExplorers || []}
                            type="visits"
                        />

                        <RankingSection 
                            title="Más Seguidos"
                            subtitle="Inspirando a la comunidad"
                            icon={<Users className="text-blue-500" size={20} />}
                            users={rankings?.topFollowed || []}
                            type="followers"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
