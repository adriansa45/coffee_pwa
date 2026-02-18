"use client";

import { authClient } from "@/lib/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
    brandColor: string;
    setBrandColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = authClient.useSession();
    const [mounted, setMounted] = useState(false);
    const [manualColor, setManualColor] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("brand-color");
        if (saved) setManualColor(saved);
    }, []);

    // Derived state: Manual override (including localStorage), then session, then default
    const sessionColor = (session?.user as any)?.brandColor;
    const brandColor = mounted ? (manualColor || sessionColor || "#764f32") : "#764f32";

    useEffect(() => {
        // Update CSS variables
        const root = (document as any).documentElement;
        root.style.setProperty("--primary", brandColor);
        root.style.setProperty("--color-primary", brandColor);
        root.style.setProperty("--color-brand-600", brandColor);
        root.style.setProperty("--brand-600", brandColor);
        root.style.setProperty("--ring", brandColor);

        // Simple shade generation
        root.style.setProperty("--brand-500", brandColor);
        root.style.setProperty("--brand-700", brandColor);

        // Persist to localStorage
        localStorage.setItem("brand-color", brandColor);
    }, [brandColor]);

    return (
        <ThemeContext.Provider value={{ brandColor, setBrandColor: setManualColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};
