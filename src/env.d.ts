/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYPRO_PUBLIC_KEY: string;
  readonly VITE_PAYPRO_MERCHANT_ID: string;
  readonly VITE_ADYEN_PUBLIC_KEY: string;
  readonly VITE_ADYEN_MERCHANT_ID: string;
  readonly VITE_PAYONEER_PUBLIC_KEY: string;
  readonly VITE_PAYONEER_MERCHANT_ID: string;
  readonly VITE_WISE_PUBLIC_KEY: string;
  readonly VITE_WISE_MERCHANT_ID: string;
  readonly VITE_2CHECKOUT_PUBLIC_KEY: string;
  readonly VITE_2CHECKOUT_MERCHANT_ID: string;
  readonly VITE_JAZZCASH_PUBLIC_KEY: string;
  readonly VITE_JAZZCASH_MERCHANT_ID: string;
  readonly VITE_EASYPAY_PUBLIC_KEY: string;
  readonly VITE_EASYPAY_MERCHANT_ID: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
