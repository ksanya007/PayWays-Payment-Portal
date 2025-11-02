
import type { Country, PaymentMethod } from './types';

export const ALL_PAYMENT_METHODS: PaymentMethod[] = ['Credit Card', 'PayPal', 'Bank Transfer', 'Crypto', 'Mobile Money'];

export const INITIAL_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer'] },
  { code: 'CA', name: 'Canada', paymentMethods: ['Credit Card', 'PayPal'] },
  { code: 'GB', name: 'United Kingdom', paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer'] },
  { code: 'AU', name: 'Australia', paymentMethods: ['Credit Card', 'PayPal'] },
  { code: 'DE', name: 'Germany', paymentMethods: ['Credit Card', 'Bank Transfer'] },
  { code: 'NG', name: 'Nigeria', paymentMethods: ['Credit Card', 'Bank Transfer', 'Mobile Money'] },
  { code: 'GH', name: 'Ghana', paymentMethods: ['Credit Card', 'Mobile Money'] },
  { code: 'KE', name: 'Kenya', paymentMethods: ['Credit Card', 'Mobile Money'] },
  { code: 'ZA', name: 'South Africa', paymentMethods: ['Credit Card', 'Bank Transfer'] },
  { code: 'JP', name: 'Japan', paymentMethods: ['Credit Card', 'Bank Transfer'] },
  { code: 'AE', name: 'United Arab Emirates', paymentMethods: ['Credit Card', 'Crypto'] },
];
