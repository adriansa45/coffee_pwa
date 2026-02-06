import { getCoffeeShops } from "@/actions/coffee-shops";
import { getTags } from "@/actions/reviews";
import { CoffeeShopList } from "@/components/shops/shop-list";
import { Search, Filter } from "lucide-react";

export default async function ShopsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const search = typeof searchParams.search === 'string' ? searchParams.search : "";
    const filter = typeof searchParams.filter === 'string' ? searchParams.filter as any : "all";

    const { data: shops } = await getCoffeeShops({ search, filter });
    const { data: tags } = await getTags();

    return (
        <div className="min-h-screen bg-brand-50/30 pb-28 pt-20">
            {/* Header / Search */}
            <div className="bg-brand-600 px-6 pt-4 pb-12 rounded-b-[40px] shadow-lg sticky top-0 z-50">
                <h1 className="text-2xl font-bold text-white mb-6">Explorar Cafeterías</h1>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Busca por nombre o dirección..."
                        className="w-full bg-white/95 backdrop-blur-md rounded-2xl py-4 pl-12 pr-4 text-brand-950 font-medium placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-inner"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="px-6 -mt-6">
                <CoffeeShopList initialShops={shops || []} tags={tags || []} />
            </div>
        </div>
    );
}
