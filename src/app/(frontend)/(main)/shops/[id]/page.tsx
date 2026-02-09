import { getCoffeeShopById, isFollowingShop } from "@/actions/coffee-shops";
import { notFound } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ShopHeader } from "@/components/shops/detail/shop-header";
import { ShopInfo } from "@/components/shops/detail/shop-info";
import { ShopDescription } from "@/components/shops/detail/shop-description";
import { ShopContact } from "@/components/shops/detail/shop-contact";
import { ShopHours, type ShopHour } from "@/components/shops/detail/shop-hours";
import { ShopAction } from "@/components/shops/detail/shop-action";
import { CoffeeShop, Media } from "@/payload-types";

type CoffeeShopWithStats = CoffeeShop & {
    reviewCount?: number;
};

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

    if (!success || !shop) {
        notFound();
    }

    const { isOpen, openUntil } = isShopOpen(shop.hours);

    // mainImage is now joined as a Media object or undefined
    const mainImageUrl = (shop.mainImage as Media)?.url || (shop.gallery?.[0] as Media)?.url || "/images/coffee-placeholder.jpg";
    const gallery = shop.gallery as Media[] | undefined;

    return (
        <div className="min-h-screen bg-background pb-28">
            <ShopHeader
                shopId={shop.id}
                name={shop.name}
                mainImage={mainImageUrl}
                isFollowing={isFollowing}
            />

            {/* Overlapping Container */}
            <div className="relative -mt-8 px-6 pt-10 pb-8 bg-background rounded-t-[3rem] space-y-8 z-30">
                {/* Status Badge inside the container */}
                <div className="flex justify-center -mt-4 mb-4">
                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border",
                        isOpen
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                    )}>
                        {isOpen ? `Abierto hasta ${openUntil}` : 'Cerrado'}
                    </div>
                </div>

                <ShopInfo
                    name={shop.name}
                    avgRating={(shop as any).avgRating || 0}
                    reviewCount={(shop as any).reviewCount || 0}
                    address={shop.address}
                />

                <ShopDescription description={shop.description as any} />

                <ShopContact
                    address={shop.address}
                    phone={shop.phone}
                    website={shop.website}
                />

                <ShopHours hours={shop.hours as ShopHour[]} />

                {/* Gallery Section */}
                {gallery && gallery.length > 0 && (
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">Fotos de la cafetería</h3>
                            <button className="text-primary text-sm font-semibold">Ver todas</button>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                            {gallery.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative min-w-[200px] h-[150px] rounded-3xl overflow-hidden flex-shrink-0 shadow-md"
                                >
                                    <Image
                                        src={img.url || ""}
                                        alt={`${shop.name} gallery ${index}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <ShopAction />
            </div>
        </div>
    );
}
