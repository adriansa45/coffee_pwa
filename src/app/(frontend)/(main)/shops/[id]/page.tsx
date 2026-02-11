import { getCoffeeShopById, isFollowingShop } from "@/actions/coffee-shops";
import { getReviews } from "@/actions/reviews";
import { ShopAction } from "@/components/shops/detail/shop-action";
import { ShopContact } from "@/components/shops/detail/shop-contact";
import { ShopDescription } from "@/components/shops/detail/shop-description";
import { ShopHeader } from "@/components/shops/detail/shop-header";
import { ShopHours, type ShopHour } from "@/components/shops/detail/shop-hours";
import { ShopInfo } from "@/components/shops/detail/shop-info";
import { ShopReviews } from "@/components/shops/detail/shop-reviews";
import { ShopGallery } from "@/components/shops/detail/shop-gallery";
import { cn } from "@/lib/utils";
import { CoffeeShop, Media } from "@/payload-types";
import { notFound } from "next/navigation";

// Initial review fetch

// Helper function to determine if shop is open with better type safety
function isShopOpen(hours: any): { isOpen: boolean; openUntil?: string } {
    if (!hours || !Array.isArray(hours) || hours.length === 0) {
        return { isOpen: false };
    }

    try {
        const now = new Date();
        const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' });

        const todaySchedule = (hours as ShopHour[]).find((h: ShopHour) =>
            h.day.toLowerCase().includes(currentDay.toLowerCase())
        );

        if (todaySchedule && todaySchedule.time.includes(' - ')) {
            return { isOpen: true, openUntil: todaySchedule.time.split(' - ')[1] };
        }
    } catch (e) {
        console.error("Error parsing shop hours:", e);
    }

    return { isOpen: false };
}

export default async function ShopDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { data: shop, success } = await getCoffeeShopById(params.id);
    const { isFollowing } = await isFollowingShop(params.id);
    const { data: initialReviews, hasMore } = await getReviews(params.id, 1, 10);

    if (!success || !shop) {
        notFound();
    }

    const { isOpen, openUntil } = isShopOpen(shop.hours);

    // mainImage is a number (Media ID), and gallery is an array of Media objects from the query
    // The gallery is already populated as Media objects from the _rels join in getCoffeeShopById
    const gallery = shop.gallery as Media[] | undefined;
    const mainImageUrl = gallery?.[0]?.url || "/images/coffee-placeholder.jpg";

    return (
        <div className="min-h-screen bg-background pb-28">
            <ShopHeader
                shopId={shop.id}
                name={shop.name}
                mainImage={mainImageUrl}
            />

            {/* Overlapping Container */}
            <div className="relative -mt-8 px-6 pt-10 pb-8 bg-background rounded-t-[3rem] space-y-10 z-30">
                {/* Status Badge inside the container */}
                <div className="flex justify-center -mt-4 mb-4">
                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm",
                        isOpen
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                    )}>
                        {isOpen ? `Abierto hasta ${openUntil}` : 'Cerrado'}
                    </div>
                </div>

                <ShopInfo
                    shopId={shop.id}
                    name={shop.name}
                    avgRating={(shop as any).avgRating || 0}
                    reviewCount={(shop as any).reviewCount || 0}
                    followerCount={(shop as any).followerCount || 0}
                    address={shop.address}
                    isFollowing={isFollowing}
                    features={(shop as any).features || []}
                    categoryRatings={{
                        avgCoffee: (shop as any).avgCoffee || 0,
                        avgFood: (shop as any).avgFood || 0,
                        avgPlace: (shop as any).avgPlace || 0,
                        avgPrice: (shop as any).avgPrice || 0,
                    }}
                />

                <ShopDescription description={shop.description as any} />

                <ShopContact
                    address={shop.address}
                    phone={shop.phone}
                    website={shop.website}
                />

                <ShopHours hours={shop.hours as ShopHour[]} />

                <ShopGallery shopName={shop.name} gallery={gallery || []} />

                <ShopAction shopId={shop.id} shopName={shop.name} />

                <ShopReviews
                    shopId={shop.id}
                    initialReviews={initialReviews || []}
                    initialHasMore={hasMore || false}
                />
            </div>
        </div>
    );
}
