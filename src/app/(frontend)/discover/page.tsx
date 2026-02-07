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
        <div className="min-h-screen bg-brand-50/20 pb-28">
            {/* Header / Search */}
            <div className="bg-brand-600 px-6 pt-4 pb-12 rounded-b-[40px] shadow-lg sticky top-0 z-50">
                <h1 className="text-2xl font-bold text-white mb-6">Descubrir Personas</h1>
                <form action="/discover" className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                    <input
                        name="q"
                        type="text"
                        defaultValue={query}
                        placeholder="Busca por nombre..."
                        className="w-full bg-white/95 backdrop-blur-md rounded-2xl py-4 pl-12 pr-4 text-brand-950 font-medium placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-inner"
                    />
                </form>
            </div>

            {/* Content */}
            <div className="px-6 -mt-6">
                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-brand-100/50 min-h-[400px]">
                    <UserSearchList initialUsers={users} query={query} />
                </div>
            </div>
        </div>
    );
}
