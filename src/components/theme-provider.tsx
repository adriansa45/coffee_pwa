"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type ThemeContextType = {
    brandColor: string;
    setBrandColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = authClient.useSession();
    const [manualColor, setManualColor] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("brand-color");
        }
        return null;
    });

    // Derived state: Manual override (including localStorage), then session, then default
    const sessionColor = (session?.user as any)?.brandColor;
    const brandColor = manualColor || sessionColor || "#820E2B";

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
