import { ArrowLeft, MapPin, Clock, Star, Phone, Globe, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getCoffeeShopById } from "@/actions/coffee-shops";
import { notFound } from "next/navigation";

// Helper function to determine if shop is open
function isShopOpen(hours: any[]): { isOpen: boolean; openUntil?: string } {
    if (!hours || hours.length === 0) {
        return { isOpen: false };
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

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

    const { isOpen, openUntil } = isShopOpen(shop.hours || []);
    const gallery = shop.gallery || [];
    const mainImage = gallery[0] || "/images/coffee-placeholder.jpg";

    return (
        <div className="min-h-screen bg-background pb-28">
            {/* Header Image Gallery */}
            <section className="relative h-[50vh]">
                <Image
                    src={mainImage}
                    alt={shop.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
                    <Link
                        href="/shops"
                        className="w-10 h-10 rounded-full glass flex items-center justify-center text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-white">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-20 left-6">
                    <div className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border",
                        isOpen
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                    )}>
                        {isOpen ? `Abierto hasta ${openUntil}` : 'Cerrado'}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="px-6 py-8 space-y-8">
                {/* Title & Rating */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold">{shop.name}</h1>

                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-foreground">
                                {shop.avgRating ? Number(shop.avgRating).toFixed(1) : '0.0'}
                            </span>
                            <span className="text-sm">({shop.reviewCount || 0})</span>
                        </div>
                        {shop.address && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm truncate max-w-[200px]">{shop.address}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                {shop.description && (
                    <div className="space-y-2">
                        <h2 className="text-lg font-bold">Acerca de</h2>
                        <div className="text-muted-foreground leading-relaxed">
                            {typeof shop.description === 'string'
                                ? shop.description
                                : shop.description?.root?.children?.map((node: any, idx: number) => {
                                    if (node.type === 'paragraph') {
                                        return (
                                            <p key={idx} className="mb-3">
                                                {node.children?.map((child: any, childIdx: number) => {
                                                    if (child.type === 'text') {
                                                        return <span key={childIdx}>{child.text}</span>;
                                                    }
                                                    return null;
                                                })}
                                            </p>
                                        );
                                    }
                                    return null;
                                })
                            }
                        </div>
                    </div>
                )}

                {/* Contact Info */}
                {(shop.address || shop.phone || shop.website) && (
                    <div className="glass rounded-3xl p-6 space-y-4">
                        <h2 className="text-lg font-bold">Información de contacto</h2>

                        <div className="space-y-3">
                            {shop.address && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium">Dirección</div>
                                        <div className="text-sm text-muted-foreground">{shop.address}</div>
                                    </div>
                                </div>
                            )}

                            {shop.phone && (
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium">Teléfono</div>
                                        <div className="text-sm text-muted-foreground">{shop.phone}</div>
                                    </div>
                                </div>
                            )}

                            {shop.website && (
                                <div className="flex items-start gap-3">
                                    <Globe className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium">Sitio web</div>
                                        <a
                                            href={shop.website.startsWith('http') ? shop.website : `https://${shop.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline"
                                        >
                                            {shop.website}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Hours */}
                {shop.hours && Array.isArray(shop.hours) && shop.hours.length > 0 && (
                    <div className="glass rounded-3xl p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold">Horarios</h2>
                        </div>

                        <div className="space-y-3">
                            {shop.hours.map((schedule: any, index: number) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{schedule.day}</span>
                                    <span className="text-sm font-bold">{schedule.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <button className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-3xl font-bold text-lg transition-all duration-300 active:scale-95 shadow-lg shadow-primary/20">
                    Registrar Visita
                </button>
            </section>
        </div>
    );
}
