
import React, { useState, useEffect, useMemo } from 'react';
import { PaymentForm } from './components/PaymentForm';
import { PaymentHistory } from './components/PaymentHistory';
import { Auth } from './components/Auth';
import { AdminDashboard } from './components/AdminDashboard';
import type { Payment, User, Country } from './types';
import { ShieldCheckIcon, ClockIcon, LogoutIcon, CogIcon } from './components/Icons';
import { INITIAL_COUNTRIES } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [view, setView] = useState<'app' | 'admin'>('app');
  const [activeTab, setActiveTab] = useState<'payment' | 'history'>('payment');

  const getFromStorage = (key: string, defaultValue: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key “${key}”:`, error);
      return defaultValue;
    }
  };

  const setToStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    setPayments(getFromStorage('paymentHistory', []));
    setCountries(getFromStorage('countries', INITIAL_COUNTRIES));

    const sessionUserEmail = sessionStorage.getItem('currentUserEmail');
    if (sessionUserEmail) {
      const allUsers = getFromStorage('users', []);
      const user = allUsers.find((u: User) => u.email === sessionUserEmail);
      if (user) setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    setToStorage('paymentHistory', payments);
  }, [payments]);

  useEffect(() => {
    setToStorage('countries', countries);
  }, [countries]);

  const handleAuthSuccess = (email: string) => {
    const allUsers = getFromStorage('users', []);
    const user = allUsers.find((u: User) => u.email === email);
    if (user) {
        setCurrentUser(user);
        sessionStorage.setItem('currentUserEmail', user.email);
        setView('app');
        setActiveTab('payment');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUserEmail');
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'date'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      userId: currentUser?.id,
    };
    setPayments(prevPayments => [newPayment, ...prevPayments]);
    setActiveTab('history');
  };
  
  const addCountry = (country: Country) => {
    if (countries.some(c => c.code.toLowerCase() === country.code.toLowerCase())) {
        alert('Country with this code already exists.');
        return;
    }
    setCountries(prev => [...prev, country].sort((a, b) => a.name.localeCompare(b.name)));
  };
  const updateCountry = (updatedCountry: Country) => {
    setCountries(prev => prev.map(c => c.code === updatedCountry.code ? updatedCountry : c));
  };
  const deleteCountry = (countryCode: string) => {
    if (window.confirm('Are you sure you want to delete this country? This action cannot be undone.')) {
        setCountries(prev => prev.filter(c => c.code !== countryCode));
    }
  };

  const userPayments = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.isAdmin) return payments;
    return payments.filter(p => p.userId === currentUser.id);
  }, [currentUser, payments]);

  if (!currentUser) {
    return (
      <div className="bg-slate-100 min-h-screen font-sans text-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <header className="text-center mb-6">
            <h1 className="text-4xl font-bold text-slate-900">PayWays</h1>
            <p className="text-slate-600 mt-2">Your trusted global payment partner</p>
          </header>
          <Auth
            onAuthSuccess={handleAuthSuccess}
            getUsers={() => getFromStorage('users', [])}
            setUsers={(users) => setToStorage('users', users)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
      <div className="container mx-auto max-w-lg p-4">
        <header className="text-center my-6 relative">
          <h1 className="text-4xl font-bold text-slate-900">PayWays</h1>
          <p className="text-slate-600 mt-2">Welcome, {currentUser.email}</p>
          <div className="absolute top-0 right-0 flex gap-2">
            {currentUser.isAdmin && (
                <button onClick={() => setView(v => v === 'app' ? 'admin' : 'app')} className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors" title={view === 'app' ? "Admin Dashboard" : "Back to App"}>
                    <CogIcon className="w-6 h-6 text-slate-700"/>
                </button>
            )}
            <button onClick={handleLogout} className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors" title="Logout">
              <LogoutIcon className="w-6 h-6 text-slate-700"/>
            </button>
          </div>
        </header>

        <main className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {view === 'app' && (
            <>
              <div className="flex">
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`flex-1 p-4 text-center font-semibold flex items-center justify-center gap-2 transition-colors duration-300 ${activeTab === 'payment' ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-200'}`}
                >
                  <ShieldCheckIcon className="w-5 h-5" />
                  New Payment
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 p-4 text-center font-semibold flex items-center justify-center gap-2 transition-colors duration-300 ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-200'}`}
                >
                  <ClockIcon className="w-5 h-5" />
                  History
                  {userPayments.length > 0 && (
                     <span className="bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{userPayments.length}</span>
                  )}
                </button>
              </div>
              
              <div className="p-6 md:p-8">
                {activeTab === 'payment' && <PaymentForm onPaymentSuccess={addPayment} countries={countries} />}
                {activeTab === 'history' && <PaymentHistory payments={userPayments} />}
              </div>
            </>
          )}

          {view === 'admin' && currentUser.isAdmin && (
            <div className="p-6 md:p-8">
                <AdminDashboard 
                    countries={countries}
                    payments={payments}
                    onAddCountry={addCountry}
                    onUpdateCountry={updateCountry}
                    onDeleteCountry={deleteCountry}
                />
            </div>
          )}
        </main>

        <footer className="text-center text-xs text-slate-500 mt-8">
          <p>&copy; {new Date().getFullYear()} PayWays. All rights reserved.</p>
          <p className="mt-1">All transactions are simulated and secured for demonstration purposes.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
