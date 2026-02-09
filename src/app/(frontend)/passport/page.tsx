import { Coffee } from "lucide-react";
import { getCoffeeShops } from "@/actions/coffee-shops";
import { getUserVisits } from "@/actions/visits";
import { PassportList } from "@/components/passport-list";

export const dynamic = "force-dynamic";

export default async function PassportPage() {
    // Initial fetch for "all"
    const { data: initialShops } = await getCoffeeShops({ page: 1, limit: 10, filter: "all" });
    const { data: visits } = await getUserVisits();

    const collectedCount = visits?.length || 0;
    // We don't know total count without a separate query, but let's assume valid total from initial response?
    // Actually, getCoffeeShops doesn't return total. Let's just say "X sellos coleccionados" without "de Y".
    // Or we can add a count query. For now, simplify.

    const nextReward = 5;
    const remaining = nextReward - (collectedCount % nextReward);
    const progress = (collectedCount % nextReward) / nextReward * 100;

    return (
        <div className="p-6 pt-24 pb-28 space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">Tu Pasaporte</h1>
                <p className="text-sm text-foreground/60">Llevas {collectedCount} sellos coleccionados</p>
            </header>

            {/* <PassportList initialShops={initialShops} /> */}

            {/* <div className="bg-primary rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                <Coffee className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
                <h3 className="text-lg font-bold mb-1">Próxima Recompensa</h3>
                <p className="text-sm opacity-90 mb-4">A solo {remaining} sellos de un café gratis</p>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-white h-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div> */}
        </div>
    );
}
