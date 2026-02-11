"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Media {
    id: string | number;
    url?: string | null;
}

interface ShopGalleryProps {
    shopName: string;
    gallery: Media[];
}

export function ShopGallery({ shopName, gallery }: ShopGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % gallery.length);
            setZoom(1);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + gallery.length) % gallery.length);
            setZoom(1);
        }
    };

    const toggleZoom = (e: React.MouseEvent) => {
        e.stopPropagation();
        setZoom(prev => (prev === 1 ? 2 : 1));
    };

    if (!gallery || gallery.length === 0) return null;

    return (
        <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black">Fotos <span className="text-sm font-bold text-zinc-400">({gallery.length})</span></h3>
                <button className="text-primary text-sm font-bold uppercase tracking-wider">Ver todas</button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                {gallery.map((img, index) => (
                    <div 
                        key={img.id}
                        onClick={() => setSelectedIndex(index)}
                        className="relative min-w-[240px] h-[180px] rounded-[1rem] overflow-hidden flex-shrink-0 shadow-lg active:scale-95 transition-all cursor-pointer border-4 border-white"
                    >
                        <Image
                            src={img.url || "/images/coffee-placeholder.jpg"}
                            alt={`${shopName} gallery ${index}`}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors" />
                    </div>
                ))}
            </div>

            <Dialog open={selectedIndex !== null} onOpenChange={(open: boolean) => {
                if (!open) {
                    setSelectedIndex(null);
                    setZoom(1);
                }
            }}>
                <DialogContent 
                    className="max-w-none w-screen h-screen p-0 bg-black/95 border-none shadow-none flex items-center justify-center outline-none z-[3000]"
                    onClick={() => setSelectedIndex(null)}
                >
                    <div className="sr-only">
                        <DialogTitle>Galería de fotos de {shopName}</DialogTitle>
                        <DialogDescription>Visualizador de imágenes de la cafetería {shopName}</DialogDescription>
                    </div>
                    
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none p-4 md:p-12">
                        {/* Animated Image Container */}
                        <div
                            key={selectedIndex}
                            className="relative w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-500 ease-out"
                            style={{ 
                                transform: `scale(${zoom})`,
                                transition: zoom === 1 ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.3s ease-out'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleZoom(e);
                            }}
                        >
                            <Image
                                src={gallery[selectedIndex ?? 0]?.url || ""}
                                alt={`${shopName} enlarged`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Navigation Controls */}
                        {gallery.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 hover:bg-white/12 backdrop-blur-2xl text-white flex items-center justify-center active:scale-90 transition-all z-50 border border-white/10"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 hover:bg-white/12 backdrop-blur-2xl text-white flex items-center justify-center active:scale-90 transition-all z-50 border border-white/10"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        {/* Top Controls */}
                        <div className="absolute top-8 right-8 flex gap-4 z-50" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={toggleZoom}
                                className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/12 backdrop-blur-2xl text-white flex items-center justify-center active:scale-90 transition-all border border-white/10"
                            >
                                {zoom === 1 ? <ZoomIn size={28} /> : <ZoomOut size={28} />}
                            </button>
                            <button
                                onClick={() => setSelectedIndex(null)}
                                className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/12 backdrop-blur-2xl text-white flex items-center justify-center active:scale-90 transition-all border border-white/10"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Image Counter Badge */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-3xl text-white text-xs font-black border border-white/10 tracking-[0.2em] uppercase">
                            {selectedIndex !== null ? selectedIndex + 1 : 0} <span className="text-white/30 mx-2">|</span> {gallery.length}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
