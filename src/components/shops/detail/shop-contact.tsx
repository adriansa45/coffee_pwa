import { MapPin, Phone, Globe } from "lucide-react";

interface ShopContactProps {
    address?: string | null;
    phone?: string | null;
    website?: string | null;
}

export function ShopContact({ address, phone, website }: ShopContactProps) {
    if (!address && !phone && !website) return null;

    return (
        <div className="glass rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-bold">Información de contacto</h2>

            <div className="space-y-3">
                {address && (
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                            <div className="text-sm font-medium">Dirección</div>
                            <div className="text-sm text-muted-foreground">{address}</div>
                        </div>
                    </div>
                )}

                {phone && (
                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                            <div className="text-sm font-medium">Teléfono</div>
                            <div className="text-sm text-muted-foreground">{phone}</div>
                        </div>
                    </div>
                )}

                {website && (
                    <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                            <div className="text-sm font-medium">Sitio web</div>
                            <a
                                href={website.startsWith('http') ? website : `https://${website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                            >
                                {website}
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
