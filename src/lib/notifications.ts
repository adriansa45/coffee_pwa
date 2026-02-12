import { db } from "@/db";
import { user } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { messaging } from "./firebase-admin";

export interface NotificationPayload {
    title: string;
    body: string;
    data?: Record<string, string>;
}

/**
 * Sends a push notification to a specific user via FCM.
 * @param userId The ID of the user to receive the notification.
 * @param payload The notification content (title, body, and optional data).
 * @returns A promise that resolves to true if sent, or false if the user has no token or an error occurred.
 */
export async function sendPushNotification(userId: string, payload: NotificationPayload): Promise<boolean> {
    try {
        // 1. Fetch user's FCM token from DB
        const result = await db.query.user.findFirst({
            where: eq(user.id, userId),
            columns: {
                fcmToken: true,
            },
        });

        if (!result?.fcmToken) {
            console.warn(`No FCM token found for user ${userId}`);
            return false;
        }

        // 2. Prepare the message
        const message = {
            token: result.fcmToken,
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {},
            android: {
                priority: "high" as const,
                notification: {
                    sound: "default",
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: "default",
                    },
                },
            },
        };

        // 3. Send using Admin SDK
        const response = await messaging.send(message);
        console.log(`Successfully sent message to user ${userId}:`, response);
        return true;
    } catch (error) {
        console.error(`Error sending push notification to user ${userId}:`, error);
        return false;
    }
}
