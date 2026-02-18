"use client";

import { ArrowLeft, ChevronRight, ExternalLink, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
    const router = useRouter();

    const sections = [
        {
            title: "Acuerdos",
            items: [
                {
                    label: "Ver acuerdo de privacidad",
                    icon: Shield,
                    href: "https://espresso.ink/privacy",
                    external: true,
                    color: "text-primary",
                    bg: "bg-primary/10"
                },
                {
                    label: "Ver términos y condiciones",
                    icon: Shield,
                    href: "https://espresso.ink/terms",
                    external: true,
                    color: "text-primary",
                    bg: "bg-primary/10"
                }
            ]
        },
        {
            title: "Gestión de Cuenta",
            items: [
                {
                    label: "Borrar cuenta",
                    icon: Trash2,
                    href: "https://espresso.ink/delete-account",
                    external: true,
                    color: "text-red-600",
                    bg: "bg-red-50"
                }
            ]
        }
    ];

    return (
        <div className="p-6 pt-18 pb-28 space-y-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full text-foreground/40 hover:bg-primary/5 hover:text-foreground transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="space-y-1">
                    <h1 className="text-xl font-bold">Privacidad</h1>
                    <p className="text-xs font-medium text-foreground/40">Gestiona tus datos y privacidad</p>
                </div>
            </div>

            <div className="space-y-8">
                {sections.map((section) => (
                    <div key={section.title} className="space-y-4">
                        <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider ml-1">
                            {section.title}
                        </h3>
                        <div className="bg-white rounded-2xl border border-primary/10 divide-y divide-primary/5 shadow-sm overflow-hidden">
                            {section.items.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center ${item.color}`}>
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <span className={`text-sm font-medium ${item.color === 'text-red-600' ? 'text-red-600' : 'text-foreground/90'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ExternalLink className="w-3.5 h-3.5 text-foreground/20" />
                                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <footer className="text-center pt-8">
                <p className="text-[10px] text-foreground/20">
                    Tu privacidad es importante para nosotros.
                </p>
            </footer>
        </div>
    );
}
