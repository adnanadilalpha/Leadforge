import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const createSubscription = async (priceId: string) => {
  try {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const response = await fetch('/api/subscription-status');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
};