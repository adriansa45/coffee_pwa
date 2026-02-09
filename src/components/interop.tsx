"use client"

import { toast } from "sonner"
import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { updateFcmToken } from "@/actions/fcm"

export function Interop() {
    const { data: session } = authClient.useSession();

    useEffect(() => {
        (window as any).sendFCM = async (token: string) => {
            if (session?.user) {
                // If logged in, update the database
                const result = await updateFcmToken(token);
                if (result.success) {
                    toast.success("Token de notificaciones actualizado");
                } else {
                    console.error("Error updating FCM token:", result.error);
                }
            } else {
                // If not logged in, save to local storage and cookie
                localStorage.setItem("fcm_token", token);
                document.cookie = `fcm_token=${token}; path=/; max-age=31536000; SameSite=Lax`;
                toast.info("Token de notificaciones guardado localmente");
            }
        }
    }, [session]);

    // Sync token on login
    useEffect(() => {
        const syncToken = async () => {
            const cachedToken = localStorage.getItem("fcm_token");
            if (session?.user && cachedToken) {
                const result = await updateFcmToken(cachedToken);
                if (result.success) {
                    localStorage.removeItem("fcm_token");
                    // Clear cookie
                    document.cookie = "fcm_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    console.log("Cached FCM token synced to user profile");
                }
            }
        };

        syncToken();
    }, [session]);

    return (
        <></>
    );
}
