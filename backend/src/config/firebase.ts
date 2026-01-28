import admin from 'firebase-admin';

let firebaseInitialized = false;

export const initializeFirebase = () => {
    if (firebaseInitialized) {
        return admin.app();
    }

    try {
        // In production (Cloud Run), use default credentials
        if (process.env.NODE_ENV === 'production') {
            admin.initializeApp({
                projectId: process.env.FIREBASE_PROJECT_ID,
            });
        } else {
            // In development, use service account key
            const serviceAccount = require('../../serviceAccountKey.json');
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
            });
        }

        firebaseInitialized = true;
        console.log('✅ Firebase Admin initialized');
        return admin.app();
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        throw error;
    }
};

export const getFirestore = () => admin.firestore();
export const getStorage = () => admin.storage();
export const getAuth = () => admin.auth();

export default admin;
