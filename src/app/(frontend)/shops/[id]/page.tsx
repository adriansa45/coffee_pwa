import { getCoffeeShopById } from "@/actions/coffee-shops";
import { getReviews } from "@/actions/reviews";
import { Star, MapPin, Coffee, Utensils, Map, CircleDollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReviewList } from "@/components/shops/review-list";
import { ShopGallery } from "@/components/shops/shop-gallery";
import { RichText } from "@/components/payload/rich-text";

export default async function ShopDetailPage({ params }: { params: { id: string } }) {
    const { data: shop } = await getCoffeeShopById(params.id);
    const { data: reviews } = await getReviews(params.id);

    if (!shop) return <div className="p-10 text-center">Cafetería no encontrada</div>;

    const gallery = (shop as any).gallery?.map((g: any) => {
        if (typeof g === 'string') return g;
        return g.media?.url || g.url;
    }).filter(Boolean) || [];

    // Fallback image if gallery is empty
    const displayImages = gallery.length > 0 ? gallery : [];

    return (
        <div className="min-h-screen bg-white pb-28">
            {/* Top Bar / Back Button */}
            <div className="fixed top-0 left-0 right-0 p-4 z-50 flex justify-between items-center pointer-events-none">
                <Link href="/shops" className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg pointer-events-auto border border-brand-100 transition-transform active:scale-90">
                    <ArrowLeft size={20} className="text-brand-950" />
                </Link>
            </div>

            {/* Gallery / Cover */}
            <div className="px-4 pt-20">
                <ShopGallery images={displayImages} />
            </div>

            {/* Content */}
            <div className="px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-brand-950 mb-2">{shop.name}</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-xs font-bold text-yellow-700 border border-yellow-100">
                            <Star size={12} className="fill-current" />
                            {Number(shop.avgRating).toFixed(1)}
                        </div>
                        <span className="text-xs font-bold text-brand-900/40 uppercase tracking-widest">{shop.reviewCount} reseñas</span>
                        <div className="flex items-center gap-1 text-brand-500 text-xs font-medium ml-auto">
                            <MapPin size={14} />
                            <span className="truncate max-w-[120px]">{shop.address || "Dirección"}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-3 mb-10">
                    <div className="bg-brand-50/50 p-3 rounded-2xl border border-brand-100 flex flex-col items-center gap-1 text-center shadow-sm">
                        <Coffee size={18} className="text-brand-600" />
                        <span className="text-xs font-bold text-brand-950">{Number(shop.avgCoffee).toFixed(1)}</span>
                        <span className="text-[8px] font-bold text-brand-400 uppercase">Café</span>
                    </div>
                    <div className="bg-brand-50/50 p-3 rounded-2xl border border-brand-100 flex flex-col items-center gap-1 text-center shadow-sm">
                        <Utensils size={18} className="text-brand-600" />
                        <span className="text-xs font-bold text-brand-950">{Number(shop.avgFood).toFixed(1)}</span>
                        <span className="text-[8px] font-bold text-brand-400 uppercase">Comida</span>
                    </div>
                    <div className="bg-brand-50/50 p-3 rounded-2xl border border-brand-100 flex flex-col items-center gap-1 text-center shadow-sm">
                        <Map size={18} className="text-brand-600" />
                        <span className="text-xs font-bold text-brand-950">{Number(shop.avgPlace).toFixed(1)}</span>
                        <span className="text-[8px] font-bold text-brand-400 uppercase">Lugar</span>
                    </div>
                    <div className="bg-brand-50/50 p-3 rounded-2xl border border-brand-100 flex flex-col items-center gap-1 text-center shadow-sm">
                        <CircleDollarSign size={18} className="text-brand-600" />
                        <span className="text-xs font-bold text-brand-950">{Number(shop.avgPrice).toFixed(1)}</span>
                        <span className="text-[8px] font-bold text-brand-400 uppercase">Precio</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-12">
                    <h2 className="text-lg font-bold text-brand-950 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-brand-600 rounded-full" />
                        Sobre nosotros
                    </h2>
                    <div className="bg-brand-50/20 p-6 rounded-[32px] border border-brand-100/50">
                        {shop.description ? (
                            <RichText content={shop.description} />
                        ) : (
                            <p className="text-brand-900/40 text-sm font-medium italic text-center py-4">
                                Sin descripción detallada aún.
                            </p>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-brand-600 rounded-full" />
                            Comunidad
                        </h2>
                    </div>
                    <ReviewList initialReviews={reviews || []} shopId={shop.id} />
                </div>
            </div>
        </div>
    );
}
