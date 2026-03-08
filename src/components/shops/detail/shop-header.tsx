import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShopFollowButton } from "./shop-follow-button";

interface ShopHeaderProps {
    shopId: string;
    name: string;
    mainImage: string;
    isFollowing?: boolean;
}

export function ShopHeader({ shopId, name, mainImage, isFollowing }: ShopHeaderProps) {
    return (
        <section className="relative h-[45vh] w-full overflow-hidden">
            <Image
                src={mainImage}
                alt={name}
                fill
                className="object-cover"
                priority
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />

            {/* Top Navigation */}
            <div className="absolute top-10 left-0 right-0 p-6 flex items-center justify-between z-10">
                <Link
                    href="/shops"
                    className="w-10 h-10 rounded-xl bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground shadow-lg active:scale-95 transition-transform"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            {/* Bottom Rounded Corner Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-background rounded-t-2xl z-20" />
        </section>
    );
}
