
import React, { useState, useMemo, useEffect } from 'react';
import type { Country, PaymentMethod, Payment, GeminiRiskAnalysis } from '../types';
import { analyzeTransactionRisk } from '../services/geminiService';
import { CreditCardIcon, PayPalIcon, BankIcon, CryptoIcon, ArrowRightIcon, SparklesIcon, ExclamationTriangleIcon, CheckCircleIcon, MobileMoneyIcon } from './Icons';

interface PaymentFormProps {
  onPaymentSuccess: (payment: Omit<Payment, 'id' | 'date'>) => void;
  countries: Country[];
}

const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
        case 'Credit Card': return <CreditCardIcon className="w-6 h-6" />;
        case 'PayPal': return <PayPalIcon className="w-6 h-6" />;
        case 'Bank Transfer': return <BankIcon className="w-6 h-6" />;
        case 'Crypto': return <CryptoIcon className="w-6 h-6" />;
        case 'Mobile Money': return <MobileMoneyIcon className="w-6 h-6" />;
        default: return null;
    }
};

type Status = 'idle' | 'loading' | 'success' | 'error' | 'denied';

export const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentSuccess, countries }) => {
  const [countryCode, setCountryCode] = useState<string>(countries.length > 0 ? countries[0].code : '');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = useState<Status>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [riskAnalysis, setRiskAnalysis] = useState<GeminiRiskAnalysis | null>(null);

  const selectedCountry: Country | undefined = useMemo(() => countries.find(c => c.code === countryCode), [countryCode, countries]);

  useEffect(() => {
    if (!selectedCountry) {
        setCountryCode(countries.length > 0 ? countries[0].code : '');
        setSelectedMethod(null);
    } else {
        if (selectedMethod && !selectedCountry.paymentMethods.includes(selectedMethod)) {
            setSelectedMethod(null);
        }
    }
  }, [countryCode, countries, selectedCountry, selectedMethod]);

  const resetForm = () => {
    setCountryCode(countries.length > 0 ? countries[0].code : '');
    setSelectedMethod(null);
    setAmount('');
    setStatus('idle');
    setFeedbackMessage('');
    setRiskAnalysis(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry || !selectedMethod || !amount || parseFloat(amount) <= 0) {
      setStatus('error');
      setFeedbackMessage('Please fill out all fields correctly.');
      return;
    }
    
    setStatus('loading');
    setFeedbackMessage('Securing connection and analyzing transaction...');
    setRiskAnalysis(null);

    const transactionDetails = {
        country: selectedCountry.name,
        amount: parseFloat(amount),
        paymentMethod: selectedMethod,
        currencyCode: selectedCountry.currency.code,
        currencySymbol: selectedCountry.currency.symbol,
    };

    const analysisResult: GeminiRiskAnalysis = await analyzeTransactionRisk(transactionDetails);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setRiskAnalysis(analysisResult);

    if (analysisResult.riskLevel === 'high') {
        setStatus('denied');
    } else {
        setStatus('success');
        onPaymentSuccess(transactionDetails);
        setTimeout(resetForm, 5000);
    }
  };

  if (status !== 'idle' && status !== 'error') {
    const riskColorClass = {
        low: 'text-green-600 bg-green-100',
        medium: 'text-yellow-600 bg-yellow-100',
        high: 'text-red-600 bg-red-100',
    };

    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[350px]">
            {status === 'loading' && (
                <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-slate-700 font-medium">{feedbackMessage}</p>
                </>
            )}
            {(status === 'success' || status === 'denied') && riskAnalysis && (
                <div className="w-full text-left">
                    <div className="flex items-center justify-center mb-4">
                        {status === 'success' ? <CheckCircleIcon className="w-12 h-12 text-green-500" /> : <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />}
                    </div>
                    <h3 className="text-xl font-bold text-center mb-4">{status === 'success' ? 'Payment Successful' : 'Transaction Denied'}</h3>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-slate-800">Fraud Risk Analysis:</h4>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Risk Level</span>
                            <span className={`px-2 py-0.5 rounded-full text-sm font-bold capitalize ${riskColorClass[riskAnalysis.riskLevel]}`}>
                                {riskAnalysis.riskLevel}
                            </span>
                        </div>
                        <div className="text-sm">
                            <p className="text-slate-600 mb-1">Reason:</p>
                            <p className="text-slate-800">{riskAnalysis.reason}</p>
                        </div>

                        {riskAnalysis.indicators && riskAnalysis.indicators.length > 0 && (
                            <div className="text-sm">
                                <p className="text-slate-600 mb-1">Risk Indicators:</p>
                                <ul className="list-disc list-inside space-y-1 text-slate-700">
                                    {riskAnalysis.indicators.map((indicator, index) => (
                                        <li key={index}>{indicator}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    {status === 'denied' && (
                        <button onClick={resetForm} className="mt-6 w-full flex items-center justify-center gap-2 rounded-md bg-slate-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors">
                            Try Again
                        </button>
                    )}
                </div>
            )}
        </div>
    );
  }
  
  if (countries.length === 0) {
    return (
        <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">No Countries Available</h2>
            <p className="text-slate-500">An administrator needs to add countries to enable payments.</p>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">
          Country
        </label>
        <select
          id="country"
          value={countryCode}
          onChange={(e) => { setCountryCode(e.target.value); setSelectedMethod(null); }}
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-slate-50"
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            {selectedCountry.paymentMethods.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setSelectedMethod(method)}
                className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${selectedMethod === method ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500' : 'border-slate-300 bg-white hover:border-blue-400'}`}
              >
                {getPaymentMethodIcon(method)}
                <span className="ml-2 text-sm font-semibold">{method}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
          Amount
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{selectedCountry?.currency.symbol || '$'}</span>
          </div>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="block w-full rounded-md border-slate-300 pl-7 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-slate-50"
          />
        </div>
      </div>
      
      {status === 'error' && feedbackMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3" role="alert">
          <p>{feedbackMessage}</p>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={!selectedMethod || !amount || !selectedCountry}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Pay Securely
          <ArrowRightIcon className="w-4 h-4" />
        </button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-3">
            <SparklesIcon className="w-3 h-3 text-blue-500"/>
            AI-powered fraud analysis by Gemini
        </p>
      </div>
    </form>
  );
};
