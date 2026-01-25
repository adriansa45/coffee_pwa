"use client";

import { Stamp } from "lucide-react";
import { registerVisit } from "@/actions/visits";
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
    const router = useRouter();

    const handleStamp = async () => {
        if (collected || loading) return;

        // Optional: Confirm dialog
        if (!confirm(`¿Registrar visita en ${name}?`)) return;

        setLoading(true);
        try {
            const result = await registerVisit(id);
            if (result.success) {
                router.refresh(); // Refresh to update server data
            } else {
                alert("Error al registrar visita");
            }
        } catch (error) {
            console.error(error);
            alert("Error al registrar visita");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={handleStamp}
            className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center p-4 transition-all cursor-pointer ${collected
                    ? "bg-white border-brand-200 shadow-sm"
                    : "bg-brand-100/30 border-dashed border-brand-200 hover:bg-brand-100/50"
                } ${loading ? "opacity-50" : ""}`}
        >
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${collected ? "bg-brand-500 text-white" : "bg-brand-200/50 text-brand-300"
                    }`}
            >
                <Stamp className="w-6 h-6" />
            </div>
            <span
                className={`text-[11px] font-bold text-center leading-tight ${collected ? "text-brand-900" : "text-brand-900/30"
                    }`}
            >
                {name}
            </span>
            {date && (
                <span className="text-[9px] text-brand-600/60 mt-1">
                    {new Date(date).toLocaleDateString()}
                </span>
            )}
        </div>
    );
}
