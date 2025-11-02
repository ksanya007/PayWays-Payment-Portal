
import React, { useState, useMemo, useEffect } from 'react';
import type { Country, Payment, PaymentMethod } from '../types';
import { ALL_PAYMENT_METHODS } from '../constants';
import { PencilIcon, TrashIcon, PlusIcon } from './Icons';

interface AdminDashboardProps {
  countries: Country[];
  payments: Payment[];
  onAddCountry: (country: Country) => void;
  onUpdateCountry: (country: Country) => void;
  onDeleteCountry: (countryCode: string) => void;
}

const CountryFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (country: Country) => void;
    countryToEdit?: Country | null;
}> = ({ isOpen, onClose, onSubmit, countryToEdit }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [currencyCode, setCurrencyCode] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [selectedMethods, setSelectedMethods] = useState<Set<PaymentMethod>>(new Set());

    useEffect(() => {
        if (countryToEdit) {
            setName(countryToEdit.name);
            setCode(countryToEdit.code);
            setCurrencyCode(countryToEdit.currency.code);
            setCurrencySymbol(countryToEdit.currency.symbol);
            setSelectedMethods(new Set(countryToEdit.paymentMethods));
        } else {
            setName('');
            setCode('');
            setCurrencyCode('');
            setCurrencySymbol('');
            setSelectedMethods(new Set());
        }
    }, [countryToEdit, isOpen]);
    
    if (!isOpen) return null;

    const handleMethodToggle = (method: PaymentMethod) => {
        const newMethods = new Set(selectedMethods);
        newMethods.has(method) ? newMethods.delete(method) : newMethods.add(method);
        setSelectedMethods(newMethods);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ 
            name, 
            code, 
            paymentMethods: Array.from(selectedMethods),
            currency: { code: currencyCode, symbol: currencySymbol }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">{countryToEdit ? 'Edit Country' : 'Add Country'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="country-name" className="block text-sm font-medium text-slate-700">Country Name</label>
                        <input id="country-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="country-code" className="block text-sm font-medium text-slate-700">Country Code (2 letters)</label>
                        <input id="country-code" type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} required maxLength={2} minLength={2} disabled={!!countryToEdit} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 disabled:bg-slate-100 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="currency-code" className="block text-sm font-medium text-slate-700">Currency Code (e.g. USD)</label>
                            <input id="currency-code" type="text" value={currencyCode} onChange={e => setCurrencyCode(e.target.value.toUpperCase())} required maxLength={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="currency-symbol" className="block text-sm font-medium text-slate-700">Currency Symbol (e.g. $)</label>
                            <input id="currency-symbol" type="text" value={currencySymbol} onChange={e => setCurrencySymbol(e.target.value)} required maxLength={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Payment Methods</label>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {ALL_PAYMENT_METHODS.map(method => (
                                <label key={method} className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer ${selectedMethods.has(method) ? 'bg-blue-100 border-blue-400' : 'bg-white hover:bg-slate-50'}`}>
                                    <input type="checkbox" checked={selectedMethods.has(method)} onChange={() => handleMethodToggle(method)} className="rounded text-blue-600 focus:ring-blue-500" />
                                    <span>{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 text-sm font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">Save Country</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ countries, payments, onAddCountry, onUpdateCountry, onDeleteCountry }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [countryToEdit, setCountryToEdit] = useState<Country | null>(null);

    const summary = useMemo(() => {
        // Note: This summary doesn't convert currencies and sums up different currency amounts directly.
        // For a real app, you'd need currency conversion rates.
        return {
            totalTransactions: payments.length,
            totalVolume: payments.reduce((sum, p) => sum + p.amount, 0),
        }
    }, [payments]);

    const handleEditClick = (country: Country) => {
        setCountryToEdit(country);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setCountryToEdit(null);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (country: Country) => {
        countryToEdit ? onUpdateCountry(country) : onAddCountry(country);
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-600">Total Transactions</p>
                    <p className="text-2xl font-bold">{summary.totalTransactions}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-600">Total Payment Volume (Mixed Currencies)</p>
                    <p className="text-2xl font-bold">~ ${summary.totalVolume.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-700">Manage Countries</h3>
                <button onClick={handleAddClick} className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm">
                    <PlusIcon className="w-4 h-4" />
                    Add Country
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <ul className="divide-y divide-slate-200">
                    {countries.length > 0 ? (
                        countries.map(country => (
                            <li key={country.code} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                <div>
                                    <p className="font-semibold">{country.name} ({country.code} - {country.currency.code})</p>
                                    <p className="text-xs text-slate-500">{country.paymentMethods.join(', ')}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditClick(country)} className="p-2 text-slate-500 hover:text-blue-600" title="Edit"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => onDeleteCountry(country.code)} className="p-2 text-slate-500 hover:text-red-600" title="Delete"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-4 text-center text-slate-500">No countries found. Add one to get started.</li>
                    )}
                </ul>
            </div>
            
            <CountryFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                countryToEdit={countryToEdit}
            />
        </div>
    );
};
