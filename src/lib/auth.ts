import { auth as firebaseAuth } from './firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export interface AuthSession {
  user: {
    id: string;
    email: string | null;
    name: string | null;
  }
}

export const getCurrentUser = async (): Promise<AuthSession | null> => {
  const currentUser = firebaseAuth.currentUser;
  if (!currentUser) return null;
  
  return {
    user: {
      id: currentUser.uid,
      email: currentUser.email,
      name: currentUser.displayName
    }
  };
};

export const firebaseSignIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

export const firebaseSignOut = async (): Promise<void> => {
  return signOut(firebaseAuth);
};
