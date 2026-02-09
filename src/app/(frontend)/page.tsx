import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // Redirect based on role
    const role = session?.user ? (session.user as any).role : null;

    if (role === "coffee_shop") {
        redirect("/shop");
    }

    redirect("/home");
}
