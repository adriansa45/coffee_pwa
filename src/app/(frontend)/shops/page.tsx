import { getCoffeeShops } from "@/actions/coffee-shops";
import { getTags } from "@/actions/reviews";
import { CoffeeShopList } from "@/components/shops/shop-list";
import { Search, Filter } from "lucide-react";

export default async function ShopsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const search = typeof searchParams.search === 'string' ? searchParams.search : "";
    const filter = typeof searchParams.filter === 'string' ? searchParams.filter as any : "all";

    const { data: shops } = await getCoffeeShops({ search, filter });
    const { data: tags } = await getTags();

    return (
        <div className="min-h-screen bg-background pb-28">
            {/* Header / Search */}
            <div className=" px-6 pt-6 pb-10 ">
                <h1 className="text-3xl font-bold mb-6">Explorar Cafeterías</h1>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={20} />
                    <input
                        type="text"
                        placeholder="Busca por nombre o dirección..."
                        className="w-full bg-white rounded-3xl py-4 pl-12 pr-4 text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-white/20 shadow-sm border-0"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="px-6 -mt-4">
                <CoffeeShopList initialShops={shops || []} tags={tags || []} />
            </div>
        </div>
    );
}
