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
    const sortOrder = typeof searchParams.sortOrder === 'string' ? searchParams.sortOrder as any : "asc";

    const shopsRes = await getCoffeeShops({ filter, sortBy, sortOrder });
    const shops = shopsRes.success && 'data' in shopsRes ? shopsRes.data : [];

    const tagsRes = await getTags();
    const tags = tagsRes.success && 'data' in tagsRes ? tagsRes.data : [];

    const featuresRes = await getFeatures();
    const features = featuresRes.success && 'data' in featuresRes ? featuresRes.data : [];

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
