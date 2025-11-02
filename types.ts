
export interface Payment {
  id: string;
  country: string;
  paymentMethod: string;
  amount: number;
  date: string;
  userId?: string;
}

export type PaymentMethod = 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'Crypto' | 'Mobile Money';

export interface Country {
  code: string;
  name: string;
  paymentMethods: PaymentMethod[];
}

export interface GeminiRiskAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  reason: string;
  indicators?: string[];
}

export interface User {
  id: string;
  email: string;
  passwordHash: string; // This is for simulation only. In a real app, this would be a server-side hash.
  isAdmin: boolean;
}