import admin from "firebase-admin";

const firebaseAdminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
    if (firebaseAdminConfig.projectId && firebaseAdminConfig.clientEmail && firebaseAdminConfig.privateKey) {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseAdminConfig),
        });
    } else {
        console.warn("Firebase Admin SDK not initialized: Missing environment variables.");
    }
}

export const messaging = admin.messaging();
