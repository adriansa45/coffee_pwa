"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-24 w-full bg-muted/20 animate-pulse rounded-3xl" />;
    }

    const options = [
        { value: "light", label: "Claro", icon: Sun },
        { value: "dark", label: "Oscuro", icon: Moon },
        { value: "system", label: "Sistema", icon: Monitor },
    ];

    return (
        <Card className="p-4 bg-card rounded-3xl border border-primary/10 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground px-2 uppercase tracking-wider opacity-60">Tema de la App</h3>
            <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl">
                {options.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = theme === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => setTheme(opt.value)}
                            className={cn(
                                "flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-all duration-300",
                                isActive 
                                    ? "bg-white dark:bg-zinc-800 text-primary shadow-sm scale-100 font-bold" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 scale-95"
                            )}
                        >
                            <Icon size={18} className={cn(isActive ? "stroke-[2.5px]" : "stroke-2")} />
                            <span className="text-[10px] uppercase tracking-widest">{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
}
