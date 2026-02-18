export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background animate-in fade-in duration-700">
            <div className="relative w-20 h-20 mb-12">
                {/* Smoke Lines */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-3">
                    <div className="w-1.5 h-8 bg-primary/30 rounded-full animate-smoke" style={{ animationDelay: '0s' }} />
                    <div className="w-1.5 h-12 bg-primary/30 rounded-full animate-smoke" style={{ animationDelay: '0.4s' }} />
                    <div className="w-1.5 h-10 bg-primary/30 rounded-full animate-smoke" style={{ animationDelay: '0.8s' }} />
                </div>

                {/* Cup Body */}
                <div className="absolute inset-0 bg-primary rounded-b-[2rem] border-b-8 border-primary/20 shadow-xl">
                    {/* Steam/Coffee Light Reflection */}
                    <div className="absolute top-2 left-3 w-4 h-12 bg-white/10 rounded-full blur-sm" />
                </div>

                {/* Cup Handle */}
                <div className="absolute -right-5 top-4 w-8 h-12 border-[6px] border-primary rounded-r-2xl" />

                {/* Plate/Saucer */}
                <div className="absolute -bottom-4 -left-4 -right-4 h-3 bg-primary/40 rounded-full blur-[2px]" />
            </div>

            <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl font-bold text-primary tracking-tight">Cargando</h2>
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                </div>
            </div>
        </div>
    );
}