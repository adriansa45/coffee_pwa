import { BottomNav } from "@/components/bottom-nav";
import { TopNav } from "@/components/top-nav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative w-full h-screen bg-brand-50/30 overflow-hidden">
            <TopNav />
            <main className="w-full h-full overflow-auto">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
