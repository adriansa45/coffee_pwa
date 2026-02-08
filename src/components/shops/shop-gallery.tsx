"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShopGallery({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (images.length === 0) return null;

    return (
        <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden group">
            {images.map((img, index) => (
                <div
                    key={img}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-500",
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    )}
                >
                    <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                </div>
            ))}

            {images.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all",
                                    index === currentIndex ? "bg-white w-4" : "bg-white/40"
                                )}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
