import { searchUsers } from "@/actions/user";
import { UserSearchList } from "@/components/social/user-search-list";
import { Search } from "lucide-react";

export default async function DiscoverPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const query = typeof searchParams.q === 'string' ? searchParams.q : "";
    let users: any[] = [];

    if (query) {
        const { data } = await searchUsers(query);
        users = data || [];
    }

    return (
        <div className="min-h-screen bg-background pb-28">
            {/* Header / Search */}
            <div className="bg-primary px-6 pt-16 pb-10 rounded-b-[40px] shadow-lg">
                <h1 className="text-3xl font-bold text-white mb-6">Descubrir Personas</h1>
                <form action="/discover" className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={20} />
                    <input
                        name="q"
                        type="text"
                        defaultValue={query}
                        placeholder="Busca por nombre..."
                        className="w-full bg-white rounded-3xl py-4 pl-12 pr-4 text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-white/20 shadow-sm border-0"
                    />
                </form>
            </div>

            {/* Content */}
            <div className="px-6 -mt-4">
                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-primary/10/50 min-h-[400px]">
                    <UserSearchList initialUsers={users} query={query} />
                </div>
            </div>
        </div>
    );
}
