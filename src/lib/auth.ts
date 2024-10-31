import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        const userData: User = {
          id: user.uid,
          email: user.email!,
          name: user.displayName || email.split('@')[0],
          role: 'freelancer',
          subscription: { status: 'trial', planId: 'FREE' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          settings: {
            notifications: {
              email: true,
              browser: false,
              leadAlerts: true,
              weeklyReport: true
            },
            privacy: {
              shareData: false,
              allowMarketing: true
            },
            leadPreferences: {
              industries: [],
              projectTypes: [],
              budgetRange: { min: 0, max: 0 }
            }
          }
        };
        await setDoc(doc(db, 'users', user.uid), userData);
        return userData;
      }

      return { ...userDoc.data(), id: user.uid } as User;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  async signup(email: string, password: string, name: string): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData: User = {
        id: user.uid,
        email,
        name,
        role: 'freelancer',
        subscription: {
          status: 'trial',
          planId: 'FREE'
        },
        settings: {
          notifications: {
            email: true,
            browser: false,
            leadAlerts: true,
            weeklyReport: true
          },
          privacy: {
            shareData: false,
            allowMarketing: true
          },
          leadPreferences: {
            industries: [],
            projectTypes: [],
            budgetRange: { min: 0, max: 0 }
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    } catch (error: any) {
      console.error('Signup error:', error);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Email already in use');
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/weak-password':
          throw new Error('Password is too weak');
        default:
          throw new Error('Signup failed. Please try again');
      }
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed. Please try again');
    }
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        callback(userDoc.exists() ? { ...userDoc.data(), id: firebaseUser.uid } as User : null);
      } else {
        callback(null);
      }
    });
  }
};
