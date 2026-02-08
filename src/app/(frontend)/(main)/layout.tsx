import { BottomNav } from "@/components/bottom-nav";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative w-full h-screen bg-background overflow-hidden">
            <main className="w-full h-full overflow-auto pb-20">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
