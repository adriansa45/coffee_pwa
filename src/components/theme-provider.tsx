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
    const [brandColor, setBrandColor] = useState<string>("#820E2B"); // Default color

    useEffect(() => {
        const user = session?.user as any;
        if (user?.brandColor) {
            setBrandColor(user.brandColor);
        }
    }, [session?.user]);

    useEffect(() => {
        // Update CSS variables
        const root = document.documentElement;
        root.style.setProperty("--primary", brandColor);
        root.style.setProperty("--color-brand-600", brandColor);
        root.style.setProperty("--brand-600", brandColor);
        
        // Simple shade generation (very basic for now)
        // In a real app, we'd use a color library to generate the 50-950 scale
        root.style.setProperty("--brand-500", brandColor);
        root.style.setProperty("--brand-700", brandColor);
    }, [brandColor]);

    return (
        <ThemeContext.Provider value={{ brandColor, setBrandColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};
