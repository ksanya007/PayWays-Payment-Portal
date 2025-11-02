
import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from './Icons';
import type { User } from '../types';

interface AuthProps {
  onAuthSuccess: (email: string) => void;
  getUsers: () => User[];
  setUsers: (users: User[]) => void;
}

const simpleHash = (str: string) => {
    // NOTE: This is NOT a secure hash. For demonstration only.
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return `simulated_hash_${hash}`;
};

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, getUsers, setUsers }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    const users = getUsers();
    const passwordHash = simpleHash(password);

    if (isLogin) {
      const user = users.find(u => u.email === email && u.passwordHash === passwordHash);
      if (user) {
        onAuthSuccess(user.email);
      } else {
        setError('Invalid email or password.');
      }
    } else {
      if (users.some(u => u.email === email)) {
        setError('An account with this email already exists.');
        return;
      }
      const newUser: User = {
        id: Date.now().toString(),
        email,
        passwordHash,
        isAdmin: email.toLowerCase() === 'admin@payways.com',
      };
      setUsers([...users, newUser]);
      onAuthSuccess(newUser.email);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <div className="text-center bg-yellow-100 text-yellow-800 text-xs p-2 rounded-md mb-4" role="alert">
          <p>This is a simulated auth system. Use <strong>admin@payways.com</strong> for admin access.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-slate-50"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password"  className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-slate-50"
              placeholder="••••••••"
            />
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-6">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-semibold text-blue-600 hover:text-blue-500 ml-1">
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  );
};