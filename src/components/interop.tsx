"use client"

import { toast } from "sonner"

export function Interop() {
    function sendFCM(token: string) {
        toast.success("TOKEN: " + token);
        alert(token);
    }
    return (
        <></>
    );
}
