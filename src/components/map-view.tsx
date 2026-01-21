"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icons with a custom "coffee cup" feel
const coffeeIcon = L.divIcon({
    className: "custom-div-icon",
    html: `
        <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 bg-brand-600 rounded-full animate-ping opacity-20"></div>
            <div class="relative w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-all duration-500 hover:scale-125 scale-100 animate-in zoom-in-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
            </div>
        </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const locations = [
    { id: 1, name: "Café Esotérico", position: [25.6664821, -100.3182868] as [number, number] },
    { id: 2, name: "Lúcido Café Bar", position: [25.664926, -100.307628] as [number, number] },
    { id: 3, name: "Mun Coffee Bar", position: [25.6731326, -100.3388101] as [number, number] },
    { id: 4, name: "Cafetería Planta Baja", position: [25.7439367, -100.3086757] as [number, number] },
    { id: 5, name: "Alchemy Coffee Lab", position: [25.6692257, -100.3332632] as [number, number] },
    { id: 6, name: "Casa Blasón", position: [25.6591284, -100.3754027] as [number, number] },
    { id: 7, name: "Cataluna-Cafe y Arte", position: [25.6680384, -100.3063455] as [number, number] },
    { id: 8, name: "Etéreo Coffee Shop", position: [25.6764653, -100.29053] as [number, number] },
    { id: 9, name: "Brushtroke Arte y Café", position: [25.7963517, -100.3081444] as [number, number] },
    { id: 10, name: "Leobardo - casa de café", position: [25.6829338, -100.3451735] as [number, number] },
    { id: 11, name: "Lu’um Coffee Shop", position: [25.6761223, -100.3248279] as [number, number] },
    { id: 12, name: "Cocol cafeteria", position: [25.5803298, -99.995057] as [number, number] },
    { id: 13, name: "Sencillito Café", position: [25.666428, -100.3066829] as [number, number] },
    { id: 14, name: "Casamor - Café y Fondita", position: [25.6558623, -100.3586632] as [number, number] },
    { id: 15, name: "Eon Time Coffee", position: [25.769015, -100.271418] as [number, number] },
    { id: 16, name: "Café Limón", position: [25.6648362, -100.3654719] as [number, number] },
    { id: 17, name: "Trebol Café", position: [25.6662576, -100.3105463] as [number, number] },
    { id: 18, name: "Luna Café", position: [25.6708075, -100.3097771] as [number, number] },
    { id: 19, name: "Kire Café", position: [25.6693566, -100.3361847] as [number, number] },
    { id: 20, name: "Santos Café", position: [25.6766283, -100.3325926] as [number, number] },
    { id: 21, name: "Café Cacao", position: [25.6687803, -100.3556001] as [number, number] },
    { id: 22, name: "La Bulla Café", position: [25.6679896, -100.3565925] as [number, number] },
    { id: 23, name: "Buna Café", position: [25.6690849, -100.3096941] as [number, number] },
    { id: 24, name: "Kali Café", position: [25.6761078, -100.3356397] as [number, number] },
    { id: 25, name: "Distrito Café", position: [25.6732052, -100.3411678] as [number, number] },
    { id: 26, name: "Tierra Libre", position: [25.6714218, -100.3282313] as [number, number] },
    { id: 27, name: "Café Laurel", position: [25.6737387, -100.3395468] as [number, number] },
    { id: 28, name: "Buna Café San Pedro", position: [25.6607146, -100.3968836] as [number, number] },
    { id: 29, name: "Café Amargo", position: [25.6821987, -100.3194319] as [number, number] },
    { id: 30, name: "Pan y Café", position: [25.6748416, -100.3304584] as [number, number] },
    { id: 31, name: "Café Belmonte", position: [25.6782304, -100.3174982] as [number, number] },
    { id: 32, name: "Kumori Café", position: [25.6734719, -100.3290184] as [number, number] },
    { id: 33, name: "Café Nacional", position: [25.6683654, -100.3090063] as [number, number] },
    { id: 34, name: "Café Vértice", position: [25.6795064, -100.3187405] as [number, number] },
    { id: 35, name: "Café Antoinette", position: [25.6754169, -100.3327017] as [number, number] },
    { id: 36, name: "Café Leche", position: [25.6725906, -100.3336108] as [number, number] },
    { id: 37, name: "Café del Museo", position: [25.6749193, -100.3089422] as [number, number] },
    { id: 38, name: "Café Cartel", position: [25.6669539, -100.3039983] as [number, number] },
    { id: 39, name: "Café Local", position: [25.6808237, -100.3171516] as [number, number] },
    { id: 40, name: "Café 401", position: [25.6668914, -100.3562941] as [number, number] },
    { id: 41, name: "Café Distrito Tec", position: [25.6518135, -100.2921493] as [number, number] },
    { id: 42, name: "Casa Café", position: [25.6753062, -100.3349119] as [number, number] },
    { id: 43, name: "Café Belgrado", position: [25.6771428, -100.3195887] as [number, number] },
    { id: 44, name: "Café Regular", position: [25.6702741, -100.3238007] as [number, number] },
    { id: 45, name: "Café Liminal", position: [25.6685143, -100.3061202] as [number, number] },
    { id: 46, name: "Café Studio", position: [25.6799276, -100.3174093] as [number, number] },
    { id: 47, name: "Café Tostado", position: [25.6739981, -100.3306974] as [number, number] },
    { id: 48, name: "Café Elemental", position: [25.6743379, -100.3400157] as [number, number] },
    { id: 49, name: "Café Abedul", position: [25.6680942, -100.3558826] as [number, number] },
    { id: 50, name: "Café Páramo", position: [25.6784072, -100.3159884] as [number, number] },
    { id: 51, name: "Café del Parque", position: [25.6667849, -100.3075408] as [number, number] },
    { id: 52, name: "Café Obsidiana", position: [25.6894278, -100.3480674] as [number, number] },
    { id: 53, name: "La última taza", position: [25.6887886, -100.3468836] as [number, number] },
    { id: 54, name: "La Última Taza Torre Lanka", position: [25.6609083, -100.4519858] as [number, number] },
    { id: 55, name: "UBUNTU Coffee&food", position: [25.6623842, -100.4139714] as [number, number] },
    { id: 56, name: "MOOD Coffee", position: [25.6614187, -100.4007385] as [number, number] },
    { id: 57, name: "CAFÉ 1795", position: [25.6418922, -100.2764426] as [number, number] },
    { id: 58, name: "Leche y Miel Café", position: [25.6758271, -100.2976742] as [number, number] },
    { id: 59, name: "AMOBA - Espacio & Café", position: [25.6594887, -100.3601792] as [number, number] },
    { id: 60, name: "Más Alto café de altura", position: [25.7562989, -100.2891255] as [number, number] },
    { id: 61, name: "Mamá Carlota Crafts & Coffee House", position: [25.6913951, -100.3778211] as [number, number] },
    { id: 62, name: "MakecUp by Mily Martel", position: [25.6563165, -100.3003416] as [number, number] },
    { id: 63, name: "CAFETERÍA MALLVA", position: [25.7790363, -100.2815187] as [number, number] },
    { id: 64, name: "Badira", position: [25.691923, -100.3783139] as [number, number] },
    { id: 65, name: "Café Azúcar Morena", position: [25.6554636, -100.3582609] as [number, number] },
    { id: 66, name: "Yellow Coffee Cumbres", position: [25.7476759, -100.4180191] as [number, number] }
];

import { useState } from "react";
import { StarRating } from "./star-rating";
import { authClient } from "@/lib/auth-client";
import { ShopDrawer } from "./shop-drawer";
import { MapPin } from "lucide-react";

interface Shop {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    googleMapsUrl: string | null;
    avgRating: number;
    reviewCount: number;
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

    const fetchShops = async () => {
        try {
            const res = await fetch("/api/shops");
            const data = await res.json();
            if (Array.isArray(data)) {
                setShops(data);
            }
        } catch (error) {
            console.error("Error fetching shops:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const handleMarkerClick = (shop: Shop) => {
        setSelectedShop(shop);
        setIsDrawerOpen(true);
    };

    if (loading) return (
        <div className="w-full h-[60vh] flex items-center justify-center bg-brand-50/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
    );

    return (
        <>
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
                                <h3 className="font-bold text-brand-950 text-xs mb-1">{loc.name}</h3>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <StarRating rating={Number(loc.avgRating)} size={10} />
                                    <span className="text-[9px] text-brand-800/60">({loc.reviewCount})</span>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    {loc.googleMapsUrl && (
                                        <a
                                            href={loc.googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className=" w-full py-1.5 bg-brand-600 text-[9px] !text-white font-bold rounded-lg uppercase text-center shadow-sm"
                                        >
                                            Abrir Mapa
                                        </a>
                                    )}
                                    <button
                                        className="w-full py-1.5 bg-brand-600 text-[9px] text-white font-bold rounded-lg uppercase shadow-sm"
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

            <ShopDrawer
                shop={selectedShop}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onReviewSubmitted={fetchShops}
            />
        </>
    );
}
