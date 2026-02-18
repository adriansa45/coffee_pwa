"use client";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
import { CircleDollarSign, Coffee, Filter, Map as MapIcon, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LikertRating } from "./likert-rating";
import { ShopDrawer } from "./shop-drawer";
import { StarRating } from "./star-rating";
import { UserQRDrawer } from "./user-qr-drawer";

interface Shop {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    googleMapsUrl: string | null;
    avgRating: number;
    avgCoffee?: number;
    avgFood?: number;
    avgPlace?: number;
    avgPrice?: number;
    reviewCount: number;
    description: string | null;
    address: string | null;
}

interface MapCnViewProps {
    initialShops: Shop[];
}

export default function MapCnView({ initialShops }: MapCnViewProps) {
    const router = useRouter();
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [shops] = useState<Shop[]>(initialShops);

    // Filters context
    const [minCoffee, setMinCoffee] = useState(0);
    const [minFood, setMinFood] = useState(0);
    const [minPlace, setMinPlace] = useState(0);
    const [minPrice, setMinPrice] = useState(0);

    const handleMarkerClick = (shop: Shop) => {
        setSelectedShop(shop);
        setIsDrawerOpen(true);
    };

    const clearFilters = () => {
        setMinCoffee(0);
        setMinFood(0);
        setMinPlace(0);
        setMinPrice(0);
    };

    const filteredShops = shops.filter(shop => {
        if (minCoffee > 0 && (shop.avgCoffee || 0) < minCoffee) return false;
        if (minFood > 0 && (shop.avgFood || 0) < minFood) return false;
        if (minPlace > 0 && (shop.avgPlace || 0) < minPlace) return false;
        if (minPrice > 0 && (shop.avgPrice || 0) < minPrice) return false;
        return true;
    });

    const hasFilters = minCoffee > 0 || minFood > 0 || minPlace > 0 || minPrice > 0;

    return (
        <div className="relative w-full h-full">
            <Map
                center={[-100.31, 25.68]}
                zoom={12}
                theme="light"
                className="w-full h-full z-0"
            >
                <MapControls position="bottom-right" showZoom={false} />

                {filteredShops.map((shop) => (
                    <MapMarker
                        key={shop.id}
                        latitude={shop.latitude}
                        longitude={shop.longitude}
                        onClick={() => handleMarkerClick(shop)}
                    >
                        <MarkerContent>
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-8 h-8 bg-primary rounded-full animate-ping opacity-20"></div>
                                <div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-all duration-300 hover:scale-110">
                                    <Coffee size={16} color="white" strokeWidth={3} />
                                </div>
                            </div>
                        </MarkerContent>
                        <MarkerPopup>
                            <div className="w-48 ">
                                <h3 className="font-bold text-foreground text-xs mb-1">{shop.name}</h3>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <StarRating rating={Number(shop.avgRating)} size={10} />
                                    <span className="text-[9px]">({shop.reviewCount})</span>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    {shop.googleMapsUrl && (
                                        <a
                                            href={shop.googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className=" w-full py-1.5 bg-primary text-[9px] !text-white font-bold rounded-lg uppercase text-center shadow-sm"
                                        >
                                            Abrir Mapa
                                        </a>
                                    )}
                                    <button
                                        className="w-full py-1.5 bg-primary text-[9px] text-white font-bold rounded-lg uppercase shadow-sm"
                                        onClick={() => handleMarkerClick(shop)}
                                    >
                                        ⭐ Ver Reseñas
                                    </button>
                                </div>
                            </div>
                        </MarkerPopup>
                    </MapMarker>
                ))}
            </Map>

            {/* UI Overlays */}
            <UserQRDrawer />

            <Drawer>
                <DrawerTrigger asChild>
                    <button className="absolute bottom-24 right-5 z-[50] w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                        <Filter size={24} />
                        {hasFilters && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white border-2 border-primary rounded-full flex items-center justify-center">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            </span>
                        )}
                    </button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle className="text-xl font-bold text-foreground">Filtrar por Experiencia</DrawerTitle>
                            <DrawerDescription>
                                Encuentra lugares que cumplan con tus expectativas.
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-6 pb-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Coffee size={14} className="text-primary" /> Café (Mínimo)
                                </label>
                                <LikertRating rating={minCoffee} interactive onRatingChange={setMinCoffee} size="md" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Utensils size={14} className="text-primary" /> Comida (Mínimo)
                                </label>
                                <LikertRating rating={minFood} interactive onRatingChange={setMinFood} size="md" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <MapIcon size={14} className="text-primary" /> Lugar (Mínimo)
                                </label>
                                <LikertRating rating={minPlace} interactive onRatingChange={setMinPlace} size="md" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <CircleDollarSign size={14} className="text-primary" /> Costo (Mínimo)
                                </label>
                                <LikertRating rating={minPrice} interactive onRatingChange={setMinPrice} size="md" />
                            </div>

                            {hasFilters && (
                                <div className="pt-4">
                                    <Button
                                        onClick={clearFilters}
                                        variant="outline"
                                        className="w-full border-dashed border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                                    >
                                        Limpiar filtros
                                    </Button>
                                </div>
                            )}
                        </div>
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl">
                                    Aplicar Filtros
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>

            <ShopDrawer
                shop={selectedShop as any}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onReviewSubmitted={() => router.refresh()}
            />
        </div>
    );
}
