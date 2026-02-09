import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema/auth-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
        async sendResetPassword({ user, url }) {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: "Espresso <espresso@softlycompany.com>",
                    to: user.email,
                    subject: "Restablece tu contraseña - Espresso",
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h1 style="color: #820E2B;">Espresso</h1>
                            <p>Hola ${user.name || ""},</p>
                            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Espresso.</p>
                            <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #820E2B; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Restablecer contraseña</a>
                            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                        </div>
                    `,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                console.error("Resend error:", error);
                throw new Error("Failed to send reset password email");
            }
        },
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "customer",
                input: false, // Don't allow user to set their role
            },
            userCode: {
                type: "string",
                required: false,
                input: false,
            },
            shopId: {
                type: "string",
                required: false,
                input: false,
            },
            brandColor: {
                type: "string",
                required: false,
                defaultValue: "#820E2B",
            },
            fcmToken: {
                type: "string",
                required: false,
            }
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // Cache session for 5 minutes
        },
    },
});
