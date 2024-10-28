import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDACUhTJT0jp9HnYHyipTu2tciSLZomiKk",
  authDomain: "leadforge-4567d.firebaseapp.com",
  projectId: "leadforge-4567d",
  storageBucket: "leadforge-4567d.appspot.com",
  messagingSenderId: "907125534983",
  appId: "1:907125534983:web:0d9fd3a0bb8a4ebbcf15a2",
  measurementId: "G-VKVM1B3FEN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Only enable emulators if explicitly configured
if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  } catch (error) {
    console.error('Error connecting to Firebase emulators:', error);
  }
}
