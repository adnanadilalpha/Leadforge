import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  // Check if the error is about the app already being initialized
  if (!/already exists/.test(error.message)) {
    console.error('Firebase initialization error', (error as Error).stack);
  }
}
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
