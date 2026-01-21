import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stamp, Coffee } from "lucide-react";

export default function PassportPage() {
    const stamps = [
        { id: 1, name: "Antojo Café", date: "2024-03-15", collected: true },
        { id: 2, name: "Maravilla", date: "2024-03-10", collected: true },
        { id: 3, name: "Gran Borcegui", date: null, collected: false },
        { id: 4, name: "Finca El Zapote", date: null, collected: false },
    ];

    return (
        <div className="p-6 pt-24 pb-28 space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-bold text-brand-950">Tu Pasaporte</h1>
                <p className="text-sm text-brand-900/60">Llevas 2 de 10 sellos coleccionados</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
                {stamps.map((stamp) => (
                    <div
                        key={stamp.id}
                        className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center p-4 transition-all ${stamp.collected
                            ? "bg-white border-brand-200 shadow-sm"
                            : "bg-brand-100/30 border-dashed border-brand-200"
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${stamp.collected ? "bg-brand-500 text-white" : "bg-brand-200/50 text-brand-300"
                            }`}>
                            <Stamp className="w-6 h-6" />
                        </div>
                        <span className={`text-[11px] font-bold text-center leading-tight ${stamp.collected ? "text-brand-900" : "text-brand-900/30"
                            }`}>
                            {stamp.name}
                        </span>
                        {stamp.date && (
                            <span className="text-[9px] text-brand-600/60 mt-1">{stamp.date}</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-brand-600 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                <Coffee className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
                <h3 className="text-lg font-bold mb-1">Próxima Recompensa</h3>
                <p className="text-sm opacity-90 mb-4">A solo 3 sellos de un café gratis</p>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full w-[40%]" />
                </div>
            </div>
        </div>
    );
}
