import { getCoffeeShops } from "@/actions/coffee-shops";
import { getFeatures } from "@/actions/features";
import { getTags } from "@/actions/reviews";
import { CoffeeShopList } from "@/components/shops/shop-list";

export default async function ShopsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const filter = typeof searchParams.filter === 'string' ? searchParams.filter as any : "all";
    const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy as any : "name";
    const sortOrder = typeof searchParams.sortOrder === 'string' ? searchParams.sortOrder as any : "desc";

    const { data: shops } = await getCoffeeShops({ filter, sortBy, sortOrder });
    const { data: tags } = await getTags();
    const { data: features } = await getFeatures();

    return (
        <div className="min-h-screen bg-background pb-28">
            {/* Header */}
            <div className=" px-6 pt-16 pb-6 ">
                <h1 className="text-3xl font-bold">Explorar Cafeterías</h1>
            </div>

            {/* Content */}
            <div className="px-6">
                <CoffeeShopList
                    initialShops={shops || []}
                    tags={tags || []}
                    features={features || []}
                    initialSortBy={sortBy}
                    initialSortOrder={sortOrder}
                />
            </div>
        </div>
    );
}
