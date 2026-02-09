"use client";

import { Stamp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PassportStampProps {
    id: string; // shop id (uuid)
    name: string;
    date: string | null;
    collected: boolean;
}

export function PassportStamp({ id, name, date, collected }: PassportStampProps) {
    const [loading, setLoading] = useState(false);
    return (
        <div
            className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center p-4 transition-all cursor-default ${collected
                    ? "bg-white border-primary/20 shadow-sm"
                    : "bg-primary/10/30 border-dashed border-primary/20"
                }`}
        >
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${collected ? "bg-primary/60 text-white" : "bg-primary/20/50 text-brand-300"
                    }`}
            >
                <Stamp className="w-6 h-6" />
            </div>
            <span
                className={`text-[11px] font-bold text-center leading-tight ${collected ? "text-foreground/90" : "text-foreground/30"
                    }`}
            >
                {name}
            </span>
            {date && (
                <span className="text-[9px] text-primary/60 mt-1">
                    {new Date(date).toLocaleDateString()}
                </span>
            )}
        </div>
    );
}
