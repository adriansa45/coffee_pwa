"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Upload } from "lucide-react";
import { updateProfileImage } from "@/app/actions/user";
import { useTheme } from "@/components/theme-provider";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner"; // Assuming sonner is available or similar toast utility

export function ProfilePictureUpload({ initialImage, name }: { initialImage?: string | null, name?: string | null }) {
    const [image, setImage] = useState(initialImage);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { brandColor } = useTheme();
    const { refetch } = authClient.useSession();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 4.5MB for Vercel Hobby, let's stick to 4MB)
        if (file.size > 4 * 1024 * 1024) {
            alert("La imagen es demasiado grande. El máximo es 4MB.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await updateProfileImage(formData);
            if (result.success && result.url) {
                setImage(result.url);
                await refetch(); // Refresh session to reflect changes
                toast.success("Imagen de perfil actualizada");
            } else {
                alert(result.error || "Error al subir la imagen");
            }
        } catch (error) {
            alert("Error inesperado al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 py-4 bg-white rounded-3xl border border-primary/10 shadow-sm mb-6">
            <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                    <AvatarImage src={image || ""} alt={name || "Usuario"} className="object-cover" />
                    <AvatarFallback className="bg-primary/20 text-primary text-4xl font-black">
                        {(name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 p-3 rounded-full shadow-lg transition-all active:scale-90 flex items-center justify-center border-2 border-white"
                    style={{ backgroundColor: brandColor }}
                >
                    {uploading ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                        <Camera className="w-5 h-5 text-white" />
                    )}
                </button>
            </div>

            <div className="text-center">
                <p className="text-sm font-bold text-foreground/80">Foto de perfil</p>
                <p className="text-xs text-foreground/40 mt-1">PNG, JPG hasta 4MB</p>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
}
