import { getApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const validateEnvVariables = () => {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missing.join(', ')}`
    );
  }
};

const getFirebaseConfig = (): FirebaseConfig => {
  validateEnvVariables();

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
};

let app;
try {
  validateEnvVariables();
  const firebaseConfig = getFirebaseConfig();
  
  try {
    app = getApp();
  } catch {
    app = initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error(
    'Failed to initialize Firebase. Please check your environment variables and Firebase configuration.'
  );
}

export const db = getFirestore(app);
export const auth = getAuth(app);

// Add this to help with debugging
if (import.meta.env.DEV) {
  console.log('Firebase initialized with config:', {
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    // Don't log the API key for security reasons
  });
}
