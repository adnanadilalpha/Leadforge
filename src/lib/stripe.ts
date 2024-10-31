import Stripe from 'stripe';
import { PRICING_PLANS } from './constants';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const stripeClient = {
  async createCustomer(email: string, name: string) {
    return stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'leadforge',
      },
    });
  },

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card', 'us_bank_account'],
      metadata: {
        source: 'leadforge',
      },
    });
  },

  async createSubscription(customerId: string, priceId: string) {
    return stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
  },

  async createCheckoutSession(customerId: string, priceId: string, returnUrl: string) {
    return stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${returnUrl}?success=true`,
      cancel_url: `${returnUrl}?canceled=true`,
      payment_method_types: ['card', 'us_bank_account'],
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });
  },

  async cancelSubscription(subscriptionId: string) {
    return stripe.subscriptions.cancel(subscriptionId);
  },

  async getSubscription(subscriptionId: string) {
    return stripe.subscriptions.retrieve(subscriptionId);
  },

  async createPortalSession(customerId: string, returnUrl: string) {
    return stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }
};
