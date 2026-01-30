import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";
import { revalidatePath } from "next/cache";

export async function registerVisitByCode(userCode: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return { success: false, message: "No autorizado" };
    }

    const role = (session.user as any).role;
    const shopId = (session.user as any).shopId;

    if (role !== "coffee_shop" || !shopId) {
        return { success: false, message: "No tienes permisos de cafetería" };
    }

    const payload = await getPayload();

    // Find the user by code
    const users = await payload.find({
        collection: 'users',
        where: {
            userCode: {
                equals: userCode,
            },
        },
    });

    const targetUser = users.docs[0];

    if (!targetUser) {
        return { success: false, message: "Código de usuario inválido" };
    }

    try {
        await payload.create({
            collection: 'visits',
            data: {
                user: targetUser.id,
                shop: shopId,
                visitedAt: new Date().toISOString(),
            },
        });

        revalidatePath("/");
        return { success: true, message: `Visita registrada para ${targetUser.name}` };
    } catch (error) {
        console.error("Error registering visit:", error);
        return { success: false, message: "Error al registrar la visita" };
    }
}

export async function getUserVisits() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return { success: false, data: [] };
    }

    try {
        const payload = await getPayload();
        const userVisits = await payload.find({
            collection: 'visits',
            where: {
                user: {
                    equals: session.user.id,
                },
            },
            sort: '-visitedAt',
            depth: 1, // Populate shop
        });

        return { success: true, data: userVisits.docs };
    } catch (error) {
        console.error("Error fetching visits:", error);
        return { success: false, data: [] };
    }
}
