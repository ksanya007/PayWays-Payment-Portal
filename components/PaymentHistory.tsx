
import React from 'react';
import type { Payment } from '../types';
import { CreditCardIcon, PayPalIcon, BankIcon, CryptoIcon, MobileMoneyIcon } from './Icons';

interface PaymentHistoryProps {
  payments: Payment[];
}

const getPaymentMethodIcon = (method: string) => {
    switch (method) {
        case 'Credit Card': return <CreditCardIcon className="w-5 h-5 text-slate-500" />;
        case 'PayPal': return <PayPalIcon className="w-5 h-5 text-slate-500" />;
        case 'Bank Transfer': return <BankIcon className="w-5 h-5 text-slate-500" />;
        case 'Crypto': return <CryptoIcon className="w-5 h-5 text-slate-500" />;
        case 'Mobile Money': return <MobileMoneyIcon className="w-5 h-5 text-slate-500" />;
        default: return null;
    }
};


export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">No Payment History</h2>
        <p className="text-slate-500">Your past transactions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <h2 className="text-xl font-semibold text-slate-800 mb-2">Transaction History</h2>
      <ul className="divide-y divide-slate-200">
        {payments.map((payment) => (
          <li key={payment.id} className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 bg-slate-100 rounded-full p-2">
                {getPaymentMethodIcon(payment.paymentMethod)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{payment.country}</p>
                <p className="text-xs text-slate-500">
                  {new Date(payment.date).toLocaleDateString()} &bull; {payment.paymentMethod}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              ${payment.amount.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
