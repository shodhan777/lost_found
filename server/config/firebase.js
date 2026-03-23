const admin = require('firebase-admin');
require('dotenv').config();

// Helper to handle newline replacement in private key
const getPrivateKey = () => {
    const key = process.env.FIREBASE_PRIVATE_KEY;
    if (!key) return undefined;
    return key.replace(/\\n/g, '\n');
};

const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: getPrivateKey(),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

const firebaseConfigured = Boolean(
    serviceAccount.project_id &&
    serviceAccount.private_key &&
    serviceAccount.client_email
);

if (!firebaseConfigured) {
    console.warn("Firebase not configured. Falling back to local file uploads.");
    module.exports = null;
    return;
}

try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
    }
    console.log("✅ Firebase Admin initialized successfully");
} catch (error) {
    console.error("❌ Firebase initialization error. Falling back to local uploads:", error);
    module.exports = null;
    return;
}

const bucket = admin.storage().bucket();

module.exports = bucket;
