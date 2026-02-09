"use client"

import { toast } from "sonner"
import { useEffect } from "react"

export function Interop() {
    useEffect(() => {
        (window as any).sendFCM = (token: string) => {
            toast.success("TOKEN: " + token);
            alert(token);
        }
    }, []);

    return (
        <></>
    );
}
