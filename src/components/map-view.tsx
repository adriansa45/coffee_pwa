"use client";

import { getCoffeeShops } from "@/actions/coffee-shops";
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
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CircleDollarSign, Coffee, Filter, Map, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { LikertRating } from "./likert-rating";
import { ShopDrawer } from "./shop-drawer";
import { StarRating } from "./star-rating";
import { UserQRDrawer } from "./user-qr-drawer";

// Fix for default marker icons
const coffeeIcon = L.divIcon({
    className: "custom-div-icon",
    html: `
        <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 bg-primary rounded-full animate-ping opacity-20"></div>
            <div class="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-all duration-500 hover:scale-125 scale-100 animate-in zoom-in-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
            </div>
        </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

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

interface Tag {
    id: string;
    name: string;
}

function MapController() {
    const map = useMap();
    useEffect(() => {
        map.setView([25.67119454436982, -100.32390030316438], 12, { animate: false });
        setTimeout(() => {
            map.flyTo([25.67119454436982, -100.32390030316438], 14, {
                duration: 2.5,
                easeLinearity: 0.25
            });
        }, 300);
    }, [map]);
    return null;
}

export default function MapView() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filters context
    const [minCoffee, setMinCoffee] = useState(0);
    const [minFood, setMinFood] = useState(0);
    const [minPlace, setMinPlace] = useState(0);
    const [minPrice, setMinPrice] = useState(0);

    const fetchShops = async () => {
        setLoading(true);
        try {
            const res = await getCoffeeShops({
                filter: "all",
                limit: 100,
                // minCoffee,
                // minFood,
                // minPlace,
                // minPrice
            });

            if (res.success && 'data' in res) {
                setShops(res.data as Shop[]);
            }
        } catch (error) {
            console.error("Error fetching shops:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, [minCoffee, minFood, minPlace, minPrice]);

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

    const hasFilters = minCoffee > 0 || minFood > 0 || minPlace > 0 || minPrice > 0;

    return (
        <div className="relative w-full h-full min-h-[60vh]">
            <MapContainer
                center={[25.67119454436982, -100.32390030316438]}
                zoom={13}
                className="w-full h-full min-h-[60vh] z-0"
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <MapController />
                {shops.map((loc) => (
                    <Marker
                        key={loc.id}
                        position={[loc.latitude, loc.longitude]}
                        icon={coffeeIcon}
                        eventHandlers={{
                            click: () => handleMarkerClick(loc),
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-1 w-48">
                                <h3 className="font-bold text-foreground text-xs mb-1">{loc.name}</h3>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <StarRating rating={Number(loc.avgRating)} size={10} />
                                    <span className="text-[9px]">({loc.reviewCount})</span>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    {loc.googleMapsUrl && (
                                        <a
                                            href={loc.googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className=" w-full py-1.5 bg-primary text-[9px] !text-white font-bold rounded-lg uppercase text-center shadow-sm"
                                        >
                                            Abrir Mapa
                                        </a>
                                    )}
                                    <button
                                        className="w-full py-1.5 bg-primary text-[9px] text-white font-bold rounded-lg uppercase shadow-sm"
                                        onClick={() => handleMarkerClick(loc)}
                                    >
                                        ⭐ Ver Reseñas
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* FAB Filter Button */}
            <UserQRDrawer />

            <Drawer>
                <DrawerTrigger asChild>
                    <button className="absolute bottom-24 right-5 z-[500] w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
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
                                    <Map size={14} className="text-primary" /> Lugar (Mínimo)
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

            {loading && (
                <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-white/50 backdrop-blur-sm pointer-events-none">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            <ShopDrawer
                shop={selectedShop}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onReviewSubmitted={fetchShops}
            />
        </div>
    );
}
