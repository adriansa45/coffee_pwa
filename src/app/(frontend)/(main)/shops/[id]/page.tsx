import { getCoffeeShopById } from "@/actions/coffee-shops";
import { notFound } from "next/navigation";
import { ShopHeader } from "@/components/shops/detail/shop-header";
import { ShopInfo } from "@/components/shops/detail/shop-info";
import { ShopDescription } from "@/components/shops/detail/shop-description";
import { ShopContact } from "@/components/shops/detail/shop-contact";
import { ShopHours } from "@/components/shops/detail/shop-hours";
import { ShopAction } from "@/components/shops/detail/shop-action";

// Helper function to determine if shop is open
function isShopOpen(hours: any[]): { isOpen: boolean; openUntil?: string } {
    if (!hours || hours.length === 0) {
        return { isOpen: false };
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' });

    // Simple check - this could be improved with better time parsing
    const todaySchedule = hours.find((h: any) =>
        h.day.toLowerCase().includes(currentDay.toLowerCase())
    );

    if (todaySchedule) {
        return { isOpen: true, openUntil: todaySchedule.time.split(' - ')[1] };
    }

    return { isOpen: false };
}

export default async function ShopDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { data: shop, success } = await getCoffeeShopById(params.id);

    if (!success || !shop) {
        notFound();
    }

    const { isOpen, openUntil } = isShopOpen(shop.hours as any[] || []);
    const gallery = shop.gallery || [];
    const mainImage = gallery[0] || "/images/coffee-placeholder.jpg";

    return (
        <div className="min-h-screen bg-background pb-28">
            <ShopHeader
                name={shop.name}
                mainImage={mainImage}
                isOpen={isOpen}
                openUntil={openUntil}
            />

            <section className="px-6 py-8 space-y-8">
                <ShopInfo
                    name={shop.name}
                    avgRating={shop.avgRating || 0}
                    reviewCount={shop.reviewCount || 0}
                    address={shop.address}
                />

                <ShopDescription description={shop.description} />

                <ShopContact
                    address={shop.address}
                    phone={shop.phone}
                    website={shop.website}
                />

                <ShopHours hours={shop.hours as any[]} />

                <ShopAction />
            </section>
        </div>
    );
}
