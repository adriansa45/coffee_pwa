"use client";

import React from "react";
import { useTheme } from "@/components/theme-provider";
import { updateBrandColor } from "@/actions/theme";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
    "#820E2B", // Default
    "#1e40af", // Blue
    "#15803d", // Green
    "#a21caf", // Purple
    "#ea580c", // Orange
    "#0f172a", // Slate
    "#be185d", // Pink
    "#115e59", // Teal
];

export function ColorPicker() {
    const { brandColor, setBrandColor } = useTheme();

    const handleColorSelect = async (color: string) => {
        setBrandColor(color);
        await updateBrandColor(color);
    };

    return (
        <div className="space-y-4 p-4 bg-white rounded-3xl border border-brand-100 shadow-sm">
            <h3 className="text-sm font-bold text-brand-950 px-2 uppercase tracking-wider opacity-60">Color de Marca</h3>
            <div className="grid grid-cols-4 gap-3">
                {PRESET_COLORS.map((color) => (
                    <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={cn(
                            "w-full aspect-square rounded-2xl flex items-center justify-center transition-all active:scale-90",
                            "hover:ring-4 hover:ring-opacity-20",
                        )}
                        style={{ backgroundColor: color, "--tw-ring-color": color } as any}
                    >
                        {brandColor === color && <Check className="text-white w-6 h-6 stroke-[3px]" />}
                    </button>
                ))}
            </div>
        </div>
    );
}
