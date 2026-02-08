import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopHeaderProps {
    name: string;
    mainImage: string;
    isOpen: boolean;
    openUntil?: string;
}

export function ShopHeader({ name, mainImage, isOpen, openUntil }: ShopHeaderProps) {
    return (
        <section className="relative h-[50vh]">
            <Image
                src={mainImage}
                alt={name}
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
                <Link
                    href="/shops"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-white">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Status Badge */}
            <div className="absolute top-20 left-6">
                <div className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border",
                    isOpen
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                )}>
                    {isOpen ? `Abierto hasta ${openUntil}` : 'Cerrado'}
                </div>
            </div>
        </section>
    );
}
