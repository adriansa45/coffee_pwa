import { getCoffeeShops } from "@/actions/coffee-shops";
import MapCnView from "@/components/map-cn-view";

export default async function MapPage() {
    // Fetch shops data on the server
    const shopsRes = await getCoffeeShops({
        filter: "all",
        limit: 100,
    });

    const shops = (shopsRes.success && 'data' in shopsRes) ? shopsRes.data : [];

    return (
        <div className="w-screen h-screen relative">
            <div className="absolute top-14 left-4 right-4 z-[100] bg-white/90 backdrop-blur-md py-3 px-4 rounded-2xl border border-primary/10 shadow-lg pointer-events-none">
                <h2 className="text-xs font-bold text-foreground/80 uppercase tracking-widest">CERCA DE TI</h2>
            </div>
            <MapCnView initialShops={shops as any} />
        </div>
    );
}
