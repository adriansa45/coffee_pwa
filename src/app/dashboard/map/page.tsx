"use client";

import dynamic from "next/dynamic";
import { Coffee } from "lucide-react";

// Dynamically import map component as it uses browser APIs
const MapComponent = dynamic(() => import("@/components/map-view"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-brand-50/50">
            <div className="flex flex-col items-center gap-4">
                <Coffee className="w-10 h-10 text-brand-600 animate-bounce" />
                <p className="text-brand-900/40 text-sm font-medium">Cargando mapa...</p>
            </div>
        </div>
    )
});

export default function MapPage() {
    return (
        <div className="w-screen h-screen relative">
            <div className="absolute top-20 left-4 right-4 z-[1001] bg-white/90 backdrop-blur-md py-3 px-4 rounded-2xl border border-brand-100 shadow-lg">
                <h2 className="text-xs font-bold text-brand-900/80 uppercase tracking-widest">CERCA DE TI</h2>
            </div>
            <MapComponent />
        </div>
    );
}
