"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}

export const useTheme = () => {
    // legacy export to prevent immediate breakages if needed, 
    // but ideally we should migrate to next-themes' useTheme
    return { brandColor: "" }; 
};
