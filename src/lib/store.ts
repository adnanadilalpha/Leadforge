import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, PricingPlan, Subscription, FreelancerSettings, UserSettings } from '../types';
import { authApi } from './api';
import { stripeClient } from './stripe';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  subscribe: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  setError: (error: string | null) => void;
  updateSettings: (settings: UserSettings) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      subscription: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const user = await authApi.login(email, password);
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Login failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true, error: null });
          const user = await authApi.signup(email, password, name);
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Signup failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          await authApi.logout();
          set({ user: null, isAuthenticated: false, subscription: null });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Logout failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      subscribe: async (planId: string) => {
        try {
          set({ isLoading: true, error: null });
          const { user } = get();
          if (!user) throw new Error('User not authenticated');

          // Create or get Stripe customer
          let customerId = user.stripeCustomerId;
          if (!customerId) {
            const customer = await stripeClient.createCustomer(user.email, user.name);
            customerId = customer.id;
            
            // Update user with Stripe customer ID
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, { stripeCustomerId: customerId });
          }

          // Create checkout session
          const session = await stripeClient.createCheckoutSession(
            customerId,
            planId,
            `${window.location.origin}/settings`
          );

          // Redirect to checkout
          if (session.url) {
            window.location.href = session.url;
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Subscription failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      cancelSubscription: async () => {
        try {
          set({ isLoading: true, error: null });
          const { subscription } = get();
          if (!subscription?.stripeSubscriptionId) {
            throw new Error('No active subscription');
          }
          
          await stripeClient.cancelSubscription(subscription.stripeSubscriptionId);
          set({ subscription: null });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Cancellation failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      setError: (error: string | null) => set({ error }),

      updateSettings: async (settings: UserSettings) => {
        try {
          set({ isLoading: true, error: null });
          const { user } = get();
          if (!user) throw new Error('User not authenticated');

          const userRef = doc(db, 'users', user.id);
          await updateDoc(userRef, {
            settings,
            updatedAt: new Date().toISOString()
          });

          set({
            user: {
              ...user,
              settings,
              updatedAt: new Date().toISOString()
            }
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update settings' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'leadforge-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
