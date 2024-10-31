import type { User, Subscription } from '../types';

// Payment Gateway Options
const PAYMENT_GATEWAYS = {
  PAYPRO: 'paypro', // Popular in Pakistan
  JAZZCASH: 'jazzcash', // Local Pakistani option
  EASYPAY: 'easypay', // Local Pakistani option
  ADYEN: 'adyen', // Global payment solution
  PAYONEER: 'payoneer', // Global with Pakistan support
  WISE: 'wise', // Global with Pakistan support
  TWOCHECKOUT: '2checkout', // Global payment solution
} as const;

type PaymentGateway = typeof PAYMENT_GATEWAYS[keyof typeof PAYMENT_GATEWAYS];

interface PaymentConfig {
  gateway: PaymentGateway;
  publicKey: string;
  merchantId: string;
  apiEndpoint: string;
}

interface PaymentSession {
  id: string;
  url: string;
  status: 'pending' | 'completed' | 'failed';
  gateway: PaymentGateway;
}

interface PaymentParams {
  amount: number;
  currency: string;
  customerId: string;
  planId: string;
  returnUrl: string;
}

const config: Record<PaymentGateway, PaymentConfig> = {
  paypro: {
    gateway: 'paypro',
    publicKey: import.meta.env.VITE_PAYPRO_PUBLIC_KEY as string,
    merchantId: import.meta.env.VITE_PAYPRO_MERCHANT_ID as string,
    apiEndpoint: 'https://api.paypro.com.pk/v2',
  },
  adyen: {
    gateway: 'adyen',
    publicKey: import.meta.env.VITE_ADYEN_PUBLIC_KEY as string,
    merchantId: import.meta.env.VITE_ADYEN_MERCHANT_ID as string,
    apiEndpoint: 'https://checkout-test.adyen.com/v69',
  },
  payoneer: {
    gateway: 'payoneer',
    publicKey: import.meta.env.VITE_PAYONEER_PUBLIC_KEY as string,
    merchantId: import.meta.env.VITE_PAYONEER_MERCHANT_ID as string,
    apiEndpoint: 'https://api.payoneer.com/v2',
  },
  wise: {
    gateway: 'wise',
    publicKey: import.meta.env.VITE_WISE_PUBLIC_KEY as string,
    merchantId: import.meta.env.VITE_WISE_MERCHANT_ID as string,
    apiEndpoint: 'https://api.wise.com/v1',
  },
  '2checkout': {
    gateway: '2checkout',
    publicKey: import.meta.env.VITE_2CHECKOUT_PUBLIC_KEY as string,
    merchantId: import.meta.env.VITE_2CHECKOUT_MERCHANT_ID as string,
    apiEndpoint: 'https://api.2checkout.com/rest/6.0',
  },
  jazzcash: {
    gateway: 'jazzcash',
    publicKey: import.meta.env.VITE_JAZZCASH_PUBLIC_KEY as string,
    merchantId: import.meta.env.VITE_JAZZCASH_MERCHANT_ID as string,
    apiEndpoint: 'https://payments.jazzcash.com.pk/ApplicationAPI/API',
  },
  easypay: {
    gateway: 'easypay',
    publicKey: import.meta.env.VITE_EASYPAY_PUBLIC_KEY as string,
    merchantId: import.meta.env.VITE_EASYPAY_MERCHANT_ID as string,
    apiEndpoint: 'https://easypay.easypaisa.com.pk/easypay-service',
  },
};

export const paymentService = {
  async createSubscription(user: User, planId: string, gateway: PaymentGateway): Promise<PaymentSession> {
    const gatewayConfig = config[gateway];
    
    try {
      const session = await this.createPaymentSession(gateway, {
        amount: this.getPlanAmount(planId),
        currency: 'USD',
        customerId: user.id,
        planId,
        returnUrl: `${window.location.origin}/settings`,
      });

      return session;
    } catch (error) {
      console.error(`Payment error (${gateway}):`, error);
      throw new Error('Payment initialization failed');
    }
  },

  async createPaymentSession(gateway: PaymentGateway, params: PaymentParams): Promise<PaymentSession> {
    const gatewayConfig = config[gateway];

    switch (gateway) {
      case 'paypro':
        return this.createPayProSession(gatewayConfig, params);
      case 'adyen':
        return this.createAdyenSession(gatewayConfig, params);
      case 'payoneer':
        return this.createPayoneerSession(gatewayConfig, params);
      case 'wise':
        return this.createWiseSession(gatewayConfig, params);
      case '2checkout':
        return this.create2CheckoutSession(gatewayConfig, params);
      case 'jazzcash':
        return this.createJazzCashSession(gatewayConfig, params);
      case 'easypay':
        return this.createEasyPaySession(gatewayConfig, params);
      default:
        throw new Error('Unsupported payment gateway');
    }
  },

  async createPayProSession(config: PaymentConfig, params: PaymentParams): Promise<PaymentSession> {
    // PayPro implementation
    throw new Error('Not implemented');
  },

  async createAdyenSession(config: PaymentConfig, params: PaymentParams): Promise<PaymentSession> {
    // Adyen implementation
    throw new Error('Not implemented');
  },

  async createPayoneerSession(config: PaymentConfig, params: PaymentParams): Promise<PaymentSession> {
    // Payoneer implementation
    throw new Error('Not implemented');
  },

  async createWiseSession(config: PaymentConfig, params: PaymentParams): Promise<PaymentSession> {
    // Wise implementation
    throw new Error('Not implemented');
  },

  async create2CheckoutSession(config: PaymentConfig, params: PaymentParams): Promise<PaymentSession> {
    // 2Checkout implementation
    throw new Error('Not implemented');
  },

  async createJazzCashSession(config: PaymentConfig, params: PaymentParams): Promise<PaymentSession> {
    // JazzCash implementation
    throw new Error('Not implemented');
  },

  async createEasyPaySession(config: PaymentConfig, params: PaymentParams): Promise<PaymentSession> {
    // EasyPay implementation
    throw new Error('Not implemented');
  },

  async cancelSubscription(subscriptionId: string, gateway: PaymentGateway): Promise<void> {
    const gatewayConfig = config[gateway];
    
    try {
      switch (gateway) {
        case 'paypro':
          // PayPro cancellation
          break;
        case 'adyen':
          // Adyen cancellation
          break;
        // ... handle other gateways
      }
    } catch (error) {
      console.error(`Cancellation error (${gateway}):`, error);
      throw new Error('Failed to cancel subscription');
    }
  },

  getPlanAmount(planId: string): number {
    // Get plan amount from your pricing configuration
    return 0; // Implement actual pricing logic
  }
};
