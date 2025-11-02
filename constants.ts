
import type { Country, PaymentMethod } from './types';

export const ALL_PAYMENT_METHODS: PaymentMethod[] = ['Credit Card', 'PayPal', 'Bank Transfer', 'Crypto', 'Mobile Money'];

export const INITIAL_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer'], currency: { code: 'USD', symbol: '$' } },
  { code: 'CA', name: 'Canada', paymentMethods: ['Credit Card', 'PayPal'], currency: { code: 'CAD', symbol: '$' } },
  { code: 'GB', name: 'United Kingdom', paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer'], currency: { code: 'GBP', symbol: '£' } },
  { code: 'AU', name: 'Australia', paymentMethods: ['Credit Card', 'PayPal'], currency: { code: 'AUD', symbol: '$' } },
  { code: 'DE', name: 'Germany', paymentMethods: ['Credit Card', 'Bank Transfer'], currency: { code: 'EUR', symbol: '€' } },
  { code: 'NG', name: 'Nigeria', paymentMethods: ['Credit Card', 'Bank Transfer', 'Mobile Money'], currency: { code: 'NGN', symbol: '₦' } },
  { code: 'GH', name: 'Ghana', paymentMethods: ['Credit Card', 'Mobile Money'], currency: { code: 'GHS', symbol: 'GH₵' } },
  { code: 'KE', name: 'Kenya', paymentMethods: ['Credit Card', 'Mobile Money'], currency: { code: 'KES', symbol: 'KSh' } },
  { code: 'ZA', name: 'South Africa', paymentMethods: ['Credit Card', 'Bank Transfer'], currency: { code: 'ZAR', symbol: 'R' } },
  { code: 'JP', name: 'Japan', paymentMethods: ['Credit Card', 'Bank Transfer'], currency: { code: 'JPY', symbol: '¥' } },
  { code: 'AE', name: 'United Arab Emirates', paymentMethods: ['Credit Card', 'Crypto'], currency: { code: 'AED', symbol: 'د.إ' } },
];
