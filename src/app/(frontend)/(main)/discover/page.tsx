import { searchUsers, getUserRankings } from "@/actions/user";
import { UserSearchList } from "@/components/social/user-search-list";
import { DiscoverSearch } from "@/components/social/discover-search";
import { RankingSection } from "@/components/social/ranking-section";
import { Star, Coffee, Users, Search as SearchIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

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
        <div className="min-h-screen bg-background pb-28">
            {/* Header Area */}
            <div className="px-6 pt-16 pb-8 flex flex-col gap-1">
                {query ? (
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                        <Link 
                            href="/discover"
                            className="p-2 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground tracking-tighter uppercase">Búsqueda</h1>
                            <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.25em] mt-1">Resultados para "{query}"</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-4xl font-bold text-foreground tracking-tighter uppercase">Comunidad</h1>
                        <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.3em]">Conoce a otros exploradores</p>
                    </div>
                )}
            </div>

            {/* Search Bar */}
            <div className="px-6 mb-10">
                <DiscoverSearch />
            </div>

            {/* Content Area */}
            <div className="px-6">
                {query ? (
                    <Card className="bg-card/50 backdrop-blur-sm border-border/40 p-6 shadow-xl min-h-[400px]">
                        <UserSearchList initialUsers={searchResults} query={query} />
                    </Card>
                ) : (
                    <div className="flex flex-col gap-14">
                        <RankingSection 
                            title="Top Reseñadores"
                            subtitle="Más críticas compartidas"
                            icon={<Star className="fill-primary text-primary" size={20} />}
                            users={rankings?.topReviewers || []}
                            type="reviews"
                        />

                        <RankingSection 
                            title="Top Exploradores"
                            subtitle="Más cafeterías visitadas"
                            icon={<Coffee className="text-primary" size={20} />}
                            users={rankings?.topExplorers || []}
                            type="visits"
                        />

                        <RankingSection 
                            title="Más Seguidos"
                            subtitle="Inspirando a la comunidad"
                            icon={<Users className="text-primary" size={20} />}
                            users={rankings?.topFollowed || []}
                            type="followers"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
